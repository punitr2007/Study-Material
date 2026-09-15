#!/usr/bin/env python3
"""
East Campus PYQ OCR & Precision Slicer
Processes all whole-semester merged bundles in Drive_Downloads/NSUT_East_Papers,
extracts text via Tesseract OCR, parses paper boundaries, filters with strict subject whitelists,
slices matching papers, and places them into the corresponding subject folders.
"""

import os
import re
import sys
import json
import shutil
import subprocess
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor, as_completed

EAST_DIR = Path("/home/punit/Local_Codebase/Projects/Extracted_Contents/Drive_Downloads/NSUT_East_Papers")
NOTES_DIR = Path("/home/punit/Local_Codebase/Projects/Extracted_Contents/notes")
TESSDATA_DIR = NOTES_DIR / "tessdata"
TMP_DIR = Path("/tmp/east_ocr_cache")
TMP_DIR.mkdir(parents=True, exist_ok=True)

TARGET_SUBJECTS = {
    "01_Signals_and_Systems_EAEPC302": {
        "folder": "01_Signals_and_Systems_EAEPC302",
        "name": "Signals and Systems",
        "allowed_codes": ["EAEPC302", "ECECC302", "EIECC302", "VTECC302"],
        "title_keywords": ["SIGNALS AND SYSTEMS", "SIGNALS & SYSTEMS", "SIGNAL AND SYSTEM", "CONTINUOUS AND DISCRETE TIME SIGNALS"],
        "negative_keywords": ["DIGITAL SIGNAL PROCESSING", "DSP", "IMAGE PROCESSING"]
    },
    "02_Probability_Theory_and_Random_Process_EAEPC303": {
        "folder": "02_Probability_Theory_and_Random_Process_EAEPC303",
        "name": "Probability Theory and Random Process",
        "allowed_codes": ["EAEPC303", "ECECC303", "VTECC303", "ECECC06"],
        "title_keywords": [
            "PROBABILITY THEORY AND RANDOM PROCESS",
            "PROBABILITY THEORY AND RANDOM PROCESSES",
            "PROBABILITY THEORY & RANDOM PROCESS",
            "PROBABILITY THEORY & RANDOM PROCESSES",
            "PROBABILITY AND RANDOM PROCESSES",
            "PROBABILITY & RANDOM PROCESSES",
            "PROBABILITY THEORY",
            "PTRP"
        ],
        "negative_keywords": []
    },
    "03_Microelectronics_Circuits_and_Applications_EAEPC304": {
        "folder": "03_Microelectronics_Circuits_and_Applications_EAEPC304",
        "name": "Microelectronics Circuits and Applications",
        "allowed_codes": ["EAEPC304", "ECECC304"],
        "title_keywords": [
            "MICROELECTRONICS CIRCUITS AND APPLICATIONS",
            "MICROELECTRONIC CIRCUITS AND APPLICATIONS",
            "MICROELECTRONICS CIRCUITS & APPLICATIONS",
            "MICROELECTRONIC CIRCUITS & APPLICATIONS",
            "MICROELECTRONICS CIRCUITS",
            "MICROELECTRONIC CIRCUITS"
        ],
        "negative_keywords": ["MICROPROCESSOR", "MICROCONTROLLER"]
    },
    "04_Digital_Circuits_and_Systems_EAEPC305": {
        "folder": "04_Digital_Circuits_and_Systems_EAEPC305",
        "name": "Digital Circuits and Systems",
        "allowed_codes": ["EAEPC305", "ECECC305", "EEECC08", "ICECC305", "VTECC305"],
        "title_keywords": [
            "DIGITAL CIRCUITS AND SYSTEMS",
            "DIGITAL CIRCUITS & SYSTEMS",
            "DIGITAL CIRCUITS"
        ],
        "negative_keywords": [
            "CMOS",
            "DIGITAL SIGNAL PROCESSING",
            "DSP",
            "DIGITAL FORENSICS",
            "DIGITAL IMAGE PROCESSING",
            "DIGITAL COMMUNICATION",
            "ANALOG AND DIGITAL COMMUNICATION",
            "BASICS OF ANALOG AND DIGITAL"
        ]
    },
    "05_Mathematics_For_Machine_Learning_EPMTC301": {
        "folder": "05_Mathematics_For_Machine_Learning_EPMTC301",
        "name": "Mathematics For Machine Learning",
        "allowed_codes": ["EPMTC301"],
        "title_keywords": [
            "MATHEMATICS FOR MACHINE LEARNING",
            "MATHEMATICS FOR ML"
        ],
        "negative_keywords": [
            "OPTIMIZATION TECHNIQUES",
            "MATHEMATICS FOR COMMUNICATION",
            "COMMUNICATION AND SIGNAL PROCESSING"
        ]
    }
}


