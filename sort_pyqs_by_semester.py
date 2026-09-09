#!/usr/bin/env python3
"""
Intelligent PDF OCR & Classifier for NSUT PYQs
Categorizes question papers into:
  - Mid_Semester/
  - End_Semester/
  - Summer_Semester/
"""

import os
import re
import shutil
import subprocess
from pathlib import Path

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TESSDATA_DIR = os.path.join(BASE_DIR, "tessdata")

SUBJECT_DIRS = [
    "01_Signals_and_Systems_EAEPC302",
    "02_Probability_Theory_and_Random_Process_EAEPC303",
    "03_Microelectronics_Circuits_and_Applications_EAEPC304",
    "04_Digital_Circuits_and_Systems_EAEPC305",
    "05_Mathematics_For_Machine_Learning_EPMTC301"
]

def extract_text_from_pdf(pdf_path):
    """Extract digital text or fallback to Tesseract OCR on page 1."""
    # 1. Fast digital extraction
    try:
        res = subprocess.run(
            ["pdftotext", "-f", "1", "-l", "1", pdf_path, "-"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=10
        )
        text = res.stdout.strip()
        if len(text) > 40:
            return text, "pdftotext"
    except Exception:
        pass

    # 2. OCR fallback
    temp_prefix = f"ocr_tmp_{os.getpid()}"
    try:
        subprocess.run(
            ["pdftoppm", "-png", "-r", "150", "-f", "1", "-l", "1", pdf_path, temp_prefix],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=15
        )
        img_file = f"{temp_prefix}-1.png"
        if os.path.exists(img_file):
            cmd = ["tesseract", img_file, "stdout", "-l", "eng"]
            if os.path.exists(TESSDATA_DIR):
                cmd.extend(["--tessdata-dir", TESSDATA_DIR])

            ocr_res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=15)
            ocr_text = ocr_res.stdout.strip()
            os.remove(img_file)
            return ocr_text, "ocr"
    except Exception as e:
        print(f"[!] OCR Error on {pdf_path}: {e}")
    finally:
        for f in os.listdir("."):
            if f.startswith(temp_prefix):
                try:
                    os.remove(f)
                except Exception:
                    pass

    return "", "none"

def classify_paper(filename, text):
    """Determine exam type, year, and session from text & filename."""
    combined = (filename + " " + text).upper()

    # 1. Exam Type Detection
    exam_type = "End_Semester" # default

    if any(k in combined for k in ["MID SEM", "MID-SEM", "MIDTERM", "MID TERM", "MID-TERM", "MIDSEMESTER", "MINOR EXAM", "TEST-I", "TEST-II"]):
        exam_type = "Mid_Semester"
    elif any(k in combined for k in ["SUMMER", "SUPPLEMENTARY", "SPECIAL"]):
        exam_type = "Summer_Semester"
    elif any(k in combined for k in ["END SEM", "END-SEM", "ENDTERM", "END TERM", "END-TERM", "ENDSEMESTER", "MAJOR EXAM", "ANNUAL"]):
        exam_type = "End_Semester"
    else:
        # Check marks or duration clues
        if "MAX. MARKS: 20" in combined or "MAX. MARKS: 25" in combined or "MAX. MARKS: 30" in combined or "1.5 HOUR" in combined or "1.5 HR" in combined or "1 HOUR 30" in combined:
            exam_type = "Mid_Semester"
        elif "MAX. MARKS: 50" in combined or "MAX. MARKS: 60" in combined or "MAX. MARKS: 75" in combined or "MAX. MARKS: 100" in combined or "3 HOUR" in combined:
            exam_type = "End_Semester"

    # 2. Year Detection
    years = re.findall(r'\b(202[1-7])\b', combined)
    year = years[0] if years else ""
    if not year:
        year_match = re.search(r'(202[1-7])', filename)
        if year_match:
            year = year_match.group(1)

    # 3. Month / Session
    months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    session = ""
    for m in months:
        if m in combined:
            session = m
            break

    return exam_type, year, session

