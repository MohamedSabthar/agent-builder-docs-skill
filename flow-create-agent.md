# Flow: create an agent ✅

Screenshots: `<AB_WORK>/screenshots/...`. Light Modern theme from 05 onward; retake 01–04 in light before using them.

## Entry points to "Add Agent"
- Agentic integration overview (empty) → "Or start from scratch" → **Add Agent**
- (also expected: sidebar **Agents** node "+", and the sidebar header "+"; verify)

## Add Agent dialog
Intro text: "To add an agent, create a one-off agent for this project, create a reusable agent definition that can be shared across projects, or select one of the pre-built agents below. You will then be guided to provide the required details to complete the agent setup."

- **Create New**
  - **Create Agent**: "Create an agent instance for this integration only."
  - **Create Durable Agent**: "Runs as a workflow. Can wait days for a person or an event and resume after a restart."
  - **Create Agent Definition**: "Create an agent definition that can be shared and used to create agent instances with the same configuration."
- **Pre-built Agents**: tabs **All / Project / Organization**, a "Search pre-built agents..." box. When empty: "No agents found. Type to search for agents from other organizations."

**Not here any more:** "AI Chat Agent" / "Chat Agent Service" as an artifact. Chat and HTTP exposure are now **triggers** on an agent (see below).

## Create Agent form (breadcrumb "Add Agent" > **Create Agent**, subtitle "Initialize an Agent.")
| Field | Help text | Notes |
|---|---|---|
| **Role*** | "Define the agent's primary function." | Prompt/Expression toggle; placeholder "e.g., Customer Support Assistant, Sales Advisor, Data Analyst"; **Open in Prompt Editor** |
| **Instructions*** | "Detailed instructions for the agent." | Prompt/Expression; placeholder "e.g., You are a friendly assistant. Your goal is to..."; **Open in Prompt Editor**. Typing can pop a helper menu: Inputs / Variables / Configurables / Functions |
| **Model*** | "The model used by the agent." | Select/Expression; default **Default WSO2 Model Provider**; link **+ Create New Model Provider** |
| Advanced Configurations | (collapsed, **Expand**) | not yet explored |
| **Agent Name*** | "Name of the agent" | e.g. `supportAgent` |
Button: **Create Agent**.

On create: toast "WSO2 default model provider configuration values were added to the Config.toml file."

## Agent canvas (after create) — breadcrumb `<integration> > <agent>`
- Header: ← back, `<agentName>` **AI Agent**, undo/redo, **Evaluations**, **Tracing: Off**.
- Canvas (left to right):
  - **Add Trigger (+)**, tooltip "Connect this agent to a chat channel or event source that will call it"
  - **AI Agent** node: name, ⋮ menu, **+ Add Memory**, Role (blue) and Instructions preview
  - → model provider node (**Default WSO2 Model P...**)
  - **Add Tool (+)** below the provider, tooltip "Add a tool or MCP server for this agent to call"
- **No** Start/Return nodes and **no** Chat button in the header (unlike Integrator).
- Bottom left: fit / zoom +/−. Bottom right: a floating Copilot button.
- Sidebar: the agent appears under **Agents** with a delete icon.

## Add Trigger dialog ("Connect <agent> to a channel that will call it", "Search channels")
- **Chat Channels**: "Incoming messages are passed to the agent and its reply is sent back." Agent Chat, Google Chat, Telegram, WhatsApp Business.
- **API Endpoints**: "Expose the agent at a URL. A caller sends a request and gets the agent's answer back." HTTP.
- **Event Sources**: "The agent runs when something happens in another system." AWS SQS, Azure Service Bus, CDC for Microsoft SQL Server / MySQL / Oracle DB / PostgreSQL, GitHub (Beta), HubSpot (Beta), Kafka, MQTT, RabbitMQ, Salesforce, SAP ECC (JCo), Shopify (Beta), Solace, Solace (JMS), Twilio.
- **File Sources**: "The agent runs when a file becomes available in a location." Azure Files, FTP / SFTP, Local Files, SMB.

## Agent Chat trigger ✅
- Add Trigger → **Agent Chat** → form "Agent Chat — Configure the trigger that will call <agent>":
  - **Service Path*** ("The HTTP path this chat endpoint is served on."), default `/<agent-name-kebab>`, e.g. `/support-agent`.
  - **Advanced Configurations** → "Configure the HTTP listener for the service": **Shared Listener (Port 9090)** (default) / **Custom Listener**.
  - Button: **Create**.
- Result:
  - On the canvas, a trigger node left of the agent (icon, `/support-agent`, "Agent Chat") with an arrow into the AI Agent node. **Add Trigger** moves below it, so you can add more triggers.
  - In the sidebar, **Entry Points** → "AI Agent Services - /support-agent" → `chat` (a green POST resource).

## Chatting with the agent (Try it) ✅
- The agent canvas has **no** Chat button. Click the **trigger node** (Agent Chat) to open the **Chat Agent Service** resource view:
  - Breadcrumb `<integration> > <agent> > AI Agent Services - /support-agent > [post] chat`
  - Flow: **Start → `agent : run` (stringResult, `supportAgent`, Open Agent ↗) → Return `{message: stringResult}`**
  - Header buttons: **Tracing: Off** and **Chat**
