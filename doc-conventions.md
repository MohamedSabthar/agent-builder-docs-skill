# Docs repo conventions (wso2/docs-integrator, `wso2-agent-builder` branch)

## Branch and repo
- `wso2-agent-builder` is independently authored. The shared-content sync rules in CONTRIBUTING.md apply to `saas`, not here. The site title in `en/docusaurus.config.ts` is "WSO2 Agent Builder".
- The content was copied from `wso2-integrator` in PR #1049. Sections removed on this branch: Workflows, Tools, Automations, Homepage, Icons (#1052).
- Remotes: `origin` is your fork of docs-integrator, and `upstream` is `wso2/docs-integrator`.

## One PR per page
- Branch `docs/ab-<page>` from `upstream/wso2-agent-builder`. PR base: `wso2-agent-builder`.
- Title: "Update <Page name> page for Agent Builder".
- Body: `## Purpose` (the page was copied from the WSO2 Integrator docs and still names WSO2 Integrator / old UI / …) and `## What changed` (bullets). Examples: PRs #1091–#1096 and #1100–#1103, #1114–#1117.
- Add the `agent-builder` label (`gh pr create ... --label agent-builder`).
- No AI attribution in commits or PRs.
- Track progress in the team's "Agent Builder Documentation" sheet: the assignee sets Status to "PR sent" and adds the PR link.

## Editing pages
- **Edit in place.** Keep the slug, filename and anchors, because other pages link to them (grep `en/docs` for `<page>.md#` before renaming a heading). Change `description`, `keywords` (`wso2 agent builder`, …) and the body.
- Remove every "WSO2 Integrator" mention, Integrator-only concepts (Automation, Integration as API, Event Integration, the Artifacts page, "+ Add Artifact"), and `product://integrator/...` links (they point at the old Integrator site). Link on-branch pages instead, or keep the content inline.
- Use the product's own terms: **project** (workspace) and **agentic integration** (a package). See `product.md`.
- Keep product labels exactly as the UI shows them, even when they look odd (for example "Devant Chunker").
- **Order by usage:** put the most-used option first (for example, Create Custom Tool first in Tools).
- **Keep examples focused:** one subject per example. To show "call an agent inside a flow", use a plain flow (for example a separate HTTP service `/summaries`: Start → Return) and add a single agent step. Don't add a second agent to a flow that already calls one.
- When the UI offers a button for something, document the button, not hand-written code (for example **+ Decision** in the AI Agent Service view adds the `decision` resource).

## Screenshots
- **Filenames:** every image you add or retake gets a **`-v1.0` suffix** (for example `02-agent-flow-canvas-v1.0.png`). For a retaken image, add the `-v1.0` file, update every reference, and delete the old file if nothing else references it (grep `en/docs` and `en/src`).
- **Size:** full window at **default zoom** and 2x (retina). The reference setup is macOS full screen on a 1512×982-point MacBook display, which gives **3024×1890**. Existing images on the branch are 3024×1898, 3024×1890 and 3456×2168, all with the same text pixel size. Never use `window.zoomLevel` or viewport emulation to fake a size, and don't change the display scaling or Dock settings.
- **Theme:** **Light Modern** (`workbench.colorTheme`).
- **Declutter every shot:**
  - Close the panel and terminal (`hidePanel`).
  - Clear toasts (`dismissToasts`).
  - Hide the debug toolbar (`"debug.toolBarLocation": "hidden"`).
  - Collapse the sidebar for split views such as canvas plus chat (`hideSidebar`).
  - Clear hover tooltips (`clearHover`).
  - Show only the thing the step is about.
- **Annotate:** a red (#e5352b) 2px box around the element the step refers to (`shot(page, rel, { highlight: [box] })`).
- **Sample names:** use realistic ones (project "Support Desk", integration `support_agent`, agents `supportAgent` / `orderAssistant`). Avoid personal paths in visible fields.
- **Look at every screenshot before using it.** Common problems: a drawer or modal still open, a tooltip ("More Actions..."), a toast, the wrong agent's canvas, a stale breadcrumb, or a sidebar label from an earlier step.

## Verify before a PR
- Run `npx docusaurus build` in `en/` and check for new broken links. A clean build shows only two warnings ("package.json not found at CWD" and a vscode-languageserver-types critical dependency).
- Grep the page for `integrator|integration platform|product://integrator`. Any hit must be deliberate.
- Check that every image path exists.
- `npm install` in `en/` rewrites the **root** `package-lock.json`. Revert it with `git checkout -- package-lock.json` before committing.
- **Link check:** merge your page branches into a throwaway local branch, `npx docusaurus build`, `npx docusaurus serve --port 3001` (from `en/`), then run `python3 linkcheck.py <page-route> ...`. It checks every article link and anchor, and resolves `product://` links against https://wso2.com/integration-platform/docs/. Missing pages return 404 locally and 403 on wso2.com. Delete the throwaway branch afterwards.
