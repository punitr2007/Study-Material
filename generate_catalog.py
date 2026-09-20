#!/usr/bin/env python3
"""
Catalog Manifest Generator for Study-Material Web Portal
=========================================================
Scans all course subjects and generates web/public/catalog.json
with jsDelivr CDN preview links and GitHub direct download links.
Includes deep recursive scanning for Practice Material, Linear Algebra Done Right,
and Curated Textbooks & Reference Repositories.
"""

import os
import re
import json
import urllib.parse
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = BASE_DIR / "web" / "public"
OUTPUT_FILE = PUBLIC_DIR / "catalog.json"

REPO_OWNER = "punitr2007"
REPO_NAME = "Study-Material"
BRANCH = "main"

SUBJECT_TITLES = {
    "01_Signals_and_Systems_EAEPC302": "Signals and Systems (EAEPC302 / ECECC302)",
    "02_Probability_Theory_and_Random_Process_EAEPC303": "Probability Theory and Random Process (EAEPC303 / ECECC303)",
    "03_Microelectronics_Circuits_and_Applications_EAEPC304": "Microelectronics Circuits and Applications (EAEPC304 / ECECC304)",
    "04_Digital_Circuits_and_Systems_EAEPC305": "Digital Circuits and Systems (EAEPC305 / ECECC305)",
    "05_Mathematics_For_Machine_Learning_EPMTC301": "Mathematics for Machine Learning (EPMTC301)",
}

CATEGORY_LABELS = {
    "Mid_Semester": "Mid-Semester PYQ",
    "End_Semester": "End-Semester PYQ",
    "Summer_Semester": "Summer / Special Exam",
    "downloaded_pyqs": "Question Papers",
    "downloaded_notes": "Lecture Notes",
    "Practice_Material": "Practice Material & Worksheets",
    "Linear_Algebra_Done_Right": "Linear Algebra Done Right (4th Ed)",
    "Textbooks": "Textbooks & References",
    "Textbooks_and_References": "Textbooks & References",
    "MIT_OCW_18.06_Linear_Algebra": "MIT OCW 18.06 (Linear Algebra)",
    "Miami_MTH210_Linear_Algebra": "Miami MTH 210 (Linear Algebra)",
    "Abstract_Proof_Based_Linear_Algebra": "Proof-Based Linear Algebra",
    "EPMTC301_Matching_Assignments": "EPMTC301 Mapped Assignments",
    "Unit_1_Linear_Algebra": "Unit 1 Practice Problems",
    "Unit_2_Matrix_Theory": "Unit 2 Practice Problems",
    "Unit_1": "Unit 1 Notes",
    "Unit_2": "Unit 2 Notes",
    "Unit_3": "Unit 3 Notes",
    "Unit_4": "Unit 4 Notes",
    "Unit_5": "Unit 5 Notes",
    "Assignments": "Assignments & Solutions",
    "Assignments_and_Tutorials": "Assignments & Tutorials",
    "Lab_Manuals_and_Experiments": "Lab Manuals & Experiments",
    "Handwritten_Notes": "Handwritten Notes",
    "Lecture_Slides": "Lecture Slides",
    "Lecture_Slides_Prof_Razavi": "Prof. Razavi Slides",
    "Syllabus": "Syllabus & Course Info"
}


def format_size(bytes_size: int) -> str:
    if bytes_size < 1024:
        return f"{bytes_size} B"
    elif bytes_size < 1024 * 1024:
        return f"{bytes_size / 1024:.1f} KB"
    else:
        return f"{bytes_size / (1024 * 1024):.2f} MB"


def clean_display_title(filename: str) -> str:
    name = Path(filename).stem
    # Replace underscores, multiple dashes
    name = name.replace("_", " ").replace("-", " ")
    # Clean up double spaces
    name = re.sub(r"\s+", " ", name).strip()
    return name


def extract_year(text: str) -> str:
    # Robustly match 4-digit academic years (2015–2029) without digit boundaries
    match = re.search(r"(?<!\d)(201[5-9]|202[0-9])(?!\d)", text)
    return match.group(1) if match else ""


