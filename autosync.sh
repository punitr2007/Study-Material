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

main() {
    if [[ "$1" == "--help" || "$1" == "-h" ]]; then
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  (no args)           Run incremental sync for individual & merged PYQs"
        echo "  --force             Force re-download and re-parsing of all resources"
        echo "  --dry-run           Preview files to sync without downloading"
        echo "  --skip-bundles      Only sync single-subject question papers"
        echo "  --skip-individual   Only sync whole-semester merged bundles"
        echo "  --watch [SECONDS]   Run continuously in loop (default: 3600s / 1h)"
        echo "  --index-only        Skip downloads and rebuild subject Readmes / Master index"
        exit 0
    fi

    if [[ "$1" == "--index-only" ]]; then
        show_banner
        echo -e "${BLUE}[*] Re-generating Subject READMEs & Master Index...${NC}"
        "$PYTHON_EXEC" "$SCRIPT_DIR/sort_pyqs_by_semester.py"
        "$PYTHON_EXEC" "$SCRIPT_DIR/generate_readmes.py"
        echo -e "${GREEN}[✓] Documentation index rebuilt successfully!${NC}"
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
    run_sync "$@"
}

main "$@"
