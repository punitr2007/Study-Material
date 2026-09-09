#!/usr/bin/env python3
import os
from pathlib import Path
import urllib.parse

BASE_DIR = Path("/home/punit/Local_Codebase/Projects/Extracted_Contents/notes")

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
        "# NSUT Semester 3 Study Material & Academic Repository",
        "",
        "Welcome to the central academic repository for **NSUT 3rd Semester (ECAM / ECE / ICE / Allied Branches)**.",
        "This repository houses unit-wise curated notes, verified textbook references, assignments with solutions, laboratory experiment manuals, lecture slides, and past year question papers categorized into Mid-Semester, End-Semester, and Summer-Semester terms.",
        "",
        "## Course Catalog & Index",
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
        "## Repository Structure Overview",
        "",
        "Each subject folder is structured into uniform categorized subdirectories:",
        "- `Assignments/` / `Assignments_and_Tutorials/`: Homework sets, MIT problem sets with full solutions, and tutorial sheets.",
        "- `downloaded_notes/`: Unit-wise organized lecture notes (Units 1 to 5).",
        "- `downloaded_pyqs/`: Past university examination question papers sorted into `Mid_Semester/`, `End_Semester/`, and `Summer_Semester/`.",
        "- `Handwritten_Notes/`: Batch topper and comprehensive handwritten notes.",
        "- `Lecture_Slides/` / `Lecture_Slides_Prof_Razavi/`: Official professor lecture presentations and slide decks.",
        "- `Textbooks/`: Standard reference books (Oppenheim, Morris Mano, Papoulis, Schaum's Outlines, Jayaram Bhasker).",
        "- `Lab_Manuals_and_Experiments/`: Laboratory manuals, practical experiment sheets, and guidelines.",
        "",
        "---",
        "*Maintained by Punit Ranjan.*",
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
