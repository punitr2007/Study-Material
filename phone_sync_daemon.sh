#!/data/data/com.termux/files/usr/bin/env bash
# ==============================================================================
# NSUT Study Material — Dedicated Background Synchronization Worker
# ==============================================================================
# Target: Background Worker (Mi A2 / Termux / reTerminal / Cron)
# Security: Unprivileged execution (No root/su required)
# Authentication: Scoped Fine-Grained GitHub Personal Access Token (PAT)
# Concurrency: Protected with flock file locking
# ==============================================================================

set -eo pipefail

WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$WORKSPACE_DIR"

LOG_FILE="$WORKSPACE_DIR/.automation_worker.log"
if [ -n "$PREFIX" ] && [ -d "$PREFIX/tmp" ]; then
  TMP_DIR="$PREFIX/tmp"
elif [ -n "$TMPDIR" ] && [ -w "$TMPDIR" ]; then
  TMP_DIR="$TMPDIR"
elif [ -d "/tmp" ] && [ -w "/tmp" ]; then
  TMP_DIR="/tmp"
else
  TMP_DIR="$WORKSPACE_DIR/.tmp"
fi
mkdir -p "$TMP_DIR"
LOCK_FILE="$TMP_DIR/study_material_sync.lock"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# ------------------------------------------------------------------------------
# 0. Concurrency Protection (Prevent overlapping cron & manual runs)
# ------------------------------------------------------------------------------
exec 200>"$LOCK_FILE"
if ! flock -n 200; then
  log "Notice: Another sync job is currently running. Exiting cleanly to prevent race conditions."
  exit 0
fi

log "========================================================"
log "Starting Study Material Background Worker Run..."
log "Working Directory: $WORKSPACE_DIR"

# ------------------------------------------------------------------------------
# 1. Pull latest git changes to stay synchronized with host workstation
# ------------------------------------------------------------------------------
log "Step 1: Pulling latest changes from GitHub..."
git pull --rebase origin main || {
  log "Warning: Git pull encountered an issue or device is offline. Continuing with local files."
}

# ------------------------------------------------------------------------------
# 2. Check for newly downloaded Drive PYQs and classify them
# ------------------------------------------------------------------------------
if [ -f "sync_drive_pyqs.py" ]; then
  log "Step 2: Scanning & organizing newly downloaded question papers..."
  python3 sync_drive_pyqs.py || log "Drive sync script finished with notice."
fi

# ------------------------------------------------------------------------------
# 3. Compile updated academic catalog manifest (Zero-LLM, static metadata)
# ------------------------------------------------------------------------------
log "Step 3: Compiling catalog.json..."
python3 generate_catalog.py

# ------------------------------------------------------------------------------
# 4. Compile 5-year syllabus coverage & exam weightage analytics (Static rules)
# ------------------------------------------------------------------------------
log "Step 4: Compiling analytics.json..."
python3 analyze_syllabus_weightage.py

# NOTE: LLM-based solution generation (generate_solutions.py) is intentionally
# EXCLUDED from the phone worker. Solution generation runs on the host RTX 3050
# workstation with Qwen LLM, and solutions.json is pulled via Git.

# ------------------------------------------------------------------------------
# 5. Check for git modifications and auto-commit + push via Fine-Grained PAT
# ------------------------------------------------------------------------------
if [[ -n $(git status --porcelain) ]]; then
  log "Step 5: Detected catalog/analytics updates. Committing & pushing to GitHub..."
  git add .
  git commit -m "AutoSync: Update academic catalog and syllabus analytics [$(date '+%Y-%m-%d %H:%M')]"
  git push origin main
  log "✓ Successfully pushed updates to GitHub! Vercel redeployment triggered."
else
  log "Step 5: Everything is up to date. No changes to commit."
fi

log "Background Worker Run Finished Successfully."
log "========================================================"
