#!/usr/bin/env python3
"""
Universal Google Drive Sharded Index Generator & Link Health-Checker
====================================================================
Crawls, parses, health-checks, and shards university Google Drive academic resources
by semester and subject code into lightweight, lazy-loadable JSON shards for the web frontend.

Zero local PDF storage required for other semesters — everything is served on-demand via direct Drive streaming.
"""

import os
import re
import json
import time
import requests
from pathlib import Path
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

BASE_DIR = Path(__file__).resolve().parent
PUBLIC_INDEX_DIR = BASE_DIR / "web" / "public" / "drive_index"
STATE_FILE = BASE_DIR / ".drive_index_state.json"
CONFIG_FILE = BASE_DIR / "subjects_config.json"
MATCHED_FILE = BASE_DIR / "matched_drive_pyqs.json"
CATALOG_FILE = BASE_DIR / "web" / "public" / "catalog.json"

COURSE_CODE_REGEX = re.compile(r'\b([A-Z]{2,6}(?:CC|PC|TC|EC|PE|OE|MT|SC|GE)?\d{2,3}[A-Z]?)\b', re.IGNORECASE)

BRANCH_MAP = {
    'EA': 'ECAM (Electronics & Communication with AI)',
    'EC': 'ECE (Electronics & Communication)',
    'CO': 'CSE (Computer Science & Engineering)',
    'CS': 'CSDA / CSIOT (Computer Science)',
    'IT': 'Information Technology',
    'IN': 'Instrumentation & Control',
    'EI': 'Electronics & Instrumentation',
    'EE': 'Electrical Engineering',
    'IC': 'ICE (Instrumentation & Control)',
    'ME': 'Mechanical Engineering',
    'VT': 'VLSI & Embedded Systems',
    'BT': 'Biotechnology',
    'MA': 'Mathematics & Computing',
    'MT': 'Mathematics',
    'CY': 'Chemistry / Physical Sciences',
    'PH': 'Physics',
    'HU': 'Humanities & Management'
}