- **Chat**: if the integration isn't running, a toast says: "The "Try It" feature requires a running Ballerina service. Would you like to run '<integration>' now?" with **Run Integration** / **Cancel**.
- Run Integration starts `bal run` in the terminal ("Ballerina Run - <integration> - Task") and opens an **Agent Chat** editor tab to the right:
  - Empty state: "Agent Chat — Use this chat interface to evaluate your AI agent's responses and refine its conversational flow."
  - An info (i) button, **Clear Chat** (appears after the first message), and a message box with a send arrow.

## Agent node and model node panels ✅
- Click the **AI Agent** node to open the **Edit Agent** right-hand drawer ("Represents an agent."): Role*, Instructions* (Prompt/Expression, Open in Prompt Editor), **Advanced Configurations** (Expand), Agent Name* (with a ✎ rename icon), **Save**. The ✕ is at top right; Escape doesn't close it. The model is **not** in this drawer.
- Click the **model provider node** to open the **Configure Model Provider Connection** drawer:
  - **Select Model Provider*** ("Choose an existing Model Provider or create a new one."), a Select/Expression toggle, default **Default WSO2 Model Provider**
  - **+ Create New Model Provider**
  - Hint text: "Configure this model provider using the command palette command: Open the command palette with Cmd+Shift+P, then run: > WSO2 Integrator: Configure default WSO2 model provider". ⚠ This is product text that still says "WSO2 Integrator"; report it to the product team.
  - **Save**
- Reaching the agent canvas from the service flow (**Open Agent**) gives the breadcrumb `<integration> > <agent> > AI Agent Services - /path > [post] chat > ...`. From the overview or sidebar, it's `<integration> > <agent>`.

## Product issues spotted (report to the product team)
1. The Configure Model Provider Connection drawer's hint says "WSO2 Integrator: Configure default WSO2 model provider".
2. The command palette category is "WSO2 Integrator: …".
3. The first-launch sign-in button says "Sign in with WSO2 Integration Platform".
4. Recent Projects says "No recent integrations or projects found in your history."

## Create Agent form: Advanced Configurations ✅
Maximum Iterations (Default: INFER_TOOL_COUNT; "Defaults to max(number of tools, 10)"), Verbose (false), Tool Loading Strategy (NO_FILTER), Execute Tool Calls In Parallel (true), Agent Credential (Record `{id: "", secret: ""}`, "Optional authentication details of the agent."). The Edit Agent drawer has the same advanced fields; unset ones show "No Selection".

## HTTP trigger ✅ (Add Trigger → API Endpoints → HTTP)
- The first time, it shows "Please wait while the http package is being pulled...".
- "Serve the agent from a new service or one that already exists.": **Create a new service** / **Use an existing service**.
- **Endpoint Path*** ("The HTTP path this endpoint is served on.", default `/<agent-kebab>`).
- Advanced: listener (Shared Listener (Port 9090) / Custom Listener), **HTTP Method*** (POST), **Resource Path*** (`.`), Path Param / Query Parameter / Header, **Payload** (`string payload`), Advanced Parameters, **Responses** (201 json, 500 error), **Instructions** ("What the agent should do with each request." Appended to your instructions, followed by `payload: ⟨string value at request time⟩`).
- Generated: `listener http:Listener httpDefaultListener = http:getDefaultListener();` and `service /<path> on httpDefaultListener { resource function post .(@http:Payload string payload) returns json|error { do { json result = check <agent>.run(string \`<instructions>\n\nRequest payload:\n${payload}\`); return result; } on fail error err { return error("unhandled error", err); } } }`
- Canvas trigger label: "HTTP Service · /path", "POST /". Sidebar: "HTTP Service - /path" → `.`.
- ⚠ An Agent Chat trigger and an HTTP trigger on the same agent both default to `/<agent-kebab>` on port 9090. Give them different paths.

## Resource flow (from a trigger) ✅
- Header: **Resource** `POST` `.`, undo/redo, **Configure**, **Try It** (with ▾), Flow / Sequence tabs. Flow: Start → `agent : run` → Return → **Error Handler**.
- Hover a link to reveal a **+** button (data-testid `link-add-button-N`, 0×0 until hovered). Clicking it inserts a "Select node from node panel." placeholder and opens the node panel: Connections (Add Connection), Statement, Control, **AI**, Error Handling, Concurrency, Logging, Show More Functions.
- **AI** section: Direct LLM → **Model Provider**; RAG → **Knowledge Base**, **Data Loader**, **Augment Query**; Agent → **Agent** (tooltip "Represents an AI Agent within a workflow").
- **Agent** opens the **Agents** panel: "Search agents", an **Agent** group with **+** and the existing agents.
- **+** opens **Add Agent** *without* Create Durable Agent (only Create Agent, Create Agent Definition, Pre-built Agents). After **Create Agent**, it returns to the Agents list; pick the new agent there.
- Picking an agent opens the **AI Agent** panel ("Executes the agent for a given user query."):
  - **Query*** ("A query to start a new turn (string/Prompt), or a Resume to continue a paused run.")
  - **Session ID** (Default "sessionId", "The ID associated with the agent memory.")
  - **Context** (Default `new ()`, "The additional context that can be used during agent tool execution.")
  - Advanced: **Type Descriptor** (Default `ai:Trace|anydata`, "Type descriptor specifying the expected return type format.")
  - **Result*** (`stringResult`)
  - **Save**
- Generated: `string stringResult = check requestSummarizer.run(\`...\`);`
- Clicking an existing `agent : run` node reopens this panel. Its ✕ is at window (1485, 93) when full screen.
