#!/usr/bin/env python3
"""
Automated Downloader for NSUT Subject Notes & PYQs
Usage:
    python3 download_all_resources.py [--subject <SUBJECT_CODE>] [--pyqs-only] [--notes-only]
"""

import os
import re
import sys
import json
import argparse
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def check_dependencies():
    try:
        import requests
        import gdown
        return True
    except ImportError:
        print("[!] Installing required packages (gdown, requests)...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "gdown", "requests", "--quiet"])
            return True
        except Exception as e:
            print(f"[X] Package auto-install error: {e}")
            return False

def get_confirm_token(response):
    for key, value in response.cookies.items():
        if key.startswith('download_warning'):
            return value
    if 'confirm=' in response.text:
        match = re.search(r'confirm=([0-9A-Za-z_]+)', response.text)
        if match:
            return match.group(1)
    return None

def download_file_direct(drive_url_or_id, output_path):
    import requests
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    file_id = drive_url_or_id
    if "id=" in drive_url_or_id:
        file_id = drive_url_or_id.split("id=")[1].split("&")[0]
    elif "/d/" in drive_url_or_id:
        file_id = drive_url_or_id.split("/d/")[1].split("/")[0]

    url = "https://drive.google.com/uc?export=download"
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })

    params = {'id': file_id, 'confirm': 't'}
    try:
        response = session.get(url, params=params, stream=True, timeout=25)
        token = get_confirm_token(response)
        if token:
            params['confirm'] = token
            response = session.get(url, params=params, stream=True, timeout=25)

        if response.status_code != 200 or len(response.content) < 500:
            alt_url = f"https://drive.usercontent.google.com/download?id={file_id}&export=download&confirm=t"
            response = session.get(alt_url, stream=True, timeout=25)

        content = response.content
        if len(content) > 500 and (b'%PDF' in content[:1024] or b'PDF' in content[:1024]):
            with open(output_path, "wb") as f:
                f.write(content)
            print(f"[✓ SUCCESS] Downloaded {os.path.basename(output_path)} ({len(content)} bytes)")
            return True
        else:
            print(f"[!] Warning: Response not valid PDF for {os.path.basename(output_path)}")
            return False
    except Exception as e:
        print(f"[!] Download error for {os.path.basename(output_path)}: {e}")
        return False

def download_folder_gdown(drive_url, output_dir):
    import gdown
    os.makedirs(output_dir, exist_ok=True)
    print(f"[*] Downloading folder: {drive_url} -> {output_dir}")
    try:
        gdown.download_folder(drive_url, output=output_dir, quiet=False, use_cookies=False)
    except Exception as e:
        print(f"[!] Folder download error: {e}")

def main():
    parser = argparse.ArgumentParser(description="Download NSUT Notes and PYQs locally")
    parser.add_argument("--subject", type=str, help="Specific subject code (e.g. EAEPC302, EAEPC303, EAEPC304, EAEPC305, EPMTC301)")
    parser.add_argument("--pyqs-only", action="store_true", help="Download only PYQ question papers")
    parser.add_argument("--notes-only", action="store_true", help="Download only unit lecture notes")
    args = parser.parse_args()

    if not check_dependencies():
        return

    subdirs = [d for d in os.listdir(BASE_DIR) if os.path.isdir(os.path.join(BASE_DIR, d)) and not d.startswith(".")]
    subdirs.sort()

    for sub in subdirs:
        sub_path = os.path.join(BASE_DIR, sub)
        if args.subject and args.subject.lower() not in sub.lower():
            continue

        print(f"\n==========================================")
        print(f"Processing Subject: {sub}")
        print(f"==========================================")

        notes_file = os.path.join(sub_path, "notes_links.json")
        pyqs_file = os.path.join(sub_path, "pyqs_links.json")

        if not args.pyqs_only and os.path.exists(notes_file):
            with open(notes_file) as f:
                units = json.load(f)
            notes_dest = os.path.join(sub_path, "downloaded_notes")
            for idx, u in enumerate(units, 1):
                u_dir = os.path.join(notes_dest, f"Unit_{idx}")
                print(f"\n--- Downloading {u['unit']} ---")
                download_folder_gdown(u["drive_link"], u_dir)

        if not args.notes_only and os.path.exists(pyqs_file):
            with open(pyqs_file) as f:
                pyqs = json.load(f)
            pyqs_dest = os.path.join(sub_path, "downloaded_pyqs")
            for p in pyqs:
                safe_title = p["exam"].replace(" ", "_").replace("(", "").replace(")", "").replace("/", "_")
                p_file = os.path.join(pyqs_dest, f"{safe_title}.pdf")
                if not os.path.exists(p_file):
                    print(f"\n--- Downloading PYQ: {p['exam']} ({p['year']}) ---")
                    download_file_direct(p["link"], p_file)

    print("\n[✓] Download tasks completed!")

if __name__ == "__main__":
    main()
