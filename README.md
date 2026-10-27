# agent-builder-docs: Claude Code skill

Rewrites WSO2 Agent Builder docs pages (`wso2/docs-integrator`, branch `wso2-agent-builder`) that were copied from WSO2 Integrator. It verifies every step in the real app, retakes screenshots with a Playwright harness, and opens one PR per page.

## Install (you can paste this whole section to Claude Code)

> Claude: follow these steps exactly. Ask the user before anything that needs their input (sign-in, choosing pages).

**Prerequisites (macOS):**
- Claude Code
- `gh` (signed in, with access to `wso2/docs-integrator`), `git`, Node.js 18+, Python 3
- **WSO2 Agent Builder** installed in `/Applications`, with any extension drop installed as its README says. Check with `"/Applications/WSO2 Agent Builder.app/Contents/Resources/app/bin/code" --list-extensions --show-versions`.

**1. Install the skill.** The skills folder is `~/.claude/skills`, or `$CLAUDE_CONFIG_DIR/skills` if that variable is set:

```sh
SKILLS_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills"
mkdir -p "$SKILLS_DIR"
git clone https://github.com/MohamedSabthar/agent-builder-docs-skill.git "$SKILLS_DIR/agent-builder-docs"
cd "$SKILLS_DIR/agent-builder-docs" && npm install && chmod +x launch.sh
```

To update later: `git -C "$SKILLS_DIR/agent-builder-docs" pull`.

**2. Set up the docs repo** (skip if you already have it):

```sh
gh repo fork wso2/docs-integrator --clone --remote   # origin = your fork, upstream = wso2
cd docs-integrator && git fetch upstream wso2-agent-builder
cd en && npm install && cd .. && git checkout -- package-lock.json
```

**3. Prepare Agent Builder for screenshots.** Add these to `~/Library/Application Support/WSO2 Agent Builder/User/settings.json` (merge with existing keys):

```json
{
  "workbench.colorTheme": "Light Modern",
  "debug.toolBarLocation": "hidden",
  "workbench.tips.enabled": false
}
```

**4. Start the app with the harness and sign in:**

```sh
osascript -e 'quit app "WSO2 Agent Builder"'      # the harness needs its own launch
"$SKILLS_DIR/agent-builder-docs/launch.sh" &      # CDP on port 9333, normal profile
```

Then **the user** clicks **Sign In** in Agent Builder and completes the browser login. Running agents needs it. On the welcome page, create a sample project with **Create** → **Agentic Integration**, located at `~/agent-builder-docs-work/sample-project` (project "Support Desk", integration `support_agent`).

**5. Check the install:** run `node "$SKILLS_DIR/agent-builder-docs/example-step.mjs"` once an agent named `supportAgent` exists. It should print a screenshot path under `~/agent-builder-docs-work/screenshots/`.

**Screen size:** screenshots are macOS full screen at default zoom. The default `AB_WIN=1512x945` matches a 1512×982-point MacBook display (3024×1890 images). On other displays, set `AB_WIN` to your full-screen size in CSS pixels; the harness reports it if it doesn't match.

## Use

In Claude Code, from the docs repo:

```
/agent-builder-docs Update the Memory page (en/docs/develop-and-test/integration-artifacts/ai-integrations/agents/memory.md)
```

or just ask: "Rewrite the memory.md Agent Builder docs page". Claude reads `SKILL.md`, goes through every step in the app, retakes screenshots, shows you the page on localhost, and opens the PR after you approve.

## What's in here

| File | Purpose |
|---|---|
| `SKILL.md` | The workflow Claude follows |
| `doc-conventions.md` | Branch, PR, screenshot and verification rules |
| `product.md`, `ui-map.md`, `flow-*.md`, `commands.md`, `labels-source.md` | Verified UI knowledge (labels, click paths, generated code) |
| `lib.mjs`, `launch.sh`, `example-step.mjs`, `package.json` | Playwright harness that drives the Electron app over CDP (`recordGif` needs `ffmpeg`) |
| `demo-mcp-server.mjs` | Fake stdio MCP server for MCP screenshots |
| `linkcheck.py` | Checks every link and anchor on built pages, including cross-product links |

Notes were verified against `wso2.ballerina@6.2.0-SNAPSHOT` and `wso2.wso2-integrator@1.1.26081017`. When the UI changes, update the notes so the whole team benefits (see Contributing).

## Contributing

This skill gets better every time someone documents a new page. Please send what you learn back:

- **New or changed UI:** add or update a `flow-<feature>.md` note with the exact click path, labels, form fields and generated code, plus the extension versions you verified against.
- **New conventions or reviewer feedback:** add them to `doc-conventions.md`.
- **Harness fixes:** keep `lib.mjs` helpers small and commented, and test them with `example-step.mjs`.

Open a PR against `main` (fork the repo, or ask to be added as a collaborator). Claude can do it for you: "add what we learned about the Memory page to the agent-builder-docs skill and open a PR".
