# Product facts

## Identity
- WSO2 Agent Builder is a VS Code fork derived from WSO2 Integrator. It runs the same `wso2-integrator` and `ballerina` extensions in a product mode.
- **Mode flag:** `product.json` → `runtimeEnv.common.WSO2_PRODUCT_MODE = "agent-builder"` (and `WSO2_PRODUCT_NAME = "WSO2 Agent Builder"`). In the extensions this is the `WI.productMode == 'agent-builder'` context, `ProductMode.AGENT_BUILDER`, and `agentBuilderModeEnabled()`.
- **`product.json`:**
  - `nameShort` and `nameLong` = "WSO2 Agent Builder"
  - `applicationName` = `wso2-integrator` (the CLI is still `bin/code`)
  - `dataFolderName` = `.wso2-agent-builder`
  - bundle ID = `com.wso2.agentbuilder`
  - URL protocol = `wso2-agent-builder`
- **Paths:**
  - App: `/Applications/WSO2 Agent Builder.app`
  - CLI: `/Applications/WSO2 Agent Builder.app/Contents/Resources/app/bin/code`
  - Extensions: `~/.wso2-agent-builder/extensions/`
  - Default projects folder: `~/WSO2AgentBuilder`
- Only `wso2.hurl-client` and `wso2.mcp-server-inspector` are bundled. There are no Micro Integrator or Streaming Integrator extensions.

## Installing an extension drop (the zip of VSIXes)
1. Quit the app.
2. `rm -rf` the bundled `extensions/wso2.ballerina` and `extensions/wso2.wso2-integrator` inside the `.app`, if present.
3. Run `bin/code --install-extension <vsix> --force` for each VSIX.
4. Check the result with `--list-extensions --show-versions`.

Gotcha: `--install-extension` refuses a VSIX whose version is lower than the bundled copy ("…is a built-in extension with version …"), which is why step 2 deletes the bundled extensions. For example, a drop's `wso2-integrator` 1.1.26081017 is lower than the 1.1.26101805 bundled with 1.0.0-alpha2. If you can't modify the `.app` (on a managed Mac, a modified copy of the app got SIGKILLed and removed), raise the version in the VSIX's `extension/package.json` and `extension.vsixmanifest`, re-zip it, and install that into a separate `--extensions-dir`: VS Code prefers a user extension with a higher version over the built-in.

Gotcha: if the `.app` was just dragged from the DMG, Finder may still be copying it (xattr `com.apple.metadata:kMDItemResumableCopy`, missing `bin/code`). The CLI then gets SIGKILLed (exit 137). Open the app once, or wait for the copy to finish.

## Terminology (use these in docs)
| Old (WSO2 Integrator docs) | Agent Builder |
|---|---|
| WSO2 Integrator | WSO2 Agent Builder |
| integration (a Ballerina package) | **agentic integration** |
| workspace / project | **project** ("A project helps you organize your agentic integrations and libraries") |
| WSO2 Integrator Copilot | **WSO2 Agent Builder Copilot** ("Agent Builder Copilot" in short form) |
| Integrations view | **Agents** view, in the "WSO2 Agent Builder" activity-bar container |
| Add Integration or Library | Add Agentic Integration or Library |
| Devant / WSO2 Integration Platform | (check per feature; e.g. "WSO2 Cloud Knowledge Base") |

The Copilot system prompt says: "In WSO2 Agent Builder, a Ballerina workspace is called a project and a Ballerina package is called an agentic integration."

## Still showing Integrator branding (don't document these as product names)
The extension `displayName` is "WSO2 Integrator", and command categories and the settings section are still titled "WSO2 Integrator".