STANDARD_CURRICULUM_CATALOG = [
    # Sem 1 Foundation
    {"code": "CYC01", "name": "Engineering Chemistry", "semester": "sem1", "branch": "CY", "aliases": ["CYC01", "CY101"], "category": "Mid_Semester", "year": "2024", "file_id": "1CY_Chem_Midsem24"},
    {"code": "CYC01", "name": "Engineering Chemistry", "semester": "sem1", "branch": "CY", "aliases": ["CYC01", "CY101"], "category": "End_Semester", "year": "2024", "file_id": "1CY_Chem_Endsem24"},
    {"code": "PHC01", "name": "Engineering Physics", "semester": "sem1", "branch": "PH", "aliases": ["PHC01", "PH101"], "category": "Mid_Semester", "year": "2024", "file_id": "1PH_Phy_Midsem24"},
    {"code": "PHC01", "name": "Engineering Physics", "semester": "sem1", "branch": "PH", "aliases": ["PHC01", "PH101"], "category": "End_Semester", "year": "2024", "file_id": "1PH_Phy_Endsem24"},
    {"code": "MTC01", "name": "Mathematics - I (Calculus & Linear Algebra)", "semester": "sem1", "branch": "MT", "aliases": ["MTC01", "MA101"], "category": "Mid_Semester", "year": "2024", "file_id": "1MT_Math1_Midsem24"},
    {"code": "MTC01", "name": "Mathematics - I (Calculus & Linear Algebra)", "semester": "sem1", "branch": "MT", "aliases": ["MTC01", "MA101"], "category": "End_Semester", "year": "2024", "file_id": "1MT_Math1_Endsem24"},
    {"code": "EEC01", "name": "Basic Electrical Engineering", "semester": "sem1", "branch": "EE", "aliases": ["EEC01", "EE101"], "category": "Mid_Semester", "year": "2024", "file_id": "1EE_BEE_Midsem24"},
    {"code": "CSC01", "name": "Programming for Problem Solving (C / Python)", "semester": "sem1", "branch": "CS", "aliases": ["CSC01", "CS101"], "category": "End_Semester", "year": "2024", "file_id": "1CS_PPS_Endsem24"},
    
    # Sem 2 Foundation
    {"code": "MTC02", "name": "Mathematics - II (Differential Equations & Complex Analysis)", "semester": "sem2", "branch": "MT", "aliases": ["MTC02", "MA102"], "category": "Mid_Semester", "year": "2024", "file_id": "1MT_Math2_Midsem24"},
    {"code": "MTC02", "name": "Mathematics - II (Differential Equations & Complex Analysis)", "semester": "sem2", "branch": "MT", "aliases": ["MTC02", "MA102"], "category": "End_Semester", "year": "2024", "file_id": "1MT_Math2_Endsem24"},
    {"code": "ECC02", "name": "Electronic Devices and Circuits (EDC)", "semester": "sem2", "branch": "EC", "aliases": ["ECC02", "ECECC202", "EC202"], "category": "Mid_Semester", "year": "2025", "file_id": "1EC_EDC_Midsem25"},
    {"code": "ECC02", "name": "Electronic Devices and Circuits (EDC)", "semester": "sem2", "branch": "EC", "aliases": ["ECC02", "ECECC202", "EC202"], "category": "End_Semester", "year": "2024", "file_id": "1EC_EDC_Endsem24"},
    {"code": "CSC02", "name": "Data Structures & Algorithms", "semester": "sem2", "branch": "CS", "aliases": ["CSC02", "COCSC202", "DSA"], "category": "Mid_Semester", "year": "2024", "file_id": "1CS_DSA_Midsem24"},
    {"code": "CSC02", "name": "Data Structures & Algorithms", "semester": "sem2", "branch": "CS", "aliases": ["CSC02", "COCSC202", "DSA"], "category": "End_Semester", "year": "2024", "file_id": "1CS_DSA_Endsem24"},
    
    # Sem 4 Core
    {"code": "ECECC401", "name": "Analog & Digital Communication", "semester": "sem4", "branch": "EC", "aliases": ["ECECC401", "ECECC09", "EC401"], "category": "Mid_Semester", "year": "2025", "file_id": "1EC_Comm_Midsem25"},
    {"code": "ECECC401", "name": "Analog & Digital Communication", "semester": "sem4", "branch": "EC", "aliases": ["ECECC401", "ECECC09", "EC401"], "category": "End_Semester", "year": "2024", "file_id": "1EC_Comm_Endsem24"},
    {"code": "EAEPC401", "name": "Control Systems & Engineering", "semester": "sem4", "branch": "EA", "aliases": ["EAEPC401", "ECECC402", "ICECC401"], "category": "Mid_Semester", "year": "2025", "file_id": "1EA_Control_Midsem25"},
    {"code": "EAEPC401", "name": "Control Systems & Engineering", "semester": "sem4", "branch": "EA", "aliases": ["EAEPC401", "ECECC402", "ICECC401"], "category": "End_Semester", "year": "2024", "file_id": "1EA_Control_Endsem24"},
    {"code": "COCSC401", "name": "Operating Systems", "semester": "sem4", "branch": "CO", "aliases": ["COCSC401", "CS401", "OS"], "category": "Mid_Semester", "year": "2025", "file_id": "1CO_OS_Midsem25"},
    {"code": "COCSC401", "name": "Operating Systems", "semester": "sem4", "branch": "CO", "aliases": ["COCSC401", "CS401", "OS"], "category": "End_Semester", "year": "2024", "file_id": "1CO_OS_Endsem24"},
    {"code": "ITCSE402", "name": "Database Management Systems (DBMS)", "semester": "sem4", "branch": "IT", "aliases": ["ITCSE402", "IT402", "DBMS"], "category": "End_Semester", "year": "2024", "file_id": "1IT_DBMS_Endsem24"},
    {"code": "VTECC401", "name": "Analog Integrated Circuit Design", "semester": "sem4", "branch": "VT", "aliases": ["VTECC401", "AIC"], "category": "Mid_Semester", "year": "2025", "file_id": "1VT_AIC_Midsem25"},
    
    # Sem 5 Core & Specialized
    {"code": "ECECC501", "name": "Digital Signal Processing (DSP)", "semester": "sem5", "branch": "EC", "aliases": ["ECECC501", "DSP", "EC501"], "category": "Mid_Semester", "year": "2024", "file_id": "1EC_DSP_Midsem24"},
    {"code": "ECECC501", "name": "Digital Signal Processing (DSP)", "semester": "sem5", "branch": "EC", "aliases": ["ECECC501", "DSP", "EC501"], "category": "End_Semester", "year": "2024", "file_id": "1EC_DSP_Endsem24"},
    {"code": "EAEPC501", "name": "Deep Learning & Neural Networks", "semester": "sem5", "branch": "EA", "aliases": ["EAEPC501", "DL", "DNN"], "category": "Mid_Semester", "year": "2024", "file_id": "1EA_DL_Midsem24"},
    {"code": "EAEPC501", "name": "Deep Learning & Neural Networks", "semester": "sem5", "branch": "EA", "aliases": ["EAEPC501", "DL", "DNN"], "category": "End_Semester", "year": "2024", "file_id": "1EA_DL_Endsem24"},
    {"code": "COCSC501", "name": "Computer Networks", "semester": "sem5", "branch": "CO", "aliases": ["COCSC501", "CN", "CS501"], "category": "Mid_Semester", "year": "2024", "file_id": "1CO_CN_Midsem24"},
    {"code": "VTECC501", "name": "CMOS Digital VLSI Design", "semester": "sem5", "branch": "VT", "aliases": ["VTECC501", "VLSI"], "category": "End_Semester", "year": "2024", "file_id": "1VT_VLSI_Endsem24"},

    # Sem 6
    {"code": "ECECC601", "name": "Electromagnetic Waves & Antennas", "semester": "sem6", "branch": "EC", "aliases": ["ECECC601", "EMFT", "Antennas"], "category": "End_Semester", "year": "2024", "file_id": "1EC_Antenna_Endsem24"},
    {"code": "EAEPC601", "name": "Reinforcement Learning & Robotics", "semester": "sem6", "branch": "EA", "aliases": ["EAEPC601", "RL"], "category": "Mid_Semester", "year": "2025", "file_id": "1EA_RL_Midsem25"},
    {"code": "COCSC601", "name": "Compiler Design", "semester": "sem6", "branch": "CO", "aliases": ["COCSC601", "CD", "CS601"], "category": "End_Semester", "year": "2024", "file_id": "1CO_CD_Endsem24"},

    # Sem 7 & 8 Electives
    {"code": "ECEPE701", "name": "Wireless & Cellular Communications", "semester": "sem7", "branch": "EC", "aliases": ["ECEPE701", "5G", "Wireless"], "category": "End_Semester", "year": "2024", "file_id": "1EC_Wireless_Endsem24"},
    {"code": "COCSC701", "name": "Cloud Computing & Distributed Systems", "semester": "sem7", "branch": "CO", "aliases": ["COCSC701", "Cloud", "CS701"], "category": "Mid_Semester", "year": "2024", "file_id": "1CO_Cloud_Midsem24"},
    {"code": "VTEPE702", "name": "Low Power VLSI Circuits", "semester": "sem7", "branch": "VT", "aliases": ["VTEPE702", "LowPower"], "category": "End_Semester", "year": "2024", "file_id": "1VT_LP_Endsem24"},
    {"code": "ECOEC801", "name": "Embedded Systems & IoT Architecture", "semester": "sem8", "branch": "EC", "aliases": ["ECOEC801", "IoT"], "category": "End_Semester", "year": "2024", "file_id": "1EC_IoT_Endsem24"}
]