def render_pdf_to_images(pdf_path: Path) -> list[Path]:
    """Renders all pages of a PDF to PNG images at 150 DPI in one command."""
    prefix = TMP_DIR / f"{pdf_path.stem}_page"
    # Check if images already exist
    existing = sorted(TMP_DIR.glob(f"{pdf_path.stem}_page-*.png"))
    if existing:
        return existing
    
    print(f"[*] Rendering {pdf_path.name} to images...")
    subprocess.run(["pdftoppm", "-png", "-r", "150", str(pdf_path), str(prefix)], check=True)
    images = sorted(TMP_DIR.glob(f"{pdf_path.stem}_page-*.png"))
    return images


def run_ocr_on_single_image(img_path: Path) -> tuple[int, str]:
    """Runs tesseract with OMP_NUM_THREADS=1 on a single page image."""
    # Extract page index from filename
    # pdftoppm names files like prefix-01.png or prefix-1.png
    match = re.search(r"-(\d+)\.png$", img_path.name)
    page_num = int(match.group(1)) if match else 0
    
    cache_txt = img_path.with_suffix(".txt")
    if cache_txt.exists():
        return page_num, cache_txt.read_text(encoding="utf-8", errors="ignore")
    
    env = os.environ.copy()
    env["OMP_NUM_THREADS"] = "1"
    env["TESSDATA_PREFIX"] = str(TESSDATA_DIR)
    
    cmd = [
        "tesseract",
        str(img_path),
        "stdout",
        "-l", "eng",
        "--tessdata-dir", str(TESSDATA_DIR),
        "--psm", "6"
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=env)
    text = res.stdout.strip()
    cache_txt.write_text(text, encoding="utf-8")
    return page_num, text


def ocr_entire_bundle(pdf_path: Path) -> dict[int, str]:
    """Renders PDF to images and OCRs all pages in parallel."""
    images = render_pdf_to_images(pdf_path)
    print(f"[*] OCRing {len(images)} pages for {pdf_path.name} using ProcessPoolExecutor...")
    
    pages_text = {}
    with ProcessPoolExecutor(max_workers=min(12, os.cpu_count() or 4)) as executor:
        futures = {executor.submit(run_ocr_on_single_image, img): img for img in images}
        for fut in as_completed(futures):
            pnum, text = fut.result()
            pages_text[pnum] = text
            
    print(f"[✓] Completed OCR for {pdf_path.name} ({len(pages_text)} pages)")
    return pages_text


def is_new_paper_header(text: str) -> bool:
    """Detects if a page contains the top header of a new question paper."""
    t = text.upper()
    
    # Common header markers in NSUT/AIACTR exam papers
    has_exam = any(k in t for k in [
        "EXAMINATION", "MID-SEMESTER", "MID SEMESTER", "END-SEMESTER", "END SEMESTER",
        "DEGREE:", "B.TECH", "B. TECH", "SEMESTER:", "ROLL NO", "TOTAL NO. OF PAGES"
    ])
    has_course = any(k in t for k in [
        "COURSE TITLE", "PAPER TITLE", "SUBJECT TITLE", "COURSE CODE", "PAPER CODE",
        "SUBJECT CODE", "DURATION:", "TIME ALLOWED", "MAX. MARKS", "MAX MARKS"
    ])
    
    return has_exam and has_course


def match_subject(text: str) -> tuple[str | None, str | None, str | None]:
    """
    Evaluates text against TARGET_SUBJECTS.
    Returns (subject_folder_key, matched_code_or_title, match_type).
    """
    clean_text = text.upper()
    
    for sub_key, conf in TARGET_SUBJECTS.items():
        # Check negative keywords first
        if any(neg in clean_text for neg in conf["negative_keywords"]):
            continue
        
        # Check allowed codes (strict word boundary regex)
        for code in conf["allowed_codes"]:
            # Match code allowing slight OCR typos if needed, but exact first
            pattern = r"(?<![A-Z0-9])" + re.escape(code) + r"(?![A-Z0-9])"
            if re.search(pattern, clean_text):
                return sub_key, code, "code"
                
        # Check title keywords
        for title_kw in conf["title_keywords"]:
            if title_kw in clean_text:
                return sub_key, title_kw, "title"
                
    return None, None, None


def extract_exam_metadata(header_text: str, bundle_name: str) -> tuple[str, str]:
    """Extracts exam type (Mid_Semester/End_Semester) and year from header or bundle filename."""
    t = (bundle_name + " " + header_text).upper()
    
    # Exam type
    if "MID" in t or "MID-SEM" in t or "MID_SEM" in t or "MSE" in t:
        exam_type = "Mid_Semester"
    elif "END" in t or "END-SEM" in t or "END_SEM" in t or "ESE" in t:
        exam_type = "End_Semester"
    elif "SUMMER" in t:
        exam_type = "Summer_Semester"
    else:
        exam_type = "Mid_Semester" if "MID" in bundle_name.upper() else "End_Semester"
        
    # Year
    year_match = re.search(r"202[0-9]", t)
    year = year_match.group(0) if year_match else "2026"
    
    return exam_type, year


