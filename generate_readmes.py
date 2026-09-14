#!/usr/bin/env python3
import os
from pathlib import Path
import urllib.parse

BASE_DIR = Path(__file__).resolve().parent

SUBJECT_TITLES = {
    "01_Signals_and_Systems_EAEPC302": "Signals and Systems (EAEPC302 / ECECC302)",
    "02_Probability_Theory_and_Random_Process_EAEPC303": "Probability Theory and Random Process (EAEPC303 / ECECC303)",
    "03_Microelectronics_Circuits_and_Applications_EAEPC304": "Microelectronics Circuits and Applications (EAEPC304 / ECECC304)",
    "04_Digital_Circuits_and_Systems_EAEPC305": "Digital Circuits and Systems (EAEPC305 / ECECC305)",
    "05_Mathematics_For_Machine_Learning_EPMTC301": "Mathematics for Machine Learning (EPMTC301)",
}

def generate_subject_readme(subj_dir: Path):
    subj_name = subj_dir.name
    title = SUBJECT_TITLES.get(subj_name, subj_name)
    
    subdirs = sorted([d for d in subj_dir.iterdir() if d.is_dir() and not d.name.startswith(".")])
    
    md = [f"# {title}\n"]
    md.append(f"Comprehensive course archive containing lecture notes, problem sets, textbooks, lab manuals, and previous year university examination papers.\n")
    md.append("## Table of Contents\n")
    for d in subdirs:
        folder_display = d.name.replace("_", " ")
        md.append(f"- [{folder_display}](#{d.name.lower().replace('_', '-')})")
    md.append("\n---\n")
    
    for d in subdirs:
        folder_display = d.name.replace("_", " ")
        md.append(f"## {folder_display}\n")
        
        # Check if subdir has nested folders (like downloaded_notes/Unit_1 or downloaded_pyqs/Mid_Semester)
        nested_dirs = sorted([nd for nd in d.iterdir() if nd.is_dir()])
        direct_files = sorted([f for f in d.iterdir() if f.is_file() and f.name != "README.md"])
        
        if direct_files:
            md.append("| File Name | Type | Size |")
            md.append("| :--- | :---: | :---: |")
            for f in direct_files:
                size_kb = f.stat().st_size / 1024
                size_str = f"{size_kb:.1f} KB" if size_kb < 1024 else f"{size_kb/1024:.2f} MB"
                rel_url = urllib.parse.quote(f"{d.name}/{f.name}")
                ext = f.suffix.upper().replace(".", "") or "FILE"
                md.append(f"| [{f.name}]({rel_url}) | `{ext}` | {size_str} |")
            md.append("")
            
        if nested_dirs:
            for nd in nested_dirs:
                nfiles = sorted([f for f in nd.iterdir() if f.is_file() and f.name != "README.md"])
                nd_display = nd.name.replace("_", " ")
                md.append(f"### {nd_display}\n")
                if nfiles:
                    md.append("| File Name | Type | Size |")
                    md.append("| :--- | :---: | :---: |")
                    for f in nfiles:
                        size_kb = f.stat().st_size / 1024
                        size_str = f"{size_kb:.1f} KB" if size_kb < 1024 else f"{size_kb/1024:.2f} MB"
                        rel_url = urllib.parse.quote(f"{d.name}/{nd.name}/{f.name}")
                        ext = f.suffix.upper().replace(".", "") or "FILE"
                        md.append(f"| [{f.name}]({rel_url}) | `{ext}` | {size_str} |")
                    md.append("")
                else:
                    md.append("_No files currently._\n")
                    
        md.append("---\n")
        
    readme_path = subj_dir / "README.md"
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write("\n".join(md))
    print(f"Generated: {readme_path}")