def build_catalog() -> dict:
    subjects = sorted([d for d in BASE_DIR.iterdir() if d.is_dir() and d.name[:2].isdigit()])
    
    all_documents = []
    subject_list = []

    for s_dir in subjects:
        s_id = s_dir.name
        s_num = s_id[:2]
        s_code = s_id.split("_")[-1]
        s_name = " ".join(s_id.split("_")[1:-1])
        s_title = SUBJECT_TITLES.get(s_id, s_name)

        s_doc_count = 0

        # Scan all subdirectories in subject
        top_cats = sorted([d for d in s_dir.iterdir() if d.is_dir() and not d.name.startswith(".")])

        for cat_dir in top_cats:
            cat_name = cat_dir.name
            
            # Recursively walk the category directory
            for root, dirs, files in os.walk(cat_dir):
                # Filter out hidden directories and LaTeX source if not desired as doc cards
                dirs[:] = [d for d in dirs if not d.startswith(".")]
                
                for f_name in sorted(files):
                    if f_name.startswith(".") or f_name in ["README.md", "SYLLABUS.md", "packages.tex", "math_commands.tex"]:
                        continue
                    # Skip raw tex files from main cards if PDF exists, but allow MD and PDF
                    if f_name.endswith(".tex"):
                        continue

                    f_path = Path(root) / f_name
                    rel_path = f_path.relative_to(BASE_DIR).as_posix()
                    size_b = f_path.stat().st_size
                    ext = f_path.suffix.upper().replace(".", "") or "FILE"
                    year = extract_year(f_name) or extract_year(f_path.parent.name) or extract_year(rel_path)

                    # Determine sub_category
                    rel_to_cat = f_path.relative_to(cat_dir)
                    sub_name = rel_to_cat.parts[0] if len(rel_to_cat.parts) > 1 else None

                    url_encoded_path = urllib.parse.quote(rel_path)
                    jsdelivr_url = f"https://cdn.jsdelivr.net/gh/{REPO_OWNER}/{REPO_NAME}@{BRANCH}/{url_encoded_path}"
                    raw_github_url = f"https://raw.githubusercontent.com/{REPO_OWNER}/{REPO_NAME}/{BRANCH}/{url_encoded_path}"

                    cat_label = CATEGORY_LABELS.get(cat_name, cat_name.replace("_", " "))
                    if sub_name and sub_name in CATEGORY_LABELS:
                        cat_label = CATEGORY_LABELS[sub_name]
                    elif sub_name:
                        cat_label = sub_name.replace("_", " ")

                    doc_entry = {
                        "id": f"{s_code}_{len(all_documents) + 1}",
                        "filename": f_name,
                        "title": clean_display_title(f_name),
                        "subject_id": s_id,
                        "subject_name": s_name,
                        "subject_code": s_code,
                        "category": cat_name,
                        "category_label": cat_label,
                        "sub_category": sub_name,
                        "relative_path": rel_path,
                        "size_bytes": size_b,
                        "size_formatted": format_size(size_b),
                        "file_type": ext,
                        "year": year,
                        "preview_url": jsdelivr_url,
                        "download_url": raw_github_url
                    }
                    all_documents.append(doc_entry)
                    s_doc_count += 1

        subject_list.append({
            "id": s_id,
            "number": s_num,
            "code": s_code,
            "name": s_name,
            "title": s_title,
            "document_count": s_doc_count
        })

    catalog = {
        "repository": f"{REPO_OWNER}/{REPO_NAME}",
        "branch": BRANCH,
        "generated_at": datetime.now().isoformat(),
        "total_subjects": len(subject_list),
        "total_documents": len(all_documents),
        "subjects": subject_list,
        "documents": all_documents
    }

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2)

    print(f"[✓] Successfully generated catalog manifest at: {OUTPUT_FILE}")
    print(f"    - Subjects indexed: {len(subject_list)}")
    print(f"    - Documents indexed: {len(all_documents)}")
    return catalog


if __name__ == "__main__":
    build_catalog()
