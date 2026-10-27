# Flow: Copilot panel ✅

## Open and sign in
- Open: palette **WSO2 Integrator: Open Copilot** (`ballerina.open.ai.panel`), the floating orb, or the overview composer ("What should your agent do?"). The panel tab is "WSO2 Agent Builder Copilot".
- Sign-in screen: orb, "WSO2 Agent Builder Copilot", "Your AI partner for building agents", **Login using your WSO2 Cloud account** ("Recommended • Managed authentication • No API keys required"), then "Or use your own AI provider": **Anthropic API Key**, **AWS Bedrock**, **Google Vertex AI**.
  - Right after a launch the panel can show this screen for a few seconds before it restores a saved session. Wait before clicking **Login**.

## Header and welcome
- Header left: **Usage:** `N%` (tooltip "Resets in 1d 4h 20m"), **Unlimited** (tooltip "Subject to fair usage policy.") when the account has no limit, **N/A** when unknown. Own-key sign-ins show a chip instead, for example "Anthropic (own key)". Take docs screenshots on a WSO2 Cloud sign-in.
- Header right: **Chats** (menu: "Search sessions...", a TODAY list, **+ New Chat**) and **Settings**.
- Welcome (new chat): orb, "WSO2 Agent Builder Copilot", "I can help you build, update, and understand your agent. Tell me what you'd like to do.", "Use / for commands", "Add files and context", **Watch Getting Started Guide**, and three starters: "Create a customer support agent with a chat trigger", "Add a tool to my agent that calls a REST API", "Explain what my agent does and which tools it uses".
- Composer: placeholder "What would you like to change?" (after a turn: "What should we do next?"), **Edit** / **Plan**, globe (web), `/`, attach, and the MCP chip while MCP is on. The composer is a contenteditable `div[role=textbox]`.

## Usage limit
Only reachable on a WSO2 Cloud account that hit its limit.
- Header **Usage: 100%** plus a refresh button ("Check usage again").
- Notice above the composer: "You've reached your Agent Builder Copilot usage limit, which resets in 2 days. **Request additional quota**." (the reset is a duration, not a date). Composer placeholder: "Usage limit exceeded".
- **Request additional quota** dialog: "Let the team know you'd like more Agent Builder Copilot quota this week.", "Add a message (optional)", "Your WSO2 account email will be included with this request so the team can follow up.", "Reach us at support@wso2.com.", **Cancel** / **Submit**. **Submit** sends a real request to the team: never press it for a screenshot.
- After a request: "…Your request for additional quota has been submitted. Reach us at support@wso2.com."

## Settings
- Back arrow and "Settings". **CUSTOMIZE AGENT BUILDER COPILOT**: **MCP servers** ("Off" or "2/2 connected · 5 tools"), **Skills** ("6 of 7 enabled"), **Agent instructions** ("No AGENTS.md"; the file icon creates `AGENTS.md` from a template or opens it).
- GENERAL: Show Copilot orb, Follow-up suggestions. INTEGRATIONS: GitHub Copilot **Authorize**. ACCOUNT: **Sign out**. Footer: "Settings persist across sessions".

## Skills
- **+ Add skill**; groups **BUILT-IN (5)** "Skills shipped with Agent Builder Copilot." (data-map, skill-creator, agent-builder, agent-evals, workflow-builder; always-on ones have no toggle), **PROJECT** "Saved to this project and shared with your team." (`.agents/skills`), **USER** "Available across all your projects." (`~/.ballerina/copilot/skills`). Toggle titles: "Disable skill" / "Enable skill".
- **Add skill** dialog: **Create new** / **Import** tabs, Type **Project** / **User** ("Shared with your team."), Name ("e.g. sql-helper"), Trigger / Description, Body (optional), **Cancel** / **Add**.
- Skill prompt, when a disabled skill matches the request: card "Skill Disabled" with the skill name, **Enable skill**, **Continue without it**, and a stop button. The agent first says "This matches a disabled skill: …". To reach it: turn a project skill off, then send a request that matches its description.
  - Product quirk: after **Continue without it** the stream shows "Using skill: undefined".

## MCP servers
- Settings → **MCP servers**: header toggle, reload, **+ Add server**.
- **AGENT MANAGER** (Agent Builder only): "Give Copilot access to your agents in Agent Manager. Adding one asks for your console URL, then opens your browser to sign in." Rows **Agents & Deployments** ("Create, build and deploy agents") and **Observability** ("Read logs, metrics and traces"), each with **Add**. Added servers go to the User scope and leave this list. Signing out of Agent Manager clears their sign-in; the rows then show "not signed in" and **Sign In**.
- **PROJECT (n)** "Available only within this project" and **USER (n)** "Available across all your projects", a file icon per scope (opens the JSON), rows like "<server> Stdio · 3 tools >" with hover icons **Edit server** / **Delete server** and a toggle ("Disable this server").
- **Add MCP server**: Scope **Project** / **User**, Name ("my-server"), Transport **Stdio** / **Streamable HTTP**. Stdio: Command ("e.g. npx, uvx, python"), Arguments (**+ Add argument**), Environment variables (**+ Add**). Streamable HTTP: URL, Headers, Headers from environment variables. **Cancel** / **Add**.
- **Edit MCP server**: same form, pre-filled; "Scope cannot be changed when editing. Delete and re-add to move scopes."; **Save**.
- Composer chip popover: MCP toggle, reload, **Manage**, servers by PROJECT / USER with toggles. Escape doesn't close it: click the chip again. With MCP off the chip is hidden.
- Files: user `~/.ballerina/copilot/mcp.json`, project `<project>/.mcp.json`. On `.mcp.json` the editor also shows its own MCP CodeLens ("▷ Start | More..."); don't click it.
- MCP tool calls run without an approval prompt.
- Screenshots: use `demo-mcp-server.mjs` (fake tools, no network) rather than real servers. Your own user-scope servers appear in every capture, and `npx` examples download packages when they connect. An entry with `"disabled": true` shows its form without starting.

## Changes made and review mode
- After a run: a **Changes made** card (Design Diagram; functions and declarations with **Added** / **Modified** tags; **Diagram** / **Code**; **Review**, hidden while review mode is open; **Revert**). **Revert** is available until the next run starts.
- **Review** opens review mode in the visualizer: the artifact title, **Reviewing Changes**, close (✕).
- Bottom bar: arrows (tooltips "Previous View" / "Next View"), a counter like `2 / 4` with a description below ("modification: function in main.bal"), and **Diff** / **New** / **Old** (button titles "Show old and new versions in one diagram", "Show new version", "Show old version"). The Removed / Added / Modified legend shows only with **Diff**.
- View 1 is the design diagram: **New** / **Old** only, opens on **New**. Module variables (the agent definition), listeners, enums and imports open as old and new code. Hovering a modified node shows its OLD and NEW source.
- To get a useful review, use two runs: the first builds the agent, the second changes it (for example modify one tool and add another), so the card shows both Modified and Added.
- Automation: match the toggle buttons by `title`. A `getByText('New')` can hit a hidden tooltip label.
- GIFs: `recordGif` in `lib.mjs`.
