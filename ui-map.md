# UI map

Status: **from bundle strings**, not yet confirmed in the running app. Mark a section ✅ once you've seen it.

## Activity bar / sidebar
- The **WSO2 Agent Builder** container has the **Agents** view (`wso2-agent-builder.explorer`). The "Integrations" view is hidden in this mode.
- **Empty state:** "Build AI agents with WSO2 Agent Builder. Use the welcome page to create a new agent project or explore samples…" and a **Get Started** button (runs `wso2.integrator.openWelcome`).
- Explorer node `modelProviders` has the context action **Add Model Provider** (Agent Builder only).
- The **Traces** panel (`ballerina-traceView`) appears only when tracing is on. The **Evalsets** view appears in the Testing sidebar.

## First-launch sign-in gate ✅
On a fresh profile, a full-window **Get Started** screen opens before the workbench:
- Left side: "Welcome to WSO2 Agent Builder", "Connect AI agents, APIs, data, and events across cloud, on-prem, and hybrid environments. Build any type of integration and AI agent with the 100% open source WSO2 Agent Builder."
- Right side: "Sign in to access AI features and for seamless deployment to WSO2 Cloud", a **Sign in with WSO2 Integration Platform** button (the label still says "Integration Platform"), and **Skip for now**.

## Welcome page (`ViewType.AGENT_BUILDER_WELCOME`) ✅
- Title "WSO2 Agent Builder", tagline "Design, build, and manage AI agents that connect to your APIs, data, and events. Create production-ready agents with the 100% open source WSO2 Agent Builder."
- Card **Start Building your Agent** ("Create a new AI agent project, or open an existing one to continue building."): **Create**, **Open**
- Card **Pre-built Agents and Samples** ("Ready-to-use samples to accelerate your agent development."): **Explore**
- **Recent Projects** list with **See more** ("No recent integrations or projects found in your history." still says "integrations")
- **Sign In** button at top right

### Sign-in gotcha (automation)
The browser login calls back through `wso2-agent-builder://`, which macOS routes to the default-profile instance. A window started with `--user-data-dir=<other>` can never complete sign-in ("Authentication failed. Please try again."), so drive the normal profile (see `launch.sh`).

## Create a Project wizard ✅ (Welcome → **Create**)
- Title "Create a Project", subtitle "A project helps you organize your agentic integrations and libraries."
- Fields:
  - **Project name*** (default "Default")
  - **Location*** with **Browse** (default `~/WSO2AgentBuilder/default`; the location *is* the project folder)
  - Info line: "You are creating a new project".
- **What do you want to build?**
  - **Agentic Integration**: "Build AI agents with tools, memory, and the triggers that invoke them."
  - **Library**: "Build reusable components and utilities that can be shared across agentic integrations."
  - Note: "This is just a starting point. You can add more integrations and libraries to this project later."
- **Agentic integration name*** (default "Untitled")
- **Advanced Configurations**: Ballerina Package → Package Name, Organization Name, Package Version.
- Button: **Create Agentic Integration**.
- Result: `<location>/<integration_name>/` with `Ballerina.toml`, `agents.bal`, `automation.bal`, `config.bal`, `connections.bal`, `data_mappings.bal`, `functions.bal`, `main.bal`, `types.bal`.

## After creation: workbench ✅
- Sidebar title "WSO2 AGENT BUILDER: <PROJECT NAME>". The tree is `<integration>` → **Agents**, **Entry Points**, **Model Providers**, **Connections**, **Types**, **Functions**, **Configurations**. Header icons: + (add), overview, refresh.
- Editor tab "WSO2 Agent Builder", home icon breadcrumb.
- Status bar: "Ballerina 2201.14.1 (Swan Lake Update 14)", "ICP: Stopped".
- Activity bar: Agent Builder (pulse icon), Explorer, Source Control, Run & Debug, Testing (flask).

