#!/bin/bash

# Configuration Variables
# You can override these by setting them before running the script or editing them here
export PORT=${PORT:-3001}
# Set the URL where system status should be reported
# export REPORT_URL="http://your-monitoring-service.com/api/status"
export REPORT_URL=${REPORT_URL:-"http://localhost:3000/api/email/inbound "}
export MS=${MS:-"30000"}

export TO=${TO:-"1577753893@qq.com"}
export API_TOKEN=${API_TOKEN:-"123456"}
echo "Starting server with configuration:"
echo "PORT: $PORT"
if [ -z "$REPORT_URL" ]; then
    echo "REPORT_URL: (Not set - System reporting disabled)"
else
    echo "REPORT_URL: $REPORT_URL"
fi

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    bun install
fi

# Run the application
bun run start
