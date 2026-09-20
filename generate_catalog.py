#!/usr/bin/env python3
"""
Catalog Manifest Generator for Study-Material Web Portal
=========================================================
Scans all course subjects and generates web/public/catalog.json
with jsDelivr CDN preview links and GitHub direct download links.
Includes deep recursive scanning, intelligent title cleanup, and
granular sub-category tagging for Practice Material and Textbooks.
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
    "Practice_Material": "Practice Material",
    "Linear_Algebra_Done_Right": "Linear Algebra Done Right (4th Ed)",
    "Textbooks": "Textbooks & References",
    "Textbooks_and_References": "Textbooks & References",
    "MIT_OCW_18.06_Linear_Algebra": "MIT OCW 18.06",
    "Miami_MTH210_Linear_Algebra": "Miami MTH 210",
    "Abstract_Proof_Based_Linear_Algebra": "Proof-Based Problem Bank",
    "EPMTC301_Matching_Assignments": "EPMTC301 Mapped Assignments",
    "Unit_1_Linear_Algebra": "Unit 1 Practice Problems",
    "Unit_2_Matrix_Theory": "Unit 2 Practice Problems",
    "Unit_1": "Unit 1 Notes",
    "Unit_2": "Unit 2 Notes",
    "Unit_3": "Unit 3 Notes",
    "Unit_4": "Unit 4 Notes",
    "Unit_5": "Unit 5 Notes",
    "Assignments": "Assignments & Tutorials",
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


def clean_display_title(filename: str, rel_path: str = "") -> str:
    name = Path(filename).stem
    p_lower = rel_path.lower()

    # MIT OCW specific titles
    if "mit_ocw" in p_lower:
        name_clean = name.upper()
        if "EXAM1_S10_SOL" in name_clean or "EXAM1 S10 SOL" in name_clean:
            return "Exam 1 Solutions (Spring 2010)"
        elif "EXAM1_S10" in name_clean or "EXAM1 S10" in name_clean:
            return "Exam 1 (Spring 2010)"
        elif "EXAM2_S10_SOL" in name_clean or "EXAM2 S10 SOL" in name_clean:
            return "Exam 2 Solutions (Spring 2010)"
        elif "EXAM2_S10" in name_clean or "EXAM2 S10" in name_clean:
            return "Exam 2 (Spring 2010)"
        elif "EXAM3_S10_SOL" in name_clean or "EXAM3 S10 SOL" in name_clean:
            return "Exam 3 Solutions (Spring 2010)"
        elif "EXAM3_S10" in name_clean or "EXAM3 S10" in name_clean:
            return "Exam 3 (Spring 2010)"
        elif "FINAL_ANSWERS" in name_clean or "FINAL ANSWERS" in name_clean:
            return "Final Exam Solutions (Spring 2010)"
        elif "FINAL_EXAM" in name_clean or "FINAL EXAM" in name_clean:
            return "Final Exam (Spring 2010)"
        
        m_pset_sol = re.search(r"PSET(\d+)[_\s]+S10[_\s]+SOL", name_clean)
        if m_pset_sol:
            return f"Problem Set {m_pset_sol.group(1)} Solutions (Spring 2010)"
        m_pset = re.search(r"PSET(\d+)[_\s]+S10", name_clean)
        if m_pset:
            return f"Problem Set {m_pset.group(1)} (Spring 2010)"

    # Miami MTH210 titles
    if "miami_mth210" in p_lower or "mth210" in p_lower:
        m_hw = re.search(r"hw0?(\d+)", name.lower())
        if m_hw:
            return f"Homework {m_hw.group(1)} (Spring 2023)"
        if "midterm1_actual_exam_solutions" in name.lower():
            return "Midterm 1 Actual Exam Solutions"
        if "midterm2_actual_exam_solutions" in name.lower():
            return "Midterm 2 Actual Exam Solutions"
        if "practice_midterm1_solutions" in name.lower():
            return "Practice Midterm 1 Solutions"
        if "practice_midterm1" in name.lower():
            return "Practice Midterm 1"
        if "practice_midterm2_solutions" in name.lower():
            return "Practice Midterm 2 Solutions"
        if "practice_midterm2" in name.lower():
            return "Practice Midterm 2"
        if "practice_final_exam_solutions" in name.lower():
            return "Practice Final Exam Solutions"
        if "practice_final_exam" in name.lower():
            return "Practice Final Exam"

    # Linear Algebra Done Right titles
    if "linear_algebra_done_right" in p_lower:
        if "complete_solutions" in name.lower():
            return "Linear Algebra Done Right (4th Ed) — Complete Solutions Manual (Axler)"
        m_ch = re.search(r"Chapter[_\s]+(\d+)[_\s]+(.*)", name, re.IGNORECASE)
        if m_ch:
            ch_num = m_ch.group(1)
            ch_topic = m_ch.group(2).replace("_", " ").strip()
            return f"Chapter {ch_num}: {ch_topic} (LADR 4th Ed Solutions)"

    # General numbered prefixes cleanup: "01_Sheet1_...", "02_Miami_..."
    m_prefix = re.match(r"^\d{2}_(.*)$", name)
    if m_prefix:
        name = m_prefix.group(1)

    # Clean underscores and multiple dashes
    name = name.replace("_", " ").replace("-", " ")
    name = re.sub(r"\s+", " ", name).strip()
    return name


def extract_year(text: str) -> str:
    match = re.search(r"(?<!\d)(201[5-9]|202[0-9])(?!\d)", text)
    return match.group(1) if match else ""


def determine_sub_category(rel_path_parts: tuple, cat_name: str) -> str:
    """Returns a clean user-facing subcategory label."""
    if len(rel_path_parts) <= 2:
        return cat_name

    sub_parts = rel_path_parts[2:-1]  # intermediate folders
    sub_str = "/".join(sub_parts).lower()

    if "linear_algebra_done_right" in sub_str:
        return "Linear Algebra Done Right (4th Ed)"
    elif "mit_ocw" in sub_str:
        if "exam" in sub_str:
            return "MIT OCW 18.06 (Exams)"
        elif "problem_set" in sub_str:
            return "MIT OCW 18.06 (Problem Sets)"
        return "MIT OCW 18.06"
    elif "miami_mth210" in sub_str:
        if "exam" in sub_str:
            return "Miami MTH210 (Exams)"
        elif "homework" in sub_str:
            return "Miami MTH210 (Homeworks)"
        return "Miami MTH210 Archive"
    elif "abstract_proof" in sub_str:
        return "Abstract Proof Problem Bank"
    elif "epmtc301_matching" in sub_str:
        return "EPMTC301 Mapped Problem Sheets"
    elif "unit_1_linear_algebra" in sub_str:
        return "Unit 1 Practice Problems"
    elif "unit_2_matrix_theory" in sub_str:
        return "Unit 2 Practice Problems"
    elif "textbooks" in sub_str or cat_name in ["Textbooks", "Textbooks_and_References"]:
        return "Textbooks & References"
    elif "mid_semester" in sub_str or cat_name == "Mid_Semester":
        return "Mid-Semester PYQ"
    elif "end_semester" in sub_str or cat_name == "End_Semester":
        return "End-Semester PYQ"

    return rel_path_parts[2] if len(rel_path_parts) > 2 else cat_name


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
                dirs[:] = [d for d in dirs if not d.startswith(".")]
                
                for f_name in sorted(files):
                    if f_name.startswith(".") or f_name in ["README.md", "SYLLABUS.md", "packages.tex", "math_commands.tex"]:
                        continue
                    if f_name.endswith(".tex"):
                        continue

                    f_path = Path(root) / f_name
                    rel_path = f_path.relative_to(BASE_DIR).as_posix()
                    rel_parts = f_path.relative_to(BASE_DIR).parts
                    size_b = f_path.stat().st_size
                    ext = f_path.suffix.upper().replace(".", "") or "FILE"

                    # Check year
                    year = extract_year(f_name) or extract_year(f_path.parent.name) or extract_year(rel_path)

                    # Determine granular subcategory and display title
                    sub_category = determine_sub_category(rel_parts, cat_name)
                    display_title = clean_display_title(f_name, rel_path)

                    url_encoded_path = urllib.parse.quote(rel_path)
                    jsdelivr_url = f"https://cdn.jsdelivr.net/gh/{REPO_OWNER}/{REPO_NAME}@{BRANCH}/{url_encoded_path}"
                    raw_github_url = f"https://raw.githubusercontent.com/{REPO_OWNER}/{REPO_NAME}/{BRANCH}/{url_encoded_path}"

                    cat_label = CATEGORY_LABELS.get(cat_name, cat_name.replace("_", " "))

                    doc_entry = {
                        "id": f"{s_code}_{len(all_documents) + 1}",
                        "filename": f_name,
                        "title": display_title,
                        "subject_id": s_id,
                        "subject_name": s_name,
                        "subject_code": s_code,
                        "category": cat_name,
                        "category_label": cat_label,
                        "sub_category": sub_category,
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
