#!/usr/bin/env bash
# ==============================================================================
# 🚀 NSUT Study-Material AutoSync Daemon & Tool
# Automated Incremental Google Drive Sync & OCR Bundle Slicer
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Color Codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Determine Python Interpreter
if [ -f "$SCRIPT_DIR/.venv/bin/python3" ]; then
    PYTHON_EXEC="$SCRIPT_DIR/.venv/bin/python3"
elif [ -f "$SCRIPT_DIR/.myenv/bin/python3" ]; then
    PYTHON_EXEC="$SCRIPT_DIR/.myenv/bin/python3"
else
    PYTHON_EXEC="python3"
fi

show_banner() {
    echo -e "${BLUE}"
    echo "======================================================================"
    echo "      📚 NSUT Study-Material Intelligent AutoSync & OCR Pipeline       "
    echo "======================================================================"
    echo -e "${NC}"
}

check_dependencies() {
    local missing=()
    command -v tesseract >/dev/null 2>&1 || missing+=("tesseract")
    command -v pdftotext >/dev/null 2>&1 || missing+=("poppler-utils (pdftotext)")
    command -v pdftoppm >/dev/null 2>&1 || missing+=("poppler-utils (pdftoppm)")
    command -v qpdf >/dev/null 2>&1 || missing+=("qpdf")

    if [ ${#missing[@]} -ne 0 ]; then
        echo -e "${YELLOW}[!] Notice: Missing optional system tools: ${missing[*]}${NC}"
        echo -e "    Some PDF extraction fallbacks might be reduced. Install via: sudo pacman -S tesseract poppler qpdf (or sudo apt install tesseract-ocr poppler-utils qpdf)"
    fi
}

run_sync() {
    local args=("$@")
    echo -e "${GREEN}[*] Executing sync with Python: ${PYTHON_EXEC}${NC}"
    "$PYTHON_EXEC" "$SCRIPT_DIR/sync_drive_pyqs.py" "${args[@]}"
}

watch_mode() {
    local interval="${1:-3600}"
    echo -e "${BLUE}[*] Starting Watch Mode (Polling every ${interval}s)... Press Ctrl+C to stop.${NC}"
    while true; do
        echo -e "\n${YELLOW}[*] [$(date '+%Y-%m-%d %H:%M:%S')] Running scheduled autosync...${NC}"
        run_sync
        echo -e "${GREEN}[✓] Sync round completed. Sleeping for ${interval}s...${NC}"
        sleep "$interval"
    done
}

git_push_changes() {
    echo -e "\n${BLUE}[*] Checking for new/modified documents to push to GitHub...${NC}"
    
    # Check if there are changes
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${GREEN}[✓] Working tree is clean. No new documents or index changes to commit.${NC}"
        return 0
    fi

    local timestamp
    timestamp="$(date '+%Y-%m-%d %H:%M:%S')"
    local changed_count
    changed_count="$(git status --porcelain | wc -l)"

    echo -e "${YELLOW}[*] Staging ${changed_count} changed/new item(s)...${NC}"
    git add .

    local commit_msg="chore(sync): automated drive sync & academic archive update [${timestamp}]"
    git commit -m "$commit_msg"

    # Determine current branch
    local current_branch
    current_branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")"

    echo -e "${GREEN}[*] Pushing changes to remote repository (${current_branch})...${NC}"
    if git push origin "$current_branch"; then
        echo -e "${GREEN}[✓] Successfully synced and pushed all documents to GitHub!${NC}"
    else
        echo -e "${RED}[!] Git push failed. Please verify your internet connection or git credentials.${NC}"
    fi
}

main() {
    local no_push=false
    local forward_args=()

    for arg in "$@"; do
        case "$arg" in
            --no-push)
                no_push=true
                ;;
            --dry-run)
                no_push=true
                forward_args+=("$arg")
                ;;
            *)
                forward_args+=("$arg")
                ;;
        esac
    done

    if [[ "$1" == "--help" || "$1" == "-h" ]]; then
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  (no args)           Run incremental sync for individual & merged PYQs and auto-push to GitHub"
        echo "  --no-push           Sync and organize documents locally without pushing to GitHub"
        echo "  --force             Force re-download and re-parsing of all resources"
        echo "  --dry-run           Preview files to sync without downloading or pushing"
        echo "  --skip-bundles      Only sync single-subject question papers"
        echo "  --skip-individual   Only sync whole-semester merged bundles"
        echo "  --watch [SECONDS]   Run continuously in loop (default: 3600s / 1h)"
        echo "  --index-only        Skip downloads and rebuild subject Readmes / Master index"
        exit 0
    fi

    if [[ "$1" == "--index-only" ]]; then
        show_banner
        echo -e "${BLUE}[*] Re-generating Subject READMEs, Master Index & Web Catalog...${NC}"
        "$PYTHON_EXEC" "$SCRIPT_DIR/sort_pyqs_by_semester.py"
        "$PYTHON_EXEC" "$SCRIPT_DIR/generate_readmes.py"
        "$PYTHON_EXEC" "$SCRIPT_DIR/generate_catalog.py"
        echo -e "${GREEN}[✓] Documentation index & Web catalog rebuilt successfully!${NC}"
        if [ "$no_push" = false ]; then
            git_push_changes
        fi
        exit 0
    fi

    if [[ "$1" == "--watch" ]]; then
        show_banner
        check_dependencies
        watch_mode "$2"
        exit 0
    fi

    show_banner
    check_dependencies
    run_sync "${forward_args[@]}"

    if [ "$no_push" = false ]; then
        git_push_changes
    else
        echo -e "${YELLOW}[•] Skipped git push (--no-push / --dry-run active).${NC}"
    fi
}

main "$@"