def process_subject(sub_dir):
    pyq_root = os.path.join(BASE_DIR, sub_dir, "downloaded_pyqs")
    if not os.path.exists(pyq_root):
        return

    # Find all PDFs directly in downloaded_pyqs (or in root of downloaded_pyqs)
    pdf_files = []
    for root, dirs, files in os.walk(pyq_root):
        for f in files:
            if f.lower().endswith(".pdf"):
                pdf_files.append(os.path.join(root, f))

    print(f"\n==========================================")
    print(f"Sorting PYQs for {sub_dir} ({len(pdf_files)} PDFs)")
    print(f"==========================================")

    records = {
        "Mid_Semester": [],
        "End_Semester": [],
        "Summer_Semester": []
    }

    for pdf_path in pdf_files:
        fn = os.path.basename(pdf_path)
        text, method = extract_text_from_pdf(pdf_path)
        exam_type, year, session = classify_paper(fn, text)

        dest_dir = os.path.join(pyq_root, exam_type)
        os.makedirs(dest_dir, exist_ok=True)
        dest_path = os.path.join(dest_dir, fn)

        if os.path.abspath(pdf_path) != os.path.abspath(dest_path):
            shutil.move(pdf_path, dest_path)

        rec = {
            "filename": fn,
            "exam_type": exam_type,
            "year": year,
            "session": session,
            "method": method,
            "path": os.path.relpath(dest_path, os.path.join(BASE_DIR, sub_dir))
        }
        records[exam_type].append(rec)
        print(f"  [{exam_type.replace('_', ' ')}] {fn} ({year} {session}) [via {method}]")

    # Clean up empty legacy folders inside downloaded_pyqs if any
    for root, dirs, files in list(os.walk(pyq_root, topdown=False)):
        if root != pyq_root and os.path.basename(root) not in ["Mid_Semester", "End_Semester", "Summer_Semester"]:
            if not os.listdir(root):
                os.rmdir(root)

    return records

def update_subject_documentation(sub_dir, records):
    s_path = os.path.join(BASE_DIR, sub_dir)
    readme_path = os.path.join(s_path, "README.md")
    if not os.path.exists(readme_path):
        return

    with open(readme_path, "r") as f:
        content = f.read()

    # Split before local table
    if "## 📂 Downloaded Question Papers" in content:
        content = content.split("## 📂 Downloaded Question Papers")[0]

    pyq_section = "\n---\n\n## 📂 Categorized Question Papers Archive (`downloaded_pyqs/`)\n\n"

    for category, title in [("Mid_Semester", "📝 Mid-Semester Examinations"),
                            ("End_Semester", "🎓 End-Semester Examinations"),
                            ("Summer_Semester", "☀️ Summer & Special Examinations")]:
        items = records.get(category, [])
        if not items:
            continue

        pyq_section += f"### {title} ({len(items)} Papers)\n\n"
        pyq_section += "| Year | Exam Paper PDF | Branch Codes & File |\n"
        pyq_section += "| :---: | :--- | :--- |\n"
        for it in sorted(items, key=lambda x: (x.get("year", "0"), x["filename"]), reverse=True):
            yr = it["year"] or "Archived"
            fn = it["filename"]
            rel_link = f"./downloaded_pyqs/{category}/{fn}"
            clean_title = fn.replace(".pdf", "").replace("_", " ")
            pyq_section += f"| **{yr}** | [`{fn}`]({rel_link}) | `{clean_title}` |\n"
        pyq_section += "\n"

    with open(readme_path, "w") as f:
        f.write(content.strip() + "\n" + pyq_section)

def main():
    all_stats = {}
    for sub in SUBJECT_DIRS:
        records = process_subject(sub)
        if records:
            update_subject_documentation(sub, records)
            all_stats[sub] = {k: len(v) for k, v in records.items()}

    print("\n==========================================")
    print("🎯 All Subjects Classified & Organized Successfully!")
    print("==========================================")
    for sub, counts in all_stats.items():
        print(f"• {sub}:")
        for k, v in counts.items():
            if v > 0:
                print(f"    - {k.replace('_', ' ')}: {v} PDFs")

if __name__ == "__main__":
    main()