## Agentic integration overview (empty) ✅
- Title `<integration_name>`, with undo/redo and a **Configure** button at top right.
- Centre: Copilot prompt "WSO2 Agent Builder Copilot — What should your agent do?", a "Describe what you want your agent to do…" box with **Edit** / **Plan** mode and an attach button.
- **Examples:** Customer Support ("Answers questions from your product docs"), Issue Triager ("Triages new GitHub issues by priority"), Helpdesk Responder ("Replies to incoming WhatsApp messages"), Order Tools ("Exposes order lookup and returns as tools").
- "Or start from scratch": **Add Agent**, **Add MCP Server**.

## Agentic integration overview (with content) ✅
- Title `<integration_name>`. Header icons: undo/redo, ⚙ (configure), 🚀 (deploy), ▷ (run), and the panel toggle.
- **Overview** diagram card with **Add Agent** and **Add MCP** buttons, a **Find** (`/`) search, and controls (vertical/horizontal layout ⇅, fit, zoom).
- Nodes: trigger cards (e.g. `/support-agent` *Agent Chat*, `POST /chat`) → agent cards (*AI Agent* `supportAgent`, its tools or "No tools", and a **Model** icon). Each card has a ⋮ menu.

## Project (workspace) overview
- "Agentic Integrations & Libraries". When empty: "Your project is empty" and **Add Agentic Integration or Library**.
- Deploy: **Deploy to WSO2 Cloud**, **Build Docker Image**, **Build Executable**.

## Agentic integration overview (`AgentBuilderOverview`, replaces Integrator's PackageOverview)
- Buttons: **Add Agent**, **Add MCP**, the Tracing toggle ("Tracing is on/off. Click to …"), and **Show/Hide Deploy Panel**.
- Empty state: "What should your agent do?" with Examples (Customer Support, Issue Triager, Helpdesk Responder, Order Tools, Reusable Agent, Shared Tools, Shared Types, Shared Connection), then "Or start from scratch".

## Copilot
- "WSO2 Agent Builder Copilot", tagline "Your AI partner for building agents".
- Agent Builder quick actions: Try it out, Add a tool, Add knowledge, Add evaluations, Add human approval, Add a trigger, Refine the instructions, Explain how it works.
- Hidden in this mode: OpenAPI, Doc and NaturalProgramming commands.

## Agent designer (labels from bundles)
- Agent form: Agent Name, **Create Agent**. Agent node fields: Role, Instructions, Agent Type, Max Iterations, Verbose.
- Other artifact kinds:
  - Agent Definition / Create Agent Definition
  - Chat Agent Service / Create Chat Agent Service
  - Durable Agent, Durable Agentic Workflow
  - MCP Service
- **Add Tool** options: Use Connection, Use Function, Use Agent, **Use Knowledge Base**, Use MCP Server, Create Custom Tool.
- Tool form: Tool Name, Tool Inputs, **Save Tool**.
- **Requires Approval** ("Pause this tool before it runs and wait for human approval."), **Approval Function**, and Approve/Reject in chat.
- MCP: Add MCP Server, Edit MCP Server, Tool Scopes, Pass agent context.
- Memory: Configure Memory, Short Term Memory, In-Memory Short Term Memory Store, Create New Memory Store, Overflow Trim Configuration.
- Model providers: Add/Configure Model Provider, Default WSO2 Model Provider, Anthropic, OpenAI, Azure, Mistral, Deepseek, Ollama.
- Retrieval: Knowledge Base, Create Knowledge Base, WSO2 Cloud Knowledge Base, Chunker / Add Chunker, Vector Store, Embedding Provider.
- Evaluations: Evaluations, New Evaluation, Create Evaluation, Run All, View Evalsets, Evaluation History.
- Tracing: Tracing: On/Off, View Trace, Session Traces, Export as Evalset, Send Traces to Agent Manager, Toggle Trace Logs.
- Chat: Try It, Chat with Agent, Open Chat, Clear Chat. The agent node's own Chat action is **disabled** in Agent Builder mode.

## Open questions (verify in the app)
- Are the Automation, Event Integration and Integration-as-API artifact cards reachable? The code doesn't gate them by mode.

### Responsive header 
At a 1200 px window width, the integration overview header shows labelled buttons: **Configure**, **Tracing: Off**, **Run**, **Deploy**. At full width (1512, sidebar open) the same controls are icon-only (⚙, 🚀, ▷, panel). Name them by their labels in the docs.
