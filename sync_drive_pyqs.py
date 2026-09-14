#!/usr/bin/env python3
"""
Drive PYQ AutoSync Engine & Intelligent Merged-Bundle OCR Slicer
================================================================
Fetches only latest / updated question papers from Google Drive incrementally,
parses whole-semester merged exam PDF bundles via Tesseract OCR / text extraction,
slices target subject papers, routes them into subject folders, and regenerates indexes.

Usage:
    python3 sync_drive_pyqs.py [--force] [--skip-bundles] [--skip-individual] [--dry-run]
"""

import os
import re
import sys
import json
import time
import shutil
import hashlib
import requests
import subprocess
from pathlib import Path
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

BASE_DIR = Path(__file__).resolve().parent
CONFIG_FILE = BASE_DIR / "subjects_config.json"
STATE_FILE = BASE_DIR / ".sync_state.json"
CACHE_DIR = BASE_DIR / ".bundle_cache"
TESSDATA_DIR = BASE_DIR / "tessdata"


def load_config() -> dict:
    if not CONFIG_FILE.exists():
        raise FileNotFoundError(f"Configuration file not found: {CONFIG_FILE}")
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def load_sync_state() -> dict:
    if STATE_FILE.exists():
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"individual_files": {}, "merged_bundles": {}, "last_sync": None}


def save_sync_state(state: dict):
    state["last_sync"] = datetime.now().isoformat()
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)


def get_confirm_token(response) -> str | None:
    for key, value in response.cookies.items():
        if key.startswith("download_warning"):
            return value
    if "confirm=" in response.text:
        match = re.search(r"confirm=([0-9A-Za-z_]+)", response.text)
        if match:
            return match.group(1)
    return None


def download_file_from_drive(file_id: str, destination: Path) -> tuple[bool, str | int]:
    """Robust chunked download with session cookie and virus scan bypass."""
    url = "https://drive.google.com/uc?export=download"
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    })

    destination.parent.mkdir(parents=True, exist_ok=True)
    params = {"id": file_id, "confirm": "t"}
    try:
        response = session.get(url, params=params, stream=True, timeout=30)
        token = get_confirm_token(response)
        if token:
            params["confirm"] = token
            response = session.get(url, params=params, stream=True, timeout=30)

        if response.status_code != 200 or not (b"%PDF" in response.content[:1024] or b"PDF" in response.content[:1024]):
            alt_url = f"https://drive.usercontent.google.com/download?id={file_id}&export=download&confirm=t"
            response = session.get(alt_url, stream=True, timeout=30)

        content = response.content
        if len(content) > 500 and (b"%PDF" in content[:1024] or b"PDF" in content[:1024]):
            with open(destination, "wb") as f:
                f.write(content)
            return True, len(content)
        else:
            return False, f"Invalid PDF response ({len(content)} bytes)"
    except Exception as e:
        return False, str(e)


def extract_page_text(pdf_path: Path, page_num: int) -> str:
    """Extracts text from a single page of PDF using pdftotext or Tesseract OCR."""
    # 1. Fast digital extraction
    try:
        res = subprocess.run(
            ["pdftotext", "-f", str(page_num), "-l", str(page_num), str(pdf_path), "-"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=10
        )
        text = res.stdout.strip()
        if len(text) > 40:
            return text
    except Exception:
        pass

    # 2. OCR fallback
    temp_prefix = f"ocr_slice_tmp_{os.getpid()}_{page_num}"
    try:
        subprocess.run(
            ["pdftoppm", "-png", "-r", "150", "-f", str(page_num), "-l", str(page_num), str(pdf_path), temp_prefix],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=20
        )
        img_candidates = list(Path(".").glob(f"{temp_prefix}*.png"))
        if img_candidates:
            img_file = img_candidates[0]
            cmd = ["tesseract", str(img_file), "stdout", "-l", "eng"]
            if TESSDATA_DIR.exists():
                cmd.extend(["--tessdata-dir", str(TESSDATA_DIR)])
            ocr_res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=20)
            ocr_text = ocr_res.stdout.strip()
            img_file.unlink(missing_ok=True)
            return ocr_text
    except Exception as e:
        print(f"[!] OCR slice error on page {page_num}: {e}")
    finally:
        for f in Path(".").glob(f"{temp_prefix}*"):
            try:
                f.unlink(missing_ok=True)
            except Exception:
                pass

    return ""


