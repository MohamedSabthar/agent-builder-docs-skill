# Where UI labels live

```sh
EXT=~/.wso2-agent-builder/extensions
BAL=$EXT/wso2.ballerina-6.2.0-SNAPSHOT        # designer webviews (Visualizer.js + numbered chunks), TraceVisualizer.js
WI=$EXT/wso2.wso2-integrator-1.1.26081017     # sidebar, welcome page (resources/jslibs/main.js), package.json
```

- **Find which bundle has a label:** `grep -rlF "Use Knowledge Base" $BAL/resources/jslibs`
- **Context around a label in minified JS:** `grep -oE '.{0,200}Requires Approval.{0,200}' $BAL/resources/jslibs/*.js | head`
- **Agent Builder–specific branches:** grep for `AGENT_BUILDER`, `agentBuilderModeEnabled`, `useProductMode`, `isAgentBuilder`.
- **Contributed views, commands and when-clauses:** `$WI/package.json`, `$BAL/package.json`. Filter with `WI.productMode`.
- **Copilot system prompt and terms:** `$BAL/dist/extension.js` (grep "agentic integration").
- **Product terms:** `productTerms.ts` content is in `$BAL/resources/jslibs/Visualizer.js` (grep "Agentic Integration").

Bundle strings show what *can* appear, not what a user actually sees. Always confirm in the running app.
