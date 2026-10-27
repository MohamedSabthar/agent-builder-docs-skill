# Flow: give tools to an agent ✅

Screenshots: `<AB_WORK>/screenshots/...`.

- Entry: on the agent canvas, **Add Tool (+)** below the model provider (tooltip "Add a tool or MCP server for this agent to call"). The AI Agent node has no **+**.
- **Add Tool** drawer: "Create and add tools to extend your agent's capabilities. Choose the method you'd like to use:"
  - **Use Connection**: "Call an action on an HTTP client, database, or message broker. Pick a connector, choose the action you want, then point it at a connection."
  - **Use Function**: "Turn a function from your integration, or one from a library, into a tool the agent can call for specific business logic."
  - **Use Agent**: "Delegate to another agent in your integration. It is wrapped as a tool, so this agent can hand off requests and use the response."
  - **Use MCP Server**: "Connect to a Model Context Protocol (MCP) server for pre-built tools and standardized access to external systems."
  - **Use Knowledge Base** (NEW vs Integrator): "Search or add documents to a knowledge base in your integration, wrapped as a retrieve or ingest tool."
  - **Create Custom Tool**: "Build a tool from scratch in the visual flow editor, defining its logic, inputs, and outputs to match your exact needs."
- **Use Connection:** "Pick an existing connection or a connector to browse its actions."
  - Search, an **All Categories** select (23 categories: Network (9), Database (18), Messaging (18), AI & Machine Learning (23), CRM & Sales (68), …), and **Popular (12)**.
  - Connector → actions list (HTTP: Delete, Execute, Forward, Get, …) → form "HTTP -> get": **Tool Name***, **Description**, **Connection*** ("No HTTP connection in this project", **+ Create HTTP Connection**), **Requires Approval**, Inputs and Mapping, OAuth Client Configuration, Result Type, **Save Tool**.
  - The form takes a few seconds to load (spinner).
- **Use Function:** "Pick a function from your integration or from a library. The function you choose becomes the tool."
  - Search functions; **Within Project** ("<integration> (Current Integration)", **+ Create Function**), **Standard Library**, **Extended Library**.
  - Form: chip with the function name, Tool Name (`<fn>Tool`), Description (from the doc comment), Requires Approval, Inputs and Mapping, OAuth Client Configuration, Result Type, **Save Tool**.
  - Generated: an `@ai:AgentTool` wrapper function, appended to `tools = [...]`.
- **Use MCP Server:** first a choice:
  - **WSO2 Agent Manager**: "MCP servers your organization added to Agent Manager, served through its AI Gateway." Shows "Not signed in" unless you're signed in to Agent Manager.
  - **Connect Manually**: "Enter the server URL and authentication for any MCP server." Fields: Server Url*, Requires Authentication, Tools to Include (All), Advanced Configurations, Result* (`aiMcpbasetoolkit`), Save.
- **Use Knowledge Base:** "Pick an existing knowledge base or a knowledge base type to browse its actions." Types: Vector Knowledge Base, Azure AI Search Knowledge Base, WSO2 Cloud Knowledge Base. Type → **New Knowledge Base** plus actions (WSO2 Cloud KB: **Retrieve**, "Retrieves relevant chunks for the given query.").
- **Create Custom Tool:**
  - Fields: Name* ("Name of the agent tool."), Description, Parameters (**+ Add Parameter** opens an inline Type*/Name*/Description card with Cancel/Add), Return Type (type field with suggestions), return Description, Requires Approval, Advanced Configurations (Authorization Server Base URL, Client ID, Client Secret, Redirect URI, Required Scopes, Enable PKCE, SecureSocket), Cancel / **Create Tool**.
  - Generated: a doc-commented `@ai:AgentTool isolated function name(params) returns T { panic error("not implemented"); }` in `agents.bal`.
  - Gotcha (automation): the Type field opens a suggestion list. Click the suggestion; Enter from `page.keyboard` doesn't reach the webview.
- **On the canvas:** tools hang off the AI Agent node on dashed lines, below the model provider; the Add Tool button moves down. Icons: library or connector logo, `ƒ` for custom and toolkit.
- **Click a tool node** (its circle) to open the tool view directly (Configure at the top). **Right-click** gives Edit / View / Delete; it is only needed for Delete.
  - **View** opens the tool flow ("Agent Tool", Configure, Flow/Sequence, e.g. Start → Panic).
  - **Configure** opens the full-page **Agent Tool** "Build a tool that can be used by AI agents" form, with the same fields as Create Custom Tool.
- **Toolkits:** still source-only. A `*ai:BaseToolKit` class instance in `tools = [...]` shows as a `ƒ taskManager` node.
