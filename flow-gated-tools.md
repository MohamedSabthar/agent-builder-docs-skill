# Flow: gated tools ✅

- **Requires Approval** is a checkbox on every tool form ("Pause this tool before it runs and wait for human approval.").
- When ticked, **Approval Function** appears: "Optional. Decides per call whether approval is needed. Pick a compatible approval function, or type a name to create one."
  - The picker lists only *compatible* functions (same parameters as the tool, returns boolean). It was empty when none matched.
  - Typing a new name generates `isolated function <name>(<tool params>) returns boolean { // TODO: inspect the proposed arguments and return true to require approval\n return true; }` and annotates the tool with `@ai:AgentTool { requiresApproval: <name> }`.
- The generated function appears in the side bar under **Functions**. Clicking it opens the "Function" flow (Start → Return `true`, with a Note badge). Click **Return** → panel "Value of 'true'", **Expression** → edit → **Save**.
- **Canvas badge:** a small yellow person badge at the bottom right of the tool's circle. The hover tooltip is "Requires Approval".
- **Agent Chat at run time:**
  - The agent's reply becomes an "Approval required · N pending" card: "1/1 <toolName>", the tool description, **Show arguments** (key/value list), **Approve** / **Reject**.
  - **The chat service must have a `decision` resource** to send the decision back to the agent. The Agent Chat trigger generates only `post chat`. Add it in the UI: select the service under **Entry Points** ("AI Agent Services - /path") to open the **AI Agent Service** view ("Resources — The agent's fixed chat and human-approval resources"), then select **+ Decision** (the button disappears once added). This is intended, not a bug . Generated code:
    ```ballerina
    resource function post decision(@http:Payload ai:DecisionMessage request)
            returns ai:ChatRespMessage|error {
        ai:Resume resume = {decisions: request.decisions};
        string stringResult = check <agent>.run(resume, request.sessionId);
        return {message: stringResult};
    }
    ```
    (Writing `run({decisions: ...})` inline gives `ambiguous type '(anydata|ai:Prompt|ai:Resume)'`, so declare `ai:Resume` first.)
  - Without it, Approve shows "no 'post decision' resource found in the attached chat service".
  - Restarting the integration with the default in-memory memory loses pending approvals: "No pending approval found for session '<id>'". The chat history (keyed by service path) keeps the dead card, and **Clear Chat** doesn't remove it while it's pending.
- **Toasts:** with Do Not Disturb on (crossed-out bell in the status bar), the "Run Integration" prompt from **Chat** is hidden. Use the palette command **WSO2 Integrator: Run Integration**, or turn DND off.
- ⚠ Product quirk: after **+ Decision**, the agent canvas draws the chat service twice (two "/path Agent Chat" trigger nodes, one per resource). Avoid that agent's canvas in unrelated screenshots.
