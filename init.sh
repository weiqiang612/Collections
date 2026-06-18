#!/bin/bash
# =============================================================================
# init.sh — AI Agent environment bootstrap (UNIX / macOS)
# Run at the start of every Agent session: bash init.sh
# =============================================================================
# ⚙️  CONFIGURATION — review before first run
APP_PORT=5173
HEALTH_CHECK_URL="http://localhost:5173/"
STARTUP_COMMAND="pnpm dev"
ROOT_DIR=$(pwd)
LOG_FILE="$ROOT_DIR/logs/dev_server.log"
HEALTH_TIMEOUT=60
# =============================================================================

set -euo pipefail
echo "[init] Bootstrapping Collection..."

# 1. Verify required tools
MISSING=()
command -v node &>/dev/null || MISSING+=("node")
command -v npm  &>/dev/null || MISSING+=("npm")
command -v pnpm &>/dev/null || MISSING+=("pnpm")

if [ ${#MISSING[@]} -gt 0 ]; then
  echo "[ERROR] Missing tools: ${MISSING[*]}. Install them and re-run."
  exit 1
fi
echo "[init] ✓ Tools OK"

# 2. Clear port if occupied
PORT_PID=$(lsof -t -i:"$APP_PORT" 2>/dev/null || true)
if [ -n "$PORT_PID" ]; then
  echo "[init] Releasing port $APP_PORT (PID $PORT_PID)..."
  kill -9 "$PORT_PID" 2>/dev/null || true
  sleep 1
fi

# 3. Start dev server in background
mkdir -p "$ROOT_DIR/logs"
nohup sh -c "$STARTUP_COMMAND" > "$LOG_FILE" 2>&1 &
echo "[init] Server starting (PID $!, logs → $LOG_FILE)"

# 4. Health check loop
echo "[init] Waiting for server (timeout: ${HEALTH_TIMEOUT}s)..."
COUNT=0
until [ $COUNT -ge $HEALTH_TIMEOUT ]; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_CHECK_URL" 2>/dev/null || echo "000")
  [ "$STATUS" != "000" ] && { echo "[init] ✓ Server ready (HTTP status: $STATUS) at $HEALTH_CHECK_URL"; break; }
  sleep 1; COUNT=$((COUNT+1))
  [ $((COUNT % 10)) -eq 0 ] && echo "[init]   Waiting... ${COUNT}s"
done
if [ $COUNT -ge $HEALTH_TIMEOUT ]; then
  echo "[ERROR] Server not healthy after ${HEALTH_TIMEOUT}s — check $LOG_FILE"
  exit 1
fi

# 5. Git context (Robust multi-repo detection)
echo ""
GIT_REPO_PATH=$(find . -maxdepth 3 -name ".git" -type d | head -n 1)
if [ -n "$GIT_REPO_PATH" ]; then
  GIT_REPO_DIR=$(dirname "$GIT_REPO_PATH")
  echo "[init] ── Git status ($(basename "$GIT_REPO_DIR")) ───────────────────"
  cd "$GIT_REPO_DIR"
  git status -s
  echo ""
  echo "[init] ── Recent commits ($(basename "$GIT_REPO_DIR")) ──────────────"
  git log -n 3 --oneline
  cd "$ROOT_DIR"
else
  echo "[init] ── Git status ─────────────────────────────────"
  git status -s
  echo ""
  echo "[init] ── Recent commits ────────────────────────────"
  git log -n 3 --oneline
fi
echo ""
echo "[init] ✓ Environment ready."
