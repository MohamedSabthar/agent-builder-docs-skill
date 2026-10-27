# Flow: create an evaluation from a template ✅

## Entry points
- **Testing** view (beaker) → TEST EXPLORER. With no tests: **Add Unit Test**, **Add AI Evaluation**, **Install Additional Test Extensions...**. The **EVALSETS** section lists evalsets ("<evalset> 5 threads"). Once tests exist, use **+** (Add Test) → **Add AI Evaluation**.
  - Automation: clicking **+** didn't open its menu. Use the palette **Add AI Evaluation** (`BI.test.add.ai.evaluation`).
- Agent view: **Evaluations** (tooltip "View and run the evaluations of this agent") opens a popup. With none: "No evaluations for <agent> yet", "Run your agent against test inputs and check its responses.", **Create Evaluation**. With some: the list and **New Evaluation**.
  - This path opens the template browser straight away with the agent chosen. The form then has no build-type cards, no card header (no **Change Template**), and no **Target Agent**; the back arrow returns to the templates.

## Form
- Title "AI Evaluation" with "Create a new AI evaluation for your integration" (the UI still says integration). **Create New AI Evaluation**, "How would you like to build this evaluation?": **From Template** (default) / **Custom**.
- "Choose an evaluation template": "Choose a template to continue", "Start with one of 23 rule-based and LLM-as-judge checks", **Choose Template**.
- **Browse Evaluation Templates** ("23 of 23 templates"): search "Search by name, type, or behavior", filters **All** / **Rule-based** / **LLM-as-Judge** / **Evalset required** / **Evalset or queries**, cards with kind and input badges. The search box is a `vscode-text-field`, so the placeholder matches twice: use the last (inner `input`).
- Tool Trajectory card: "Tool Trajectory" [Rule-based], "Checks the agent's tool calls against the eval set trajectory using a configurable matching mode", **Change Template**.
  - **Target Agent*** (Select / Expression), preselected when the project has one agent.
  - Test input: "This template evaluates against an evalset." With none: "No evalset files found", "Export traces from a conversation with an agent to create an evalset. You can also create an empty evalset below.", **Create Empty Evalset**, **Generate with Copilot**. With one: **Evalset File** dropdown and **Create Empty Evalset** / **Generate with Copilot** / **Open Evalset**.
  - **Optional settings** (**Expand** → Match Mode, default `STRICT`).
  - **Minimum Pass Rate (%)** slider, default 90. **Runs** (default 1, "Number of times to execute this evaluation"). **AI Evaluation Name** (suggested `evaluate<Agent><Template>`, for example `evaluateSupportAgentToolTrajectory`). **Save** (scroll down).
- **Save** opens the evaluation in the visual designer: "AI Evaluation <name>", **Configure**, an **AI evaluation** node with the template and "Target agent". The Test Explorer then shows `evaluations`.

## Copilot helpers
- **Generate with Copilot** shows only once a Target Agent is chosen. It opens a new Copilot chat ("Create an evalset for <agent>"); Copilot writes `tests/resources/evalsets/<agent>-<template>.evalset.json` and the form selects it once the list refreshes. It took a few minutes and doesn't run the agent. A good docs shot: the form beside that chat, with the link highlighted.
- **Generate Queries**: for templates that take queries instead of an evalset (needs Copilot sign-in).
- **Fix with Copilot** (tooltip "Ask Copilot why this evaluation fails and fix it"): only on failed evaluations, in **Evaluation Report** and **Evaluation History**. Copilot replays the failing turns with the agent (the agent-evals skill), so it needs a runnable agent and its model provider.
- Running an evaluation runs the agent, so the Default WSO2 Model Provider needs sign-in.
