#!/usr/bin/env bash
set -euo pipefail

PORT=3102
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR"

mkdir -p logs

PIDS=$(ss -lntp 2>/dev/null | awk -v p=":$PORT" '$4 ~ p {print $NF}' | sed -n 's/.*pid=\([0-9]\+\).*/\1/p' | sort -u)
if [ -n "$PIDS" ]; then
  kill -TERM $PIDS || true
  for i in $(seq 1 20); do
    sleep 0.5
    if ! ss -lntp 2>/dev/null | awk -v p=":$PORT" '$4 ~ p {exit 0} END {exit 1}'; then
      break
    fi
  done
fi

if [ ! -d node_modules ]; then
  npm ci
fi

if [ ! -d .next ]; then
  npm run build
fi

exec env NODE_ENV=production PORT="$PORT" npm run start -- -p "$PORT"