def get_pdf_page_count(pdf_path: Path) -> int:
    try:
        res = subprocess.run(["pdfinfo", str(pdf_path)], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        for line in res.stdout.splitlines():
            if line.startswith("Pages:"):
                return int(line.split(":")[1].strip())
    except Exception:
        pass

    try:
        from pypdf import PdfReader
        reader = PdfReader(str(pdf_path))
        return len(reader.pages)
    except Exception:
        return 0


def match_text_to_subject(text: str, filename: str, config: dict) -> tuple[str | None, str | None]:
    """
    Checks if text/filename matches any configured subject.
    Returns (subject_folder_key, matched_alias).
    """
    combined = (filename + " " + text).upper()

    for sub_key, sub_info in config["subjects"].items():
        # Check exclusions
        if any(ex.upper() in combined for ex in sub_info.get("excluded_keywords", [])):
            continue

        # Check code aliases
        for code in sub_info.get("code_aliases", []):
            pattern = r"(?<![A-Z0-9])" + re.escape(code.upper()) + r"(?![A-Z0-9])"
            if re.search(pattern, combined):
                return sub_key, code

        # Check title keywords
        for kw in sub_info.get("title_keywords", []):
            if kw.upper() in combined:
                return sub_key, kw

    return None, None


def slice_pdf_pages(src_pdf: Path, start_page: int, end_page: int, dest_pdf: Path) -> bool:
    """Extracts a range of pages [start_page, end_page] from src_pdf into dest_pdf."""
    dest_pdf.parent.mkdir(parents=True, exist_ok=True)
    try:
        from pypdf import PdfReader, PdfWriter
        reader = PdfReader(str(src_pdf))
        writer = PdfWriter()
        for p in range(start_page - 1, min(end_page, len(reader.pages))):
            writer.add_page(reader.pages[p])
        with open(dest_pdf, "wb") as f:
            writer.write(f)
        return True
    except Exception:
        # Fallback to qpdf
        try:
            cmd = ["qpdf", "--empty", "--pages", str(src_pdf), f"{start_page}-{end_page}", "--", str(dest_pdf)]
            res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            return res.returncode == 0
        except Exception:
            return False


def sync_individual_pyqs(config: dict, state: dict, force: bool = False, dry_run: bool = False):
    """Incremental fetcher for individual subject question papers from Drive Folder 1."""
    import gdown

    folder_id = config["drive_sources"]["individual_pyqs_folder"]["folder_id"]
    print(f"\n=======================================================")
    print(f"[*] Checking Folder 1 (Individual PYQs): {folder_id}")
    print(f"=======================================================")

    try:
        files = gdown.download_folder(id=folder_id, skip_download=True, quiet=True)
    except Exception as e:
        print(f"[!] Error querying Drive Folder 1: {e}")
        return

    print(f"[*] Found {len(files)} total files in Drive repository.")

    tasks = []
    skipped_existing = 0

    for f in files:
        file_id = f.id
        filename = Path(f.path).name
        if not filename.lower().endswith(".pdf"):
            continue

        sub_key, matched_alias = match_text_to_subject("", filename, config)
        if not sub_key:
            continue

        clean_fn = filename.replace(" ", "_").replace(",", "_").replace("(", "").replace(")", "")
        if not clean_fn.endswith(".pdf"):
            clean_fn += ".pdf"

        dest_path = BASE_DIR / sub_key / "downloaded_pyqs" / clean_fn
        file_state = state["individual_files"].get(file_id)

        if not force and file_state and dest_path.exists() and dest_path.stat().st_size > 1000:
            skipped_existing += 1
            continue

        tasks.append((sub_key, file_id, clean_fn, dest_path))

    print(f"[*] Identified {len(tasks)} new/updated subject papers to sync ({skipped_existing} up-to-date).")

    if dry_run:
        for sub_key, file_id, clean_fn, dest in tasks[:15]:
            print(f"  [DRY-RUN] Would download [{sub_key}] -> {clean_fn}")
        return

    if not tasks:
        print("[✓] All individual subject PYQs are up to date!")
        return

    def download_task(t):
        sub_k, fid, cfn, dst = t
        if dst.exists() and dst.stat().st_size > 1000 and not force:
            return "skipped", sub_k, fid, cfn, dst.stat().st_size
        success, info = download_file_from_drive(fid, dst)
        if success:
            return "success", sub_k, fid, cfn, info
        return "failed", sub_k, fid, cfn, info

    with ThreadPoolExecutor(max_workers=6) as executor:
        results = list(executor.map(download_task, tasks))

    success_cnt = 0
    for status, sub_k, fid, cfn, info in results:
        if status == "success":
            success_cnt += 1
            state["individual_files"][fid] = {
                "filename": cfn,
                "subject": sub_k,
                "size": info,
                "synced_at": datetime.now().isoformat()
            }
            print(f"  [✓ DOWNLOADED] [{sub_k}] {cfn} ({info} bytes)")
        elif status == "skipped":
            pass
        else:
            print(f"  [✗ FAILED]     [{sub_k}] {cfn} -> {info}")

    print(f"[✓] Individual sync complete: {success_cnt} new files downloaded.")


def sync_and_slice_merged_bundles(config: dict, state: dict, force: bool = False, dry_run: bool = False):
    """Incremental processor for multi-subject exam bundles from Drive Folder 2."""
    import gdown

    folder_id = config["drive_sources"]["merged_pyqs_folder"]["folder_id"]
    print(f"\n=======================================================")
    print(f"[*] Checking Folder 2 (Merged Exam Bundles): {folder_id}")
    print(f"=======================================================")

    CACHE_DIR.mkdir(parents=True, exist_ok=True)

    try:
        bundles = gdown.download_folder(id=folder_id, skip_download=True, quiet=True)
    except Exception as e:
        print(f"[!] Error querying Drive Folder 2: {e}")
        return

    print(f"[*] Found {len(bundles)} merged bundles in Drive repository.")

    for b in bundles:
        bundle_id = b.id
        bundle_name = Path(b.path).name
        if not bundle_name.lower().endswith(".pdf"):
            continue

        cached_bundle_pdf = CACHE_DIR / bundle_name
        bundle_state = state["merged_bundles"].get(bundle_id)

        if not force and bundle_state and bundle_state.get("status") == "completed":
            print(f"[• SKIPPED BUNDLE] {bundle_name} (Already parsed & extracted)")
            continue

        print(f"\n---> Processing Merged Bundle: {bundle_name}")

        if dry_run:
            print(f"  [DRY-RUN] Would download and OCR-slice pages for: {bundle_name}")
            continue

        # Download bundle if not in cache
        if not cached_bundle_pdf.exists() or cached_bundle_pdf.stat().st_size < 1000:
            print(f"[*] Downloading bundle ({bundle_name})...")
            success, info = download_file_from_drive(bundle_id, cached_bundle_pdf)
            if not success:
                print(f"[!] Failed to download bundle {bundle_name}: {info}")
                continue

        total_pages = get_pdf_page_count(cached_bundle_pdf)
        print(f"[*] Bundle downloaded ({total_pages} pages). Slicing subject question papers...")

        # Parse pages and identify question paper segments
        paper_segments = []
        current_sub = None
        current_alias = None
        start_p = None

        exam_type_in_title = "Mid_Semester" if "MID" in bundle_name.upper() else "End_Semester"
        year_match = re.search(r"(202[1-7])", bundle_name)
        bundle_year = year_match.group(1) if year_match else "2026"

        for p_num in range(1, total_pages + 1):
            p_text = extract_page_text(cached_bundle_pdf, p_num)
            sub_key, matched_alias = match_text_to_subject(p_text, "", config)

            # Check if this page is the beginning of a paper (contains exam header)
            is_new_header = bool(re.search(
                r"(MID\s*SEMESTER|END\s*SEMESTER|NETAJI\s*SUBHAS|UNIVERSITY|EXAMINATION|MAX\.?\s*MARKS)",
                p_text,
                re.IGNORECASE
            ))

            if sub_key:
                if current_sub and sub_key != current_sub:
                    # Close previous segment
                    paper_segments.append((current_sub, current_alias, start_p, p_num - 1))
                    current_sub = sub_key
                    current_alias = matched_alias
                    start_p = p_num
                elif not current_sub:
                    current_sub = sub_key
                    current_alias = matched_alias
                    start_p = p_num
            elif is_new_header and current_sub:
                # Encountered another subject paper header that doesn't match our target list
                paper_segments.append((current_sub, current_alias, start_p, p_num - 1))
                current_sub = None
                current_alias = None
                start_p = None

        if current_sub and start_p:
            paper_segments.append((current_sub, current_alias, start_p, total_pages))

        # Extract segments
        extracted_papers = []
        for sub_k, alias, s_page, e_page in paper_segments:
            safe_alias = re.sub(r"[^A-Za-z0-9_]", "", alias or "Paper")
            dest_fn = f"{bundle_year}_{exam_type_in_title}_{safe_alias}_Pages_{s_page}_{e_page}.pdf"
            dest_path = BASE_DIR / sub_k / "downloaded_pyqs" / exam_type_in_title / dest_fn

            if slice_pdf_pages(cached_bundle_pdf, s_page, e_page, dest_path):
                print(f"  [✓ EXTRACTED] [{sub_k}] {dest_fn} (Pages {s_page}-{e_page})")
                extracted_papers.append({
                    "subject": sub_k,
                    "filename": dest_fn,
                    "pages": f"{s_page}-{e_page}"
                })

        state["merged_bundles"][bundle_id] = {
            "name": bundle_name,
            "status": "completed",
            "extracted_count": len(extracted_papers),
            "extracted_papers": extracted_papers,
            "synced_at": datetime.now().isoformat()
        }


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Drive PYQ AutoSync & OCR-Bundle Slicer")
    parser.add_argument("--force", action="store_true", help="Force re-download and re-parsing of all resources")
    parser.add_argument("--skip-bundles", action="store_true", help="Skip processing multi-subject merged bundles")
    parser.add_argument("--skip-individual", action="store_true", help="Skip syncing individual subject PYQs")
    parser.add_argument("--dry-run", action="store_true", help="Preview sync actions without downloading")
    args = parser.parse_args()

    config = load_config()
    state = load_sync_state()

    print("\n" + "=" * 65)
    print("🚀 NSUT Study-Material Intelligent AutoSync Engine")
    print("=" * 65)

    if not args.skip_individual:
        sync_individual_pyqs(config, state, force=args.force, dry_run=args.dry_run)

    if not args.skip_bundles:
        sync_and_slice_merged_bundles(config, state, force=args.force, dry_run=args.dry_run)

    if not args.dry_run:
        save_sync_state(state)
        print("\n[*] Running sorting and index generation pipeline...")
        # Run classification & documentation update
        try:
            subprocess.run([sys.executable, str(BASE_DIR / "sort_pyqs_by_semester.py")], check=True)
            subprocess.run([sys.executable, str(BASE_DIR / "generate_readmes.py")], check=True)
        except Exception as e:
            print(f"[!] Warning during post-sync indexing: {e}")

    print("\n[✓] AutoSync process completed successfully!")


if __name__ == "__main__":
    main()