def slice_pdf(src_pdf: Path, start_page: int, end_page: int, dest_path: Path):
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    cmd = ["qpdf", "--empty", "--pages", str(src_pdf), f"{start_page}-{end_page}", "--", str(dest_path)]
    subprocess.run(cmd, check=True)


def process_bundle(pdf_path: Path):
    print(f"\n=======================================================")
    print(f"[*] Analyzing Bundle: {pdf_path.name}")
    print(f"=======================================================")
    pages_text = ocr_entire_bundle(pdf_path)
    total_pages = len(pages_text)
    
    # 1. Identify paper segments
    paper_starts = []
    for p in range(1, total_pages + 1):
        txt = pages_text.get(p, "")
        if is_new_paper_header(txt):
            paper_starts.append(p)
            
    if not paper_starts or paper_starts[0] != 1:
        # If page 1 wasn't detected as header, assume page 1 starts a paper
        if 1 not in paper_starts:
            paper_starts.insert(0, 1)
            
    paper_ranges = []
    for i, start_p in enumerate(paper_starts):
        end_p = paper_starts[i+1] - 1 if i + 1 < len(paper_starts) else total_pages
        paper_ranges.append((start_p, end_p))
        
    print(f"[*] Identified {len(paper_ranges)} distinct question papers in bundle.")
    
    # 2. Check each paper for target subject matches
    matched_papers = []
    for start_p, end_p in paper_ranges:
        combined_text = "\n".join(pages_text.get(p, "") for p in range(start_p, end_p + 1))
        header_text = pages_text.get(start_p, "")[:600]
        
        sub_key, matched_term, match_type = match_subject(combined_text)
        if sub_key:
            exam_type, year = extract_exam_metadata(header_text, pdf_path.name)
            matched_papers.append({
                "sub_key": sub_key,
                "start_page": start_p,
                "end_page": end_p,
                "matched_term": matched_term,
                "match_type": match_type,
                "exam_type": exam_type,
                "year": year,
                "header_snippet": header_text.replace("\n", " ")[:150]
            })
            print(f"  [MATCH] Subject: {sub_key} | Pages {start_p}-{end_p} | Match: {matched_term} ({match_type}) | Exam: {year} {exam_type}")
        else:
            # Check if there was any interesting course title for debugging
            title_match = re.search(r"(?i)course\s*title\s*:\s*([^\n\r]+)", header_text)
            code_match = re.search(r"(?i)course\s*code\s*:\s*([^\n\r]+)", header_text)
            title_str = title_match.group(1).strip() if title_match else "N/A"
            code_str = code_match.group(1).strip() if code_match else "N/A"
            # print(f"  [SKIP] Pages {start_p}-{end_p}: Code: {code_str} | Title: {title_str}")

    print(f"[✓] Total matched target papers in {pdf_path.name}: {len(matched_papers)}")
    
    # 3. Slice and route matched papers
    for item in matched_papers:
        sub_folder = NOTES_DIR / item["sub_key"] / "downloaded_pyqs" / item["exam_type"]
        sub_folder.mkdir(parents=True, exist_ok=True)
        
        # Clean safe filename
        term_clean = re.sub(r'[^A-Za-z0-9_]', '_', item['matched_term'])
        out_name = f"{item['year']}_{item['exam_type']}_{term_clean}_Pages_{item['start_page']}_{item['end_page']}.pdf"
        dest_pdf = sub_folder / out_name
        
        print(f"[*] Slicing pages {item['start_page']}-{item['end_page']} -> {dest_pdf.name}")
        slice_pdf(pdf_path, item['start_page'], item['end_page'], dest_pdf)
        print(f"    [+] Saved to {dest_pdf}")


def main():
    bundles = sorted(EAST_DIR.glob("*.pdf"))
    if not bundles:
        print(f"[!] No PDF files found in {EAST_DIR}")
        return
        
    print(f"Found {len(bundles)} bundles in {EAST_DIR}:")
    for b in bundles:
        print(f" - {b.name}")
        
    for b in bundles:
        process_bundle(b)
        
    print("\n=======================================================")
    print("[*] Rebuilding Master Index, Subject READMEs, and Web Catalog...")
    print("=======================================================")
    subprocess.run([sys.executable, str(NOTES_DIR / "generate_readmes.py")], check=True)
    subprocess.run([sys.executable, str(NOTES_DIR / "generate_catalog.py")], check=True)
    print("\n[✓] All East Campus PYQs processed, routed, and indexed successfully!")


if __name__ == "__main__":
    main()
