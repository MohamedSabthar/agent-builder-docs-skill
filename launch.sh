#!/bin/zsh
# Start WSO2 Agent Builder with a CDP port so step scripts (lib.mjs) can attach and detach
# without restarting the app. Keep it running in a separate terminal or in the background.
# Usage: ./launch.sh [folder-to-open]   (default: $AB_WORK/sample-project if it exists)
#
# Quit any running Agent Builder first, or the launch is handed to that instance and no
# CDP port opens. Uses the normal profile, because sign-in calls back through
# wso2-agent-builder://, which macOS routes to the default-profile instance.
APP=${AB_APP:-"/Applications/WSO2 Agent Builder.app/Contents/MacOS/WSO2 Agent Builder"}
PORT=${AB_CDP_PORT:-9333}
WORK=${AB_WORK:-$HOME/agent-builder-docs-work}
TARGET=${1:-}
[[ -z $TARGET && -d $WORK/sample-project ]] && TARGET=$WORK/sample-project
exec "$APP" \
  --remote-debugging-port=$PORT \
  --extensions-dir="$HOME/.wso2-agent-builder/extensions" \
  --skip-welcome --skip-release-notes \
  ${TARGET:+"$TARGET"}
