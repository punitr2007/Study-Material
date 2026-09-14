#!/usr/bin/env python3
"""
Catalog Manifest Generator for Study-Material Web Portal
=========================================================
Scans all course subjects and generates web/public/catalog.json
with jsDelivr CDN preview links and GitHub direct download links.
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
    "Unit_1": "Unit 1 Notes",
    "Unit_2": "Unit 2 Notes",
    "Unit_3": "Unit 3 Notes",
    "Unit_4": "Unit 4 Notes",
    "Unit_5": "Unit 5 Notes",
    "Assignments": "Assignments & Solutions",
    "Assignments_and_Tutorials": "Assignments & Tutorials",
    "Textbooks": "Textbooks & References",
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
    match = re.search(r"\b(202[0-9]|201[5-9])\b", text)
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
        s_categories = []

        subdirs = sorted([d for d in s_dir.iterdir() if d.is_dir() and not d.name.startswith(".")])

        for cat_dir in subdirs:
            cat_name = cat_dir.name
            nested_dirs = sorted([nd for nd in cat_dir.iterdir() if nd.is_dir() and not nd.name.startswith(".")])
            direct_files = sorted([f for f in cat_dir.iterdir() if f.is_file() and not f.name.startswith(".") and f.name != "README.md"])

            if direct_files:
                for f in direct_files:
                    rel_path = f.relative_to(BASE_DIR).as_posix()
                    size_b = f.stat().st_size
                    ext = f.suffix.upper().replace(".", "") or "FILE"
                    year = extract_year(f.name)

                    # Encode paths properly for URLs
                    url_encoded_path = urllib.parse.quote(rel_path)
                    jsdelivr_url = f"https://cdn.jsdelivr.net/gh/{REPO_OWNER}/{REPO_NAME}@{BRANCH}/{url_encoded_path}"
                    raw_github_url = f"https://raw.githubusercontent.com/{REPO_OWNER}/{REPO_NAME}/{BRANCH}/{url_encoded_path}"

                    doc_entry = {
                        "id": f"{s_code}_{len(all_documents) + 1}",
                        "filename": f.name,
                        "title": clean_display_title(f.name),
                        "subject_id": s_id,
                        "subject_name": s_name,
                        "subject_code": s_code,
                        "category": cat_name,
                        "category_label": CATEGORY_LABELS.get(cat_name, cat_name.replace("_", " ")),
                        "sub_category": None,
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

            if nested_dirs:
                for sub_cat in nested_dirs:
                    sub_name = sub_cat.name
                    nested_files = sorted([f for f in sub_cat.iterdir() if f.is_file() and not f.name.startswith(".") and f.name != "README.md"])
                    
                    for f in nested_files:
                        rel_path = f.relative_to(BASE_DIR).as_posix()
                        size_b = f.stat().st_size
                        ext = f.suffix.upper().replace(".", "") or "FILE"
                        year = extract_year(f.name)

                        url_encoded_path = urllib.parse.quote(rel_path)
                        jsdelivr_url = f"https://cdn.jsdelivr.net/gh/{REPO_OWNER}/{REPO_NAME}@{BRANCH}/{url_encoded_path}"
                        raw_github_url = f"https://raw.githubusercontent.com/{REPO_OWNER}/{REPO_NAME}/{BRANCH}/{url_encoded_path}"

                        doc_entry = {
                            "id": f"{s_code}_{len(all_documents) + 1}",
                            "filename": f.name,
                            "title": clean_display_title(f.name),
                            "subject_id": s_id,
                            "subject_name": s_name,
                            "subject_code": s_code,
                            "category": cat_name,
                            "category_label": CATEGORY_LABELS.get(sub_name, CATEGORY_LABELS.get(cat_name, sub_name.replace("_", " "))),
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
        "total_documents": len(all_documents),
        "total_subjects": len(subject_list),
        "subjects": subject_list,
        "documents": all_documents
    }

    return catalog


def main():
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    catalog = build_catalog()
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    print(f"[✓] Successfully generated catalog manifest at: {OUTPUT_FILE}")
    print(f"    - Subjects indexed: {catalog['total_subjects']}")
    print(f"    - Documents indexed: {catalog['total_documents']}")


if __name__ == "__main__":
    main()
