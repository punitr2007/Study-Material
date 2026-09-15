#!/usr/bin/env bash
# ==============================================================================
# NSUT Study Material — Mi A2 Background Automation Worker
# ==============================================================================
# Device: Xiaomi Mi A2 (SD660 / 4GB RAM / Rooted Android 10)
# Role: Dedicated Background Compute & Synchronization Worker (Cron Worker)
#
# Features:
# 1. Zero Inbound Exposure: Safe background orchestration, no exposed ports.
# 2. Automated Repo Synchronization: Syncs latest papers & updates static catalogs.
# 3. Deterministic Incremental Runs: Analyzes weightages & preserves SHA-256 solution caches.
# 4. Git Push Trigger: Pushes updates to origin/main triggering instant Vercel redeploy.
# ==============================================================================

set -e

WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$WORKSPACE_DIR"

LOG_FILE="$WORKSPACE_DIR/.automation_worker.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "========================================================"
log "Starting Mi A2 Background Automation Worker Run..."
log "Working Directory: $WORKSPACE_DIR"

# 1. Pull latest git changes to stay in sync
log "Step 1: Pulling latest changes from GitHub..."
git pull --rebase origin main || {
  log "Warning: Git pull failed or offline. Proceeding with local files."
}

# 2. Check for newly downloaded Drive PYQs and classify them
if [ -f "sync_drive_pyqs.py" ]; then
  log "Step 2: Scanning & synchronizing Drive PYQ downloads..."
  python3 sync_drive_pyqs.py || log "Drive sync script finished with notice."
fi

# 3. Generate updated academic catalog manifest
log "Step 3: Compiling catalog.json..."
python3 generate_catalog.py

# 4. Compile 5-year syllabus coverage & exam weightage analytics
log "Step 4: Compiling analytics.json..."
python3 analyze_syllabus_weightage.py

# 5. Compile textbook-grounded solutions (cached via SHA-256 hashes)
log "Step 5: Updating solutions.json..."
python3 generate_solutions.py

# 6. Check for git modifications and auto-commit + push
if [[ -n $(git status --porcelain) ]]; then
  log "Step 6: Detected new documents or analytics updates. Committing & pushing..."
  git add .
  git commit -m "AutoSync: Update academic catalog, syllabus analytics, and solutions [$(date '+%Y-%m-%d %H:%M')]"
  git push origin main
  log "✓ Successfully pushed updates to GitHub! Vercel redeployment triggered."
else
  log "Step 6: Everything is up to date. No changes to commit."
fi

log "Mi A2 Automation Worker Run Finished Successfully."
log "========================================================"