def generate_root_readme():
    subjects = sorted([d for d in BASE_DIR.iterdir() if d.is_dir() and d.name[:2].isdigit()])
    
    md = [
        "<div align=\"center\">",
        "",
        "# 📚 NSUT Study Material & Academic Repository",
        "",
        "### *Curated Course Resources, Unit Notes, Problem Sets & Automated PYQ Extraction Engine*",
        "",
        "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)",
        "[![Python: 3.9+](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)",
        "[![OCR: Tesseract](https://img.shields.io/badge/OCR-Tesseract_5-blue?style=for-the-badge&logo=google)](https://github.com/tesseract-ocr/tesseract)",
        "[![AutoSync](https://img.shields.io/badge/AutoSync-Active-brightgreen?style=for-the-badge)]()",
        "",
        "<p align=\"center\">",
        "  <b>A unified, intelligent academic archive for NSUT (ECAM / ECE / ICE / Allied Branches).</b><br>",
        "  Featuring automated Google Drive incremental synchronization, whole-semester multi-subject PDF OCR parsing & slicing, and systematic course categorization.",
        "</p>",
        "",
        "</div>",
        "",
        "---",
        "",
        "## 📖 Course Catalog & Master Index",
        "",
        "| # | Subject Code | Subject Name | Key Resources Available |",
        "| :-: | :--- | :--- | :--- |",
    ]
    
    for s in subjects:
        num = s.name[:2]
        title = SUBJECT_TITLES.get(s.name, s.name)
        code = s.name.split("_")[-1]
        name = " ".join(s.name.split("_")[1:-1])
        rel_path = urllib.parse.quote(s.name)
        
        subdirs = [d.name.replace("_", " ") for d in s.iterdir() if d.is_dir() and not d.name.startswith(".")]
        res_summary = ", ".join(subdirs)
        
        md.append(f"| {num} | `{code}` | [{name}]({rel_path}/README.md) | {res_summary} |")
        
    md.extend([
        "",
        "---",
        "",
        "## ⚡ Intelligent Google Drive AutoSync Engine",
        "",
        "This repository includes a smart, incremental synchronization pipeline capable of fetching and organizing past year question papers (PYQs) directly from Google Drive repositories without redundant downloads:",
        "",
        "```mermaid",
        "flowchart TD",
        "    A[\"Google Drive Repositories\"] --> B1[\"Folder 1: Single-Subject PYQs<br>(16Zbjd822kq9...)\"]",
        "    A --> B2[\"Folder 2: Whole-Semester Merged Bundles<br>(1DIM8iOiTn7B...)\"]",
        "    ",
        "    B1 --> C1[\"Incremental Metadata Filter<br>(subjects_config.json)\"]",
        "    C1 --> D1[\"Concurrent Downloader<br>(ThreadPoolExecutor)\"]",
        "    ",
        "    B2 --> C2[\"Bundle Ingestion & Local Cache\"]",
        "    C2 --> D2[\"Page-by-Page OCR & Subject Parser<br>(pdftotext + Tesseract OCR)\"]",
        "    D2 --> E2[\"Automated PDF Page Slicer<br>(pypdf / qpdf)\"]",
        "    ",
        "    D1 --> F[\"Subject Classifier & Directory Router<br>(Mid_Semester / End_Semester / Summer)\"]",
        "    E2 --> F",
        "    F --> G[\"Auto-Regenerate Subject Readmes & Master Index\"]",
        "```",
        "",
        "### 🚀 Quick Start / AutoSync Commands",
        "",
        "```bash",
        "# 1. Run incremental sync for all new papers & bundles",
        "./autosync.sh",
        "",
        "# 2. Dry-run preview (see what will be downloaded without writing files)",
        "./autosync.sh --dry-run",
        "",
        "# 3. Force re-sync and re-slice all resources",
        "./autosync.sh --force",
        "",
        "# 4. Background watch mode (polls Drive every 1 hour)",
        "./autosync.sh --watch 3600",
        "",
        "# 5. Rebuild documentation indexes only",
        "./autosync.sh --index-only",
        "```",
        "",
        "---",
        "",
        "## 📂 Uniform Directory Structure",
        "",
        "Every subject directory follows a standardized academic hierarchy:",
        "- `Assignments/` / `Assignments_and_Tutorials/`: Homework problem sets, tutorial sheets, and MIT problem set solutions.",
        "- `downloaded_notes/`: Unit-wise organized lecture notes (Units 1 to 5).",
        "- `downloaded_pyqs/`: University examination question papers categorized into `Mid_Semester/`, `End_Semester/`, and `Summer_Semester/`.",
        "- `Handwritten_Notes/`: Comprehensive batch topper handwritten lecture notes.",
        "- `Lecture_Slides/`: Professor presentation slides and lecture decks.",
        "- `Textbooks/`: Standard reference textbooks (Oppenheim, Morris Mano, Papoulis, Sedra & Smith, Razavi).",
        "- `Lab_Manuals_and_Experiments/`: Laboratory experiment manuals and simulation guidelines.",
        "",
        "---",
        "",
        "## 🔮 Future Scope & Roadmap: The Ultimate Semester Material Platform",
        "",
        "To elevate this repository into an autonomous academic management suite for all engineering semesters, the following roadmap is planned:",
        "",
        "### 1. 🤖 AI Multi-Modal Exam Search & Question Bank Extractor",
        "- **Automated Question-Level Splitting**: Use Vision LLMs (e.g. `Qwen2-VL`, `Gemini Flash API`) to dissect full question papers into individual question cards categorized by topic (`Unit 1: Laplace Transform`, `Unit 2: Fourier Series`).",
        "- **Instant Solution Matching**: AI-assisted mapping of past exam questions to corresponding textbook pages and lecture note slides.",
        "",
        "### 2. 🌐 Real-Time Web Portal & Interactive Student Dashboard",
        "- **React/Vite Academic Portal**: Web interface with instant full-text search across all PDF lecture notes, textbook chapters, and past papers.",
        "- **1-Click Zip Custom Bundler**: Allow students to pick specific subjects/units and download a single customized revision bundle before exams.",
        "",
        "### 3. ☁️ Cloud & Webhook Automation",
        "- **GitHub Actions Daily Sync**: Automated cron workflow to sync Google Drive nightly and commit new papers directly to GitHub with zero local intervention.",
        "- **Telegram / Discord Broadcast Bot**: Notify class channels whenever professors upload new unit notes or when new exam PYQs are archived.",
        "",
        "### 4. 📊 Syllabus Coverage & Exam Weightage Analytics",
        "- **Topic Frequency Analyzer**: Parse past 5 years of exam questions to calculate topic recurrence percentages and high-yield study topics.",
        "",
        "---",
        "",
        "## 🤝 Contributing",
        "",
        "Feel free to submit pull requests, open issues for missing course materials, or contribute additional subject notes!",
        "",
        "---",
        "",
        "## 📜 License",
        "",
        "Distributed under the **MIT License**. Maintained with ❤️ by [Punit Ranjan](https://github.com/punitr2007).",
    ])
    
    root_readme = BASE_DIR / "README.md"
    with open(root_readme, "w", encoding="utf-8") as f:
        f.write("\n".join(md))
    print(f"Generated: {root_readme}")

if __name__ == "__main__":
    subjects = sorted([d for d in BASE_DIR.iterdir() if d.is_dir() and d.name[:2].isdigit()])
    for s in subjects:
        generate_subject_readme(s)
    generate_root_readme()

