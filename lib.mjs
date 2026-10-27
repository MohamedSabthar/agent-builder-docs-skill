// Helpers for driving a running WSO2 Agent Builder (started by launch.sh) over CDP.
// See SKILL.md for usage and example-step.mjs for a minimal step script.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { homedir } from 'node:os';

// Where screenshots (and the sample project) go. Override with AB_WORK.
export const WORK = process.env.AB_WORK || resolve(homedir(), 'agent-builder-docs-work');
const PORT = process.env.AB_CDP_PORT || 9333;

// Screenshot size: macOS full screen at default zoom and 2x. On a 1512x982-point MacBook
// display that is 1512x945 -> 3024x1890 images. Set AB_WIN=WIDTHxHEIGHT (CSS px) to match
// your display's full-screen size. Never use zoom or viewport emulation to fake a size.
const [winW, winH] = (process.env.AB_WIN || '1512x945').split('x').map(Number);
export const WIN = { width: winW, height: winH };

export async function connect() {
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${PORT}`);
  const page = browser.contexts().flatMap(c => c.pages())
    .find(p => p.url().includes('workbench'));
  if (!page) throw new Error('workbench page not found; is launch.sh running?');
  return { browser, page };
}

// Put the real window into macOS full screen (see WIN). Safe to call every step: it only
// toggles when the window isn't already full screen.
export async function setWindowSize(page, { width, height } = WIN) {
  const size = () => page.evaluate(() => [innerWidth, innerHeight, devicePixelRatio]);
  let [iw, ih, dpr] = await size();
  if (iw !== width || ih !== height) {
    await palette(page, 'View: Toggle Full Screen');
    await page.waitForTimeout(2500);
    [iw, ih, dpr] = await size();
  }
  if (iw !== width || ih !== height || dpr !== 2)
    throw new Error(`window is ${iw}x${ih}@${dpr}x, wanted ${width}x${height}@2x`);
}

// Run a command by its exact palette title (e.g. 'View: Hide Panel'). Fuzzy "first match"
// is unreliable (it once opened Search instead of closing the panel), so only an exact
// title is accepted; otherwise it throws with the candidates it saw.
export async function palette(page, title) {
  await page.keyboard.press('Meta+Shift+P');
  const input = page.locator('.quick-input-widget input');
  await input.waitFor();
  await input.fill('>' + title);
  await page.waitForTimeout(600);
  const rows = page.locator('.quick-input-list .monaco-list-row');
  const labels = await rows.evaluateAll(rs => rs.map(r => r.querySelector('.label-name')?.textContent?.trim() || ''));
  const i = labels.findIndex(l => l === title);
  if (i < 0) { await page.keyboard.press('Escape'); throw new Error(`palette: no exact "${title}"; saw: ${labels.slice(0, 8).join(' | ')}`); }
  await rows.nth(i).click();
  await page.waitForTimeout(300);
}

// Declutter before a shot (the window is small, so close what isn't the subject).
// Each checks visibility first, so they're safe to call repeatedly.
const visible = (page, sel) => page.locator(sel).first().isVisible().catch(() => false);
export async function hidePanel(page) { if (await visible(page, '.part.panel.bottom')) await palette(page, 'View: Hide Panel'); }
export async function hideSidebar(page) { if (await visible(page, '.part.sidebar.left')) await palette(page, 'View: Close Primary Side Bar'); }
export async function showSidebar(page) { if (!(await visible(page, '.part.sidebar.left'))) await palette(page, 'View: Toggle Primary Side Bar Visibility'); }
export async function hideAuxBar(page) { if (await visible(page, '.part.auxiliarybar')) await palette(page, 'View: Toggle Secondary Side Bar Visibility'); }
export async function dismissToasts(page) { if (await visible(page, '.notification-toast')) await palette(page, 'Notifications: Clear All Notifications'); }
export async function declutter(page, { sidebar = true } = {}) {
  await hidePanel(page); await hideAuxBar(page); await dismissToasts(page);
  if (!sidebar) await hideSidebar(page);
  await page.waitForTimeout(400);
}

// ---- Webviews ---------------------------------------------------------------
// In Electron, VS Code webviews are out-of-process iframe targets that Playwright's
// connectOverCDP doesn't attach to, so talk to them with raw CDP. Each target's
// document is VS Code's webview host; the extension UI is in its child
// iframe#active-frame (same origin, so reachable through contentDocument).

class Webview {
  constructor(ws, info) { this.ws = ws; this.info = info; this.id = 0; this.pending = new Map();
    ws.on('message', m => { const d = JSON.parse(m); this.pending.get(d.id)?.(d); this.pending.delete(d.id); }); }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise(r => { this.pending.set(id, r); this.ws.send(JSON.stringify({ id, method, params })); });
  }
  // Run fn(doc, arg) inside the extension's document; returns a JSON-serializable result.
  async run(fn, arg) {
    const expr = `(() => { const doc = document.querySelector('iframe#active-frame')?.contentDocument || document;
      return (${fn})(doc, ${JSON.stringify(arg ?? null)}); })()`;
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || 'eval failed');
    return r.result?.result?.value;
  }
  text() { return this.run(doc => doc.body?.innerText || ''); }
  // Find the smallest visible element whose text (or aria-label/title) matches and
  // return its centre in this target's viewport coordinates.
  locate(text, { exact = true, nth = 0 } = {}) {
    return this.run((doc, { text, exact, nth }) => {
      const norm = s => (s || '').replace(/\s+/g, ' ').trim();
      const ok = s => exact ? norm(s) === text : norm(s).includes(text);
      const els = [...doc.querySelectorAll('*')].filter(e => {
        const r = e.getBoundingClientRect(); if (!r.width || !r.height) return false;
        // SVG elements (canvas labels) have no innerText, and their textContent includes
        // the <title> tooltip, so use only their own text nodes.
        const t = e instanceof doc.defaultView.HTMLElement ? e.innerText
          : [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.data).join('');
        return ok(t) || ok(e.getAttribute('aria-label')) || ok(e.getAttribute('title'));
      }).filter((e, _, all) => !all.some(o => o !== e && e.contains(o)));
      // Prefer clickable matches (a heading often shares a button's label).
      const clickable = e => e.closest('button,a,[role=button],vscode-button,[role=option],[role=menuitem]');
      const ordered = [...els.filter(clickable), ...els.filter(e => !clickable(e))];
      const el = ordered.at(nth); if (!el) return null;
      const r = el.getBoundingClientRect();
      const frame = document.querySelector('iframe#active-frame')?.getBoundingClientRect() || { x: 0, y: 0 };
      // highlight the clickable container (e.g. the whole button), not just its label
      const hr = (clickable(el) || el).getBoundingClientRect();
      return { x: frame.x + r.x + r.width / 2, y: frame.y + r.y + r.height / 2, label: norm(el.textContent).slice(0, 60),
        box: { x: frame.x + hr.x, y: frame.y + hr.y, width: hr.width, height: hr.height } };
    }, { text, exact, nth });
  }
  async box(text, opts) { return (await this.locate(text, opts))?.box; }
  // Click the topmost visible close (✕) icon: dialogs and drawers ignore Escape.
  async closeTopmost() {
    const p = await this.run(doc => {
      const els = [...doc.querySelectorAll('.codicon-close, [aria-label="Close"], [title="Close"]')]
        .filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height; });
      const el = els.at(-1); if (!el) return null;
      const r = el.getBoundingClientRect();
      const frame = document.querySelector('iframe#active-frame')?.getBoundingClientRect() || { x: 0, y: 0 };
      return { x: frame.x + r.x + r.width / 2, y: frame.y + r.y + r.height / 2 };
    });
    if (!p) return 'no close button';
    await this.mouse(p.x, p.y);
    return 'closed';
  }
  async mouse(x, y, { click = true } = {}) {
    await this.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    if (!click) return;
    await this.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
    await this.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
  }
  // Real mouse click (hover + press + release) on the matching element.
  async clickText(text, opts) {
    const p = await this.locate(text, opts);
    if (!p) return `NOT FOUND: ${text}`;
    await this.mouse(p.x, p.y);
    return `clicked: ${p.label}`;
  }
  async hoverText(text, opts) {
    const p = await this.locate(text, opts);
    if (!p) return `NOT FOUND: ${text}`;
    await this.mouse(p.x, p.y, { click: false });
    return `hovered: ${p.label}`;
  }
  // Focus an input found by its label text / placeholder / aria-label, clear it and type.
  async fill(label, value) {
    const res = await this.run((doc, label) => {
      // vscode-text-field/-area are web components: label in their light-DOM text, input in the shadow root
      const inputs = [...doc.querySelectorAll('vscode-text-field,vscode-text-area,input:not([type=radio]):not([type=checkbox]),textarea,[contenteditable=true]')];
      const byAttr = inputs.find(i => [i.getAttribute('placeholder'), i.getAttribute('aria-label'), i.getAttribute('name'), i.id,
        i.tagName.startsWith('VSCODE') ? i.innerText : ''].some(a => a && a.includes(label)));
      let el = byAttr;
      if (!el) { // nearest input after a label-ish element with that text
        const lab = [...doc.querySelectorAll('label,span,div,p')].find(e => e.children.length === 0 && e.innerText?.trim().startsWith(label));
        if (lab) el = inputs.find(i => lab.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_FOLLOWING);
      }
      if (!el) return 'NOT FOUND';
      // vscode-text-field etc. keep the real input in a shadow root
      const real = el.shadowRoot?.querySelector('input,textarea') || el;
      real.focus(); if (real.select) real.select(); else doc.execCommand('selectAll');
      return 'ok';
    }, label);
    if (res !== 'ok') return `fill ${label}: ${res}`;
    await this.send('Input.insertText', { text: value });
    return `filled ${label}`;
  }
  // Type into the nth element matching a CSS selector (e.g. '.cm-content' for the
  // CodeMirror prompt editors used by Role/Instructions).
  async fillSelector(selector, nth, value) {
    const res = await this.run((doc, { selector, nth }) => {
      const el = doc.querySelectorAll(selector)[nth]; if (!el) return 'NOT FOUND';
      const real = el.shadowRoot?.querySelector('input,textarea') || el;
      real.focus(); if (real.select) real.select(); else doc.execCommand('selectAll');
      return 'ok';
    }, { selector, nth });
    if (res !== 'ok') return `fill ${selector}[${nth}]: ${res}`;
    await this.send('Input.insertText', { text: value });
    return `filled ${selector}[${nth}]`;
  }
  // Send a key (e.g. 'Escape', 'Enter') to whatever is focused in this webview.
  async key(key) {
    const codes = { Escape: 27, Enter: 13, Tab: 9, ArrowDown: 40, ArrowUp: 38 };
    for (const type of ['keyDown', 'keyUp'])
      await this.send('Input.dispatchKeyEvent', { type, key, code: key, windowsVirtualKeyCode: codes[key] });
  }
  close() { this.ws.close(); }
}

export async function webviews() {
  const { default: WebSocket } = await import('ws');
  const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
  const out = [];
  for (const t of list.filter(t => t.type === 'iframe' && t.url.startsWith('vscode-webview'))) {
    const ws = new WebSocket(t.webSocketDebuggerUrl);
    await new Promise((r, j) => { ws.once('open', r); ws.once('error', j); });
    out.push(new Webview(ws, t));
  }
  return out;
}

// First webview whose text contains `text` (polls until timeout).
export async function webviewWith(text, timeout = 20000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    for (const w of await webviews()) {
      try { if ((await w.text()).includes(text)) return w; } catch {}
      w.close();
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`no webview shows "${text}"`);
}

// Screenshot the window. `highlight` = list of {x, y, width, height} boxes in window CSS px
// (from Webview.box / workbench locator.boundingBox) to outline in red, like the existing docs images.
export async function shot(page, rel, { highlight = [] } = {}) {
  const out = resolve(WORK, 'screenshots', rel);
  mkdirSync(dirname(out), { recursive: true });
  if (highlight.length) await page.evaluate(boxes => {
    for (const b of boxes) {
      const d = document.createElement('div');
      d.className = '__kb_highlight';
      Object.assign(d.style, { position: 'fixed', left: `${b.x - 4}px`, top: `${b.y - 4}px`, width: `${b.width + 8}px`,
        height: `${b.height + 8}px`, border: '2px solid #e5352b', borderRadius: '2px', zIndex: 2147483647, pointerEvents: 'none' });
      document.body.appendChild(d);
    }
  }, highlight);
  await page.screenshot({ path: out });
  await page.evaluate(() => document.querySelectorAll('.__kb_highlight').forEach(e => e.remove()));
  return out;
}

// Webview iframe's position in the window, to turn webview coordinates into window coordinates.
export async function webviewOffset(page, wv) {
  const id = new URL(wv.info.url).searchParams.get('id');
  return page.evaluate(id => {
    const f = [...document.querySelectorAll('iframe.webview')].find(f => f.src.includes(id) || f.name === id);
    const r = (f || document.querySelector('iframe.webview.ready')).getBoundingClientRect();
    return { x: r.x, y: r.y };
  }, id);
}

// Window-space box of a webview element matched by text, for shot({ highlight }).
export async function boxInWebview(page, wv, text, opts) {
  const b = await wv.box(text, opts);
  if (!b) throw new Error(`no element "${text}" to highlight`);
  const o = await webviewOffset(page, wv);
  return { x: b.x + o.x, y: b.y + o.y, width: b.width, height: b.height };
}

// Visible text of the workbench plus every webview, for quick "what's on screen" dumps.
export async function dumpText(page, max = 4000) {
  const parts = [`--- workbench\n${(await page.evaluate(() => document.body.innerText)).trim().slice(0, max)}`];
  for (const w of await webviews()) {
    try { const t = (await w.text()).trim(); if (t) parts.push(`--- webview ${w.info.url.slice(16, 28)}\n${t.slice(0, max)}`); } catch {}
    w.close();
  }
  return parts.join('\n');
}

// Close the right-hand side drawer (Add Tool, Edit Agent, node panels). Its ✕ has no
// accessible label, so click its position near the top-right of the editor area.
export async function closeDrawer(page) {
  const w = await page.evaluate(() => innerWidth);
  await page.mouse.click(w - 27, 97); await page.waitForTimeout(1200);
}

// Close drawers until none of the known drawer markers is visible in the webview.
const DRAWER_MARKERS = ['Create and add tools', 'Add Tool -', 'Represents an agent.', 'Configure Model Provider',
  'Executes the agent for a given user query.', 'Select node from node panel.', 'Edit Agent'];
export async function resetDrawers(page, wv) {
  for (let i = 0; i < 4; i++) {
    const t = await wv.text();
    if (!DRAWER_MARKERS.some(m => t.includes(m))) return 'clean';
    await closeDrawer(page);
  }
  return 'still open';
}

// Window-space centre of the first input/textarea that follows the element whose own text is `label`.
export async function inputAfter(page, wv, label) {
  const o = await webviewOffset(page, wv);
  const p = await wv.run((doc, label) => {
    const lab = [...doc.querySelectorAll('*')].find(e => e.children.length === 0 && e.textContent.trim() === label);
    if (!lab) return null;
    const el = [...doc.querySelectorAll('textarea,input:not([type=checkbox])')].find(i => lab.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_FOLLOWING);
    el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect();
    return { x: r.x + Math.min(r.width / 2, 120), y: r.y + r.height / 2 };
  }, label);
  return p && { x: p.x + o.x, y: p.y + o.y };
}
// Click into the input after `label` and type (real key events, so suggestion lists react).
export async function typeAfter(page, wv, label, text) {
  const p = await inputAfter(page, wv, label);
  if (!p) return `NOT FOUND: ${label}`;
  await page.mouse.click(p.x, p.y); await page.waitForTimeout(300);
  await page.keyboard.type(text, { delay: 25 }); await page.waitForTimeout(700);
  return `typed ${label}`;
}

// Click the suggestion whose text is exactly `text`, shown below the last-focused type field.
export async function pickSuggestion(page, wv, text) {
  const o = await webviewOffset(page, wv);
  const p = await wv.run((doc, text) => {
    const active = doc.activeElement?.getBoundingClientRect();
    const cands = [...doc.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent.trim() === text)
      .map(e => ({ e, r: e.getBoundingClientRect() })).filter(c => c.r.width && (!active || c.r.y > active.y + 5));
    if (!cands.length) return null;
    const r = cands[0].r; return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, text);
  if (!p) return `no suggestion ${text}`;
  await page.mouse.click(p.x + o.x, p.y + o.y); await page.waitForTimeout(600);
  return `picked ${text}`;
}

// Clear lingering hover tooltips (e.g. the editor's "More Actions..."), then park the mouse.
export async function clearHover(page) {
  const [w, h] = await page.evaluate(() => [innerWidth, innerHeight]);
  await page.mouse.move(Math.round(w * 0.44), 46); await page.waitForTimeout(300);
  await page.mouse.move(400, Math.round(h * 0.63)); await page.waitForTimeout(300);
  await page.keyboard.press('Escape');
  await page.mouse.move(Math.round(w * 0.46), h - 45); await page.waitForTimeout(1500);
}
