---
name: agent-builder-docs
description: Rewrite WSO2 Agent Builder docs pages (wso2/docs-integrator, branch wso2-agent-builder) that were copied from WSO2 Integrator. Verifies every step in the installed Agent Builder app, retakes screenshots with a Playwright harness that drives the Electron app over CDP, and opens one PR per page. Use when asked to update, rewrite, or fix an Agent Builder docs page, retake Agent Builder screenshots, or check Agent Builder docs links.
---

# Agent Builder docs rewrite

WSO2 Agent Builder is a VS Code–based product derived from WSO2 Integrator. Its docs live on the `wso2-agent-builder` branch of `wso2/docs-integrator`, and were copied from the Integrator docs. Pages still contain Integrator names, links, steps and screenshots. New users must see only Agent Builder.

Read these files (in this skill's folder) before starting:

| File | What's in it |
|---|---|
| `doc-conventions.md` | Repo, branch, PR, screenshot and verification rules. **Follow them exactly.** |
| `product.md` | Product facts, terminology map (Integrator → Agent Builder), install steps for extension drops |
| `ui-map.md` | Welcome page, create-project wizard, workbench, overview, Copilot, designer labels |
| `flow-create-agent.md`, `flow-tools.md`, `flow-gated-tools.md` | Verified click paths, labels, form fields and generated code |
| `commands.md` | Command IDs and palette titles |
| `labels-source.md` | Where to grep exact UI labels in the installed extensions |
| `lib.mjs`, `launch.sh`, `example-step.mjs` | Playwright harness for driving the app and taking screenshots |
| `linkcheck.py` | Link and anchor checker for built pages |

Everything in those notes was verified against `wso2.ballerina@6.2.0-SNAPSHOT` and `wso2.wso2-integrator@1.1.26081017`. If the installed versions differ, re-verify labels in the app before trusting them.

## Workflow (one page at a time)

1. **Set up once** (see README.md): docs repo with `origin` = your fork and `upstream` = wso2/docs-integrator, Agent Builder installed and signed in, and the harness dependencies installed (`npm install` in this folder).
2. **Branch:** `git fetch upstream wso2-agent-builder && git checkout -b docs/ab-<page> upstream/wso2-agent-builder`.
3. **Audit the page:** list Integrator mentions, `product://integrator` links, Integrator-only concepts, images (and whether other pages use them), and inbound links and anchors (`grep -rn "<page>.md#" en/docs`).
4. **Verify every step in the app** with the harness (below). Never document a label or flow from memory or from the old page: click through it. Record anything new in the relevant `flow-*.md` notes (or tell the user, if the skill folder is read-only).
5. **Capture screenshots** following `doc-conventions.md` (full screen, default zoom, Light Modern, decluttered, red highlight box, `-v1.0` suffix). Look at each image before using it.
6. **Rewrite the page in place:** frontmatter, intro, steps, tables, alt text, links. Keep slugs and anchors that other pages link to.
7. **Verify:** `npx docusaurus build`, grep for Integrator leftovers, check that every image exists, revert the root `package-lock.json`.
8. **Show the user** the page (`npm run start -- --host localhost` in `en/`, then open the page URL) and wait for their OK. They often have corrections; apply them and re-verify.
9. **Commit and open the PR** (title, body, `agent-builder` label per `doc-conventions.md`). No AI attribution.
10. After all pages are done, run the link check over all of them together.

## Driving the app

The harness attaches to a running Agent Builder over the Chrome DevTools Protocol (CDP), so app state survives between small step scripts.

```sh
# Quit any running Agent Builder first, then:
./launch.sh "$AB_WORK/sample-project"   # starts the app with CDP on port 9333 (keep it running)
node my-step.mjs                         # write small step scripts like example-step.mjs
```

- Use the **normal profile** (the default). Sign-in calls back through `wso2-agent-builder://`, which only reaches the default-profile instance, so an isolated profile can't sign in. Running agents and chat need sign-in (the Default WSO2 Model Provider).
- Webviews (welcome page, designer, forms, chat, trace viewer) are out-of-process iframes. Use `webviewWith(text)` and the `Webview` helpers (`clickText`, `fill`, `fillSelector`, `key`, `box`, `closeTopmost`), not Playwright locators.
- Canvas labels are SVG `<text>` elements; `clickText` handles them with real mouse events.
- Drawers and modals ignore Escape. Use `closeTopmost()`, `closeDrawer(page)`, or a breadcrumb.
- Some inputs (type fields with suggestions) need real key events: `typeAfter` and `pickSuggestion`, or `page.mouse.click` plus `page.keyboard.type` at fixed positions.
- With Do Not Disturb on (a crossed-out bell in the status bar), the "Run Integration" prompt from **Chat** is hidden. Use the palette command **WSO2 Integrator: Run Integration**.
- Keep a sample project in `$AB_WORK/sample-project` and reuse it. Its `Config.toml` holds a live model access token after sign-in, so never commit or share it.
- Take one small action per script, print what's on screen (`dumpText`), and look at the screenshot before moving on.

## Known product quirks (don't document them as features)

- Some UI text still says "WSO2 Integrator" (palette categories, the model provider hint, "Sign in with WSO2 Integration Platform"). Name commands without the prefix in docs, and report the text to the product team.
- After **+ Decision**, the agent canvas draws the chat service twice. Avoid that agent's canvas in unrelated screenshots.
- An Agent Chat trigger and an HTTP trigger on the same agent default to the same path on port 9090. Give them different paths.
- **Clear Chat** doesn't remove a pending approval card. Use a new service path for a clean chat.
