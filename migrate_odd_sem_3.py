#!/usr/bin/env python3
import os
import shutil
import glob
import subprocess
from pathlib import Path

SRC_DIR = Path("/home/punit/Documents/ODD_SEM_3")
DEST_ROOT = Path("/home/punit/Local_Codebase/Projects/Extracted_Contents/notes")

SUBJECTS = {
    "SS": DEST_ROOT / "01_Signals_and_Systems_EAEPC302",
    "PTRP": DEST_ROOT / "02_Probability_Theory_and_Random_Process_EAEPC303",
    "MCA": DEST_ROOT / "03_Microelectronics_Circuits_and_Applications_EAEPC304",
    "DCS": DEST_ROOT / "04_Digital_Circuits_and_Systems_EAEPC305",
    "MML": DEST_ROOT / "05_Mathematics_For_Machine_Learning_EPMTC301",
}

def copy_file(src, dst_dir, new_name=None):
    dst_dir.mkdir(parents=True, exist_ok=True)
    dst_name = new_name if new_name else src.name
    dst_path = dst_dir / dst_name
    print(f"Copying: {src.name} -> {dst_path.relative_to(DEST_ROOT)}")
    shutil.copy2(src, dst_path)

def migrate_ss():
    ss_dest = SUBJECTS["SS"]
    ss_src = SRC_DIR / "SS"
    if not ss_src.exists():
        return

    # Textbooks
    books_dir = ss_dest / "Textbooks"
    for b in ["Signals and Systems by Oppenheim.pdf", "schaums-signals-and-systems.pdf", "TARUN RAWAT- SnS.pdf"]:
        p = ss_src / b
        if p.exists():
            copy_file(p, books_dir)

    # Lecture slides
    slides_dir = ss_dest / "Lecture_Slides"
    if (ss_src / "S&Stotal.pdf").exists():
        copy_file(ss_src / "S&Stotal.pdf", slides_dir, "Signals_and_Systems_Full_Lecture_Slides_Prof_Manav_Bhatnagar.pdf")

    # Assignments
    assign_dir = ss_dest / "Assignments"
    if (ss_src / "Assignments").exists():
        for f in (ss_src / "Assignments").iterdir():
            if f.is_file():
                # Check if it's a paper misfiled in Assignments
                if "Mid Sem" in f.name:
                    copy_file(f, ss_dest / "downloaded_pyqs" / "Mid_Semester")
                else:
                    copy_file(f, assign_dir)

    for f in ss_src.glob("Assignment*"):
        if f.is_file():
            copy_file(f, assign_dir)

    # Handwritten / Topic Notes
    notes_dir = ss_dest / "Handwritten_Notes"
    if (ss_src / "Notes").exists():
        for f in (ss_src / "Notes").iterdir():
            if f.is_file():
                copy_file(f, notes_dir)

    # Papers
    if (ss_src / "Papers").exists():
        for f in (ss_src / "Papers").iterdir():
            if f.is_file():
                fname_lower = f.name.lower()
                if "mid" in fname_lower or "mse" in fname_lower or "sept" in fname_lower or "mis" in fname_lower:
                    copy_file(f, ss_dest / "downloaded_pyqs" / "Mid_Semester")
                elif "end" in fname_lower or "nov" in fname_lower or "dec" in fname_lower:
                    copy_file(f, ss_dest / "downloaded_pyqs" / "End_Semester")
                else:
                    copy_file(f, ss_dest / "downloaded_pyqs")

def migrate_mca():
    mca_dest = SUBJECTS["MCA"]
    razavi_src = SRC_DIR / "ANALOG ELECTRONICS (Prof. Razavi)"
    
    # Lecture slides
    slides_dir = mca_dest / "Lecture_Slides_Prof_Razavi"
    if razavi_src.exists():
        for f in razavi_src.iterdir():
            if f.is_file():
                copy_file(f, slides_dir)

    if (SRC_DIR / "Lecture18_Web.pdf").exists():
        copy_file(SRC_DIR / "Lecture18_Web.pdf", slides_dir, "Lecture18_MOSFET_Amplifiers.pdf")

    # Lab Manuals
    if (SRC_DIR / "Exps_MCA.pdf").exists():
        copy_file(SRC_DIR / "Exps_MCA.pdf", mca_dest / "Lab_Manuals_and_Experiments", "MCA_Lab_Experiments_Manual.pdf")

    # Assignments
    if (SRC_DIR / "Assignment_MCA.pdf").exists():
        copy_file(SRC_DIR / "Assignment_MCA.pdf", mca_dest / "Assignments", "MCA_Assignment.pdf")

def migrate_dcs():
    dcs_dest = SUBJECTS["DCS"]
    dcs_src = SRC_DIR / "DCS"
    if not dcs_src.exists():
        return

    # Books
    books_dir = dcs_dest / "Textbooks"
    if (dcs_src / "Books").exists():
        for f in (dcs_src / "Books").iterdir():
            if f.is_file():
                copy_file(f, books_dir)

    # Assignments
    assign_dir = dcs_dest / "Assignments"
    if (dcs_src / "Assignments").exists():
        for f in (dcs_src / "Assignments").iterdir():
            if f.is_file():
                copy_file(f, assign_dir)

    # Notes
    notes_dir = dcs_dest / "Handwritten_Notes"
    if (dcs_src / "Notes").exists():
        for f in (dcs_src / "Notes").iterdir():
            if f.is_file():
                copy_file(f, notes_dir)

    # Syllabus
    if (dcs_src / "syll1.pdf").exists():
        copy_file(dcs_src / "syll1.pdf", dcs_dest / "Syllabus", "DCS_Syllabus.pdf")

    # Papers
    if (dcs_src / "Papers").exists():
        for f in (dcs_src / "Papers").iterdir():
            if f.is_file():
                fname_lower = f.name.lower()
                if "mid" in fname_lower or "sept" in fname_lower:
                    copy_file(f, dcs_dest / "downloaded_pyqs" / "Mid_Semester")
                elif "end" in fname_lower or "nov" in fname_lower or "dec" in fname_lower:
                    copy_file(f, dcs_dest / "downloaded_pyqs" / "End_Semester")
                else:
                    copy_file(f, dcs_dest / "downloaded_pyqs")

def migrate_ptrp():
    ptrp_dest = SUBJECTS["PTRP"]
    # Papoulis textbook from document_compress.pdf
    doc_comp = SRC_DIR / "document_compress.pdf"
    if doc_comp.exists():
        copy_file(doc_comp, ptrp_dest / "Textbooks", "Probability_Random_Variables_and_Stochastic_Processes_Papoulis.pdf")

def migrate_mml():
    mml_dest = SUBJECTS["MML"]
    prob_sheet = SRC_DIR / "Linear_algebra_schaum_outlines_problemsheet2_ques.pdf"
    if prob_sheet.exists():
        copy_file(prob_sheet, mml_dest / "Assignments_and_Tutorials", "Linear_algebra_schaum_outlines_problemsheet2_ques.pdf")

if __name__ == "__main__":
    print("Starting migration of ODD_SEM_3 materials...")
    migrate_ss()
    migrate_ptrp()
    migrate_mca()
    migrate_dcs()
    migrate_mml()
    print("Migration complete!")