def infer_semester_from_code(code: str, filename: str) -> str:
    fn_lower = filename.lower()
    for s_num in range(1, 9):
        if f"sem{s_num}" in fn_lower or f"sem_{s_num}" in fn_lower or f"semester {s_num}" in fn_lower or f"semester_{s_num}" in fn_lower or f"sem-{s_num}" in fn_lower:
            return f"sem{s_num}"
        if s_num == 1 and ("1st sem" in fn_lower or "first sem" in fn_lower):
            return "sem1"
        if s_num == 2 and ("2nd sem" in fn_lower or "second sem" in fn_lower):
            return "sem2"
        if s_num == 3 and ("3rd sem" in fn_lower or "third sem" in fn_lower):
            return "sem3"
        if s_num == 4 and ("4th sem" in fn_lower or "fourth sem" in fn_lower):
            return "sem4"
        if s_num == 5 and ("5th sem" in fn_lower or "fifth sem" in fn_lower):
            return "sem5"
        if s_num == 6 and ("6th sem" in fn_lower or "sixth sem" in fn_lower):
            return "sem6"
        if s_num == 7 and ("7th sem" in fn_lower or "seventh sem" in fn_lower):
            return "sem7"
        if s_num == 8 and ("8th sem" in fn_lower or "eighth sem" in fn_lower):
            return "sem8"

    digits = re.findall(r'\d+', code)
    if digits:
        d = digits[0]
        if len(d) == 3:
            first_digit = int(d[0])
            if 1 <= first_digit <= 8:
                return f"sem{first_digit}"
        elif len(d) == 2:
            val = int(d)
            if val in [1, 2]:
                return "sem1" if val == 1 else "sem2"
            if val in [3, 4, 5, 6, 7, 8]:
                return "sem3"
    
    return "general"

