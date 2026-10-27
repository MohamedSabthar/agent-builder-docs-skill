// A minimal step script. Copy it, change the middle, run with `node my-step.mjs`.
// The app must already be running via ./launch.sh.
import { connect, setWindowSize, declutter, showSidebar, webviewWith, webviewOffset, shot, clearHover, dumpText } from './lib.mjs';

const { page } = await connect();
await setWindowSize(page);            // full screen at the agreed size, or throws
await declutter(page); await showSidebar(page);

// Open an agent from the side bar, then click "Add Tool" on its canvas.
await page.locator('.part.sidebar .monaco-list-row', { hasText: /^supportAgent$/ }).first().click();
await page.waitForTimeout(4000);
const w = await webviewWith('Add Tool');
const o = await webviewOffset(page, w);
const b = await w.box('Add Tool');    // box in webview coordinates

await clearHover(page);
console.log(await shot(page, 'example/01-add-tool.png', {
  highlight: [{ x: b.x + o.x, y: b.y + o.y, width: b.width, height: b.height }],
}));
console.log(await w.clickText('Add Tool'));
await page.waitForTimeout(2000);
console.log((await dumpText(page, 1500)).slice(-1500));   // what's on screen now
process.exit(0);                       // don't close the browser: keep the app alive
