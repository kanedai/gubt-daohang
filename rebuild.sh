#!/usr/bin/env bash
set -euo pipefail

PORT=3102
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR"

echo "Stopping process on port $PORT..."
PIDS=$(ss -lntp 2>/dev/null | awk -v p=":$PORT" '$4 ~ p {print $NF}' | sed -n 's/.*pid=\([0-9]\+\).*/\1/p' | sort -u)
if [ -n "$PIDS" ]; then
  kill -TERM $PIDS || true
  for i in $(seq 1 20); do
    sleep 0.5
    if ! ss -lntp 2>/dev/null | awk -v p=":$PORT" '$4 ~ p {exit 0} END {exit 1}'; then
      break
    fi
  done
  echo "Stopped."
else
  echo "No process found on port $PORT."
fi

echo "Building project..."
npm run build

echo "Starting application..."
# Reuse run.sh to start, as it handles logging and env vars
./run.sh