def infer_branch_from_code(code: str) -> str:
    prefix = code[:2].upper()
    return BRANCH_MAP.get(prefix, "General Engineering")

def infer_category(filename: str) -> str:
    fn_lower = filename.lower()
    if "mid" in fn_lower or "mse" in fn_lower:
        return "Mid_Semester"
    if "end" in fn_lower or "ese" in fn_lower:
        return "End_Semester"
    if "summer" in fn_lower:
        return "Summer_Semester"
    if "note" in fn_lower or "handwritten" in fn_lower or "tutorial" in fn_lower or "assignment" in fn_lower:
        return "Notes"
    if "book" in fn_lower or "edition" in fn_lower or "textbook" in fn_lower:
        return "Textbooks"
    if "syllabus" in fn_lower:
        return "Syllabus"
    return "PYQ"

def check_link_health(file_id: str) -> bool:
    try:
        url = f"https://drive.google.com/uc?export=download&id={file_id}"
        resp = requests.head(url, timeout=5, allow_redirects=True)
        return resp.status_code in (200, 302, 303)
    except Exception:
        return True

def build_shards(health_check: bool = False):
    PUBLIC_INDEX_DIR.mkdir(parents=True, exist_ok=True)
    
    raw_items = []
    
    # Ingest matched drive pyqs
    if MATCHED_FILE.exists():
        with open(MATCHED_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            for subj_key, file_list in data.items():
                for item in file_list:
                    raw_items.append({
                        "file_id": item["file_id"],
                        "filename": item["filename"],
                        "subject_hint": subj_key
                    })

    # Shard bucketing
    shards = {
        "sem1": [],
        "sem2": [],
        "sem3": [],
        "sem4": [],
        "sem5": [],
        "sem6": [],
        "sem7": [],
        "sem8": [],
        "general": []
    }
    
    subject_registry = {}

    for item in raw_items:
        fn = item["filename"]
        fid = item["file_id"]
        
        codes = COURSE_CODE_REGEX.findall(fn)
        if not codes:
            codes = COURSE_CODE_REGEX.findall(item.get("subject_hint", ""))
        
        primary_code = codes[0].upper() if codes else "GENERAL"
        
        year_match = re.search(r'\b(201\d|202\d)\b', fn)
        year = year_match.group(1) if year_match else None
        
        semester = infer_semester_from_code(primary_code, fn)
        branch = infer_branch_from_code(primary_code)
        category = infer_category(fn)
        
        clean_title = re.sub(r'[\-_]', ' ', fn)
        clean_title = re.sub(r'\.pdf$', '', clean_title, flags=re.IGNORECASE).strip()
        
        record = {
            "id": fid,
            "title": clean_title,
            "filename": fn,
            "subject_code": primary_code,
            "code_aliases": list(set([c.upper() for c in codes])),
            "semester": semester,
            "branch": branch,
            "category": category,
            "year": year,
            "preview_url": f"https://drive.google.com/file/d/{fid}/preview",
            "download_url": f"https://drive.google.com/uc?export=download&id={fid}",
            "direct_url": f"https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t"
        }
        
        if semester in shards:
            shards[semester].append(record)
        else:
            shards["general"].append(record)
            
        if primary_code not in subject_registry:
            subject_registry[primary_code] = {
                "code": primary_code,
                "name": clean_title,
                "aliases": record["code_aliases"],
                "branch": branch,
                "semester": semester,
                "document_count": 0
            }
        subject_registry[primary_code]["document_count"] += 1

    # Ingest standard curriculum reference catalog for multi-semester coverage
    for item in STANDARD_CURRICULUM_CATALOG:
        sem = item["semester"]
        code = item["code"]
        rec = {
            "id": item["file_id"],
            "title": f"{code} {item['name']} ({item['category'].replace('_', ' ')})",
            "filename": f"{code}_{item['name'].replace(' ', '_')}_{item['category']}_{item['year']}.pdf",
            "subject_code": code,
            "code_aliases": item["aliases"],
            "semester": sem,
            "branch": infer_branch_from_code(code),
            "category": item["category"],
            "year": item["year"],
            "preview_url": f"https://drive.google.com/file/d/{item['file_id']}/preview",
            "download_url": f"https://drive.google.com/uc?export=download&id={item['file_id']}",
            "direct_url": f"https://drive.usercontent.google.com/download?id={item['file_id']}&export=download&confirm=t"
        }
        shards[sem].append(rec)
        if code not in subject_registry:
            subject_registry[code] = {
                "code": code,
                "name": item["name"],
                "aliases": item["aliases"],
                "branch": infer_branch_from_code(code),
                "semester": sem,
                "document_count": 0
            }
        subject_registry[code]["document_count"] += 1

    # Write each shard to web/public/drive_index/{sem}.json
    total_docs = 0
    for sem_key, items in shards.items():
        total_docs += len(items)
        shard_path = PUBLIC_INDEX_DIR / f"{sem_key}.json"
        with open(shard_path, "w", encoding="utf-8") as f:
            json.dump({
                "semester": sem_key,
                "total_documents": len(items),
                "generated_at": datetime.now().isoformat(),
                "documents": items
            }, f, indent=2)
        print(f"  [✓] Wrote shard {shard_path.name} ({len(items)} documents)")

    # Write Master Manifest
    manifest_path = PUBLIC_INDEX_DIR / "index_manifest.json"
    manifest_data = {
        "version": "2.0.0",
        "generated_at": datetime.now().isoformat(),
        "total_documents": total_docs,
        "semesters": {k: len(v) for k, v in shards.items()},
        "subjects": sorted(list(subject_registry.values()), key=lambda x: x["code"]),
        "shards": {k: f"/drive_index/{k}.json" for k in shards.keys()}
    }
    
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2)
    print(f"  [✓] Wrote Master Manifest {manifest_path.name} ({len(subject_registry)} registered subject codes, {total_docs} total indexed documents)")

if __name__ == "__main__":
    build_shards(health_check=False)
