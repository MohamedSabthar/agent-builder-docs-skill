# Command IDs

Run these from the command palette by title, or from Playwright (see the harness (`lib.mjs`, `launch.sh`)).

| Purpose | Command ID |
|---|---|
| Open the welcome page | `wso2.integrator.openWelcome` |
| Set up Ballerina | `wso2.integrator.setupBallerinaVisually` |
| Create a new project | `BI.project.createBIProjectPure` ("Create New Project") |
| Add an artifact | `BI.project-explorer.add` |
| Open the overview | `BI.project-explorer.overview` |
| Add an agent | `BI.project-explorer.add-agent` |
| Add an agent definition | `BI.project-explorer.add-agent-definition` |
| Add a model provider | `BI.project-explorer.add-model-provider` |
| Add a connection | `BI.project-explorer.add-connection` |
| Add a workflow | `BI.project-explorer.add-workflow` |
| Open the visualizer | `ballerina.showVisualizer` |
| Try It | `ballerina.tryIt` |
| Run / debug | `BI.project.run`, `BI.project.debug` |
| Open the Copilot panel | `ballerina.open.ai.panel` |
| Add an AI evaluation | `BI.test.add.ai.evaluation` |
| Create a new evalset | `ballerina.createNewEvalset` |
| Tracing | `ballerina.enableTracing`, `ballerina.disableTracing`, `ballerina.showTraceWindow`, `ballerina.toggleAgentFilter`, `BI.toggle.trace.logs` |

## Palette titles seen in the app ✅
- **WSO2 Integrator: Configure default WSO2 model provider**: the category prefix still says "WSO2 Integrator". In docs, name only "Configure default WSO2 model provider".
- **Ballerina: Enable Tracing** / **Ballerina: Disable Tracing**
- **Ballerina: Open Try It**
- Layout: **View: Hide Panel**, **View: Close Primary Side Bar**, **View: Toggle Primary Side Bar Visibility**, **View: Toggle Secondary Side Bar Visibility** ("Close Secondary Side Bar" doesn't exist), **Notifications: Clear All Notifications**

## Sidebar tree actions (hover icons) ✅
- Header: **Add Integration or Library** (+), **Open Overview**, **Refresh**
- Integration row: **Force Update Artifacts**, **Show Visualizer**
- **Agents**: **Add Agent**. Each agent: **Delete**
- **Model Providers**: **Add Model Provider**. **Connections**: **Add Connection**. **Types**: **Add Type**, **View Type Diagram**. **Functions**: **Add Function**. **Configurations**: **Add Configuration**, **View Configuration**
- **Entry Points** has no add action; entry points come from an agent's **Add Trigger**.
- There's no generic "+ Add Artifact" (the Integrator's Artifacts page is gone in this mode).
