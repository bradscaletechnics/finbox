#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# FinBox Launcher
# Ensures all dependencies are running:
#   - Docker Desktop
#   - Ollama with llama3.1:8b model
#   - AnythingLLM container
#   - FinBox dev server
# Then opens FinBox in the default browser.
# ─────────────────────────────────────────────────────────────────────────────

FINBOX_DIR="/Users/bradpalmer/Projects/finbox"
ANYTHINGLLM_URL="http://localhost:3001"
FINBOX_DEV_URL="http://localhost:8080"
FINBOX_PORT=8080

# ── Colors ────────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
RESET='\033[0m'

log()  { echo -e "${BLUE}[FinBox]${RESET} $1"; }
ok()   { echo -e "${GREEN}[FinBox]${RESET} $1"; }
warn() { echo -e "${YELLOW}[FinBox]${RESET} $1"; }
err()  { echo -e "${RED}[FinBox]${RESET} $1"; }

# ── Resolve PATH: use local node installation ───────────────────────────────
NODE_DIR="$HOME/.local/node"
export PATH="$NODE_DIR/bin:$PATH"

# Try nvm as fallback
if ! command -v node &>/dev/null; then
  export NVM_DIR="$HOME/.nvm"
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    source "$NVM_DIR/nvm.sh"
  fi
fi

# Additional fallback paths
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

# Verify node/npm are found
if ! command -v node &>/dev/null; then
  err "node not found. Node.js installation missing."
  exit 1
fi

if ! command -v npm &>/dev/null; then
  # Use npm-cli.js directly if npm symlink is broken
  NPM_BIN="$NODE_DIR/bin/node $NODE_DIR/lib/node_modules/npm/bin/npm-cli.js"
else
  NPM_BIN="$(command -v npm)"
fi

NODE_VERSION=$(node --version 2>/dev/null || echo "unknown")
log "Using Node.js at: $(command -v node) ($NODE_VERSION)"

# ── Helper: check if a TCP port is open ───────────────────────────────────────
port_open() {
  nc -z 127.0.0.1 "$1" &>/dev/null
}

# ── Step 1: Ensure Docker Desktop is running ──────────────────────────────────
log "Checking Docker Desktop..."
if ! docker info &>/dev/null; then
  warn "Docker Desktop is not running. Launching it now..."
  open -a "Docker Desktop" 2>/dev/null || open -a "Docker" 2>/dev/null || {
    err "Could not find Docker Desktop. Please launch it manually and re-run."
    exit 1
  }
  WAIT=0
  until docker info &>/dev/null; do
    sleep 2; WAIT=$((WAIT + 2))
    if [ $WAIT -ge 90 ]; then
      err "Docker Desktop did not start within 90 seconds. Please check Docker."
      exit 1
    fi
    log "Waiting for Docker Desktop... (${WAIT}s)"
  done
  ok "Docker Desktop is ready."
else
  ok "Docker Desktop is already running."
fi

# ── Step 2: Ensure Ollama is running with llama3.1:8b ────────────────────────
log "Checking Ollama..."
if ! command -v ollama &>/dev/null; then
  warn "Ollama not found in PATH. Please install Ollama from https://ollama.ai"
else
  if ! pgrep -x "ollama" >/dev/null; then
    log "Starting Ollama service..."
    ollama serve >/dev/null 2>&1 &
    sleep 2
  fi
  ok "Ollama service is running."

  # Check if llama3.1:8b model is available
  log "Checking llama3.1:8b model..."
  if ! ollama list | grep -q "llama3.1:8b"; then
    warn "llama3.1:8b model not found. Pulling it now (this may take a while)..."
    ollama pull llama3.1:8b
  fi
  ok "llama3.1:8b model is ready."
fi

# ── Step 3: Start AnythingLLM container ──────────────────────────────────────
log "Checking AnythingLLM (localhost:3001)..."
if port_open 3001; then
  ok "AnythingLLM is already running on port 3001."
else
  log "Starting AnythingLLM..."
  COMPOSE_FILE="$FINBOX_DIR/docker-compose.yml"

  if [ -f "$COMPOSE_FILE" ]; then
    docker compose -f "$COMPOSE_FILE" up -d 2>&1 || true
  fi

  # Fallback: try starting by container name
  docker start anythingllm 2>/dev/null || true

  log "Waiting for AnythingLLM to be ready..."
  WAIT=0
  until port_open 3001; do
    sleep 3; WAIT=$((WAIT + 3))
    if [ $WAIT -ge 60 ]; then
      err "AnythingLLM did not become ready in 60s. Check: docker logs anythingllm"
      exit 1
    fi
    log "  ...still starting (${WAIT}s)"
  done
  ok "AnythingLLM is ready."
fi

# ── Step 4: Start FinBox dev server ──────────────────────────────────────────
log "Checking FinBox app..."
if port_open $FINBOX_PORT; then
  ok "FinBox dev server already running on port $FINBOX_PORT."
else
  log "Starting FinBox dev server..."
  LOG_FILE="/tmp/finbox-dev.log"

  # Kill any process already holding the port (stale run, wrong port check, etc.)
  STALE_PID=$(lsof -ti tcp:$FINBOX_PORT 2>/dev/null) || true
  if [ -n "$STALE_PID" ]; then
    kill "$STALE_PID" 2>/dev/null || true
    sleep 1
  fi
  rm -f /tmp/finbox-dev.pid

  # Start Vite in background using node directly
  cd "$FINBOX_DIR"
  if [ -x "$NODE_DIR/bin/node" ] && [ -f "$FINBOX_DIR/node_modules/.bin/vite" ]; then
    # Use node + vite directly (more reliable)
    nohup "$NODE_DIR/bin/node" "$FINBOX_DIR/node_modules/.bin/vite" > "$LOG_FILE" 2>&1 &
  else
    # Fallback to npm run dev
    nohup $NPM_BIN run dev > "$LOG_FILE" 2>&1 &
  fi
  DEV_PID=$!
  echo $DEV_PID > /tmp/finbox-dev.pid

  # Wait for port to open (up to 60s)
  WAIT=0
  until port_open $FINBOX_PORT; do
    sleep 1; WAIT=$((WAIT + 1))
    if [ $WAIT -ge 60 ]; then
      err "FinBox dev server did not start in 60s."
      err "Check log: $LOG_FILE"
      # Still try to open the browser in case it started but check failed
      break
    fi
    if [ $((WAIT % 5)) -eq 0 ]; then
      log "  ...waiting for Vite (${WAIT}s)"
    fi
  done

  if port_open $FINBOX_PORT; then
    ok "FinBox dev server started (PID $DEV_PID)."
  else
    warn "Could not confirm Vite is running. Opening browser anyway..."
  fi
fi

# ── Step 5: Open FinBox in the browser ────────────────────────────────────────
sleep 1
ok "Opening FinBox at $FINBOX_DEV_URL ..."
open "$FINBOX_DEV_URL"

echo ""
ok "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ok "  FinBox → $FINBOX_DEV_URL"
ok "  AnythingLLM → $ANYTHINGLLM_URL"
ok "  Ollama → llama3.1:8b model loaded"
ok "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
