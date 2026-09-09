#!/usr/bin/env python3
import os
import re
import json
import time
import requests
from concurrent.futures import ThreadPoolExecutor

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_confirm_token(response):
    for key, value in response.cookies.items():
        if key.startswith('download_warning'):
            return value
    if 'confirm=' in response.text:
        match = re.search(r'confirm=([0-9A-Za-z_]+)', response.text)
        if match:
            return match.group(1)
    return None

def download_file_from_google_drive(file_id, destination):
    url = "https://drive.google.com/uc?export=download"
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })

    params = {'id': file_id, 'confirm': 't'}
    try:
        response = session.get(url, params=params, stream=True, timeout=20)
        token = get_confirm_token(response)

        if token:
            params['confirm'] = token
            response = session.get(url, params=params, stream=True, timeout=20)

        # Fallback to direct uc download endpoint
        if response.status_code != 200 or not response.content.startswith(b'%PDF'):
            alt_url = f"https://drive.usercontent.google.com/download?id={file_id}&export=download&confirm=t"
            response = session.get(alt_url, stream=True, timeout=20)

        content = response.content
        if len(content) > 500 and (b'%PDF' in content[:1024] or b'PDF' in content[:1024]):
            os.makedirs(os.path.dirname(destination), exist_ok=True)
            with open(destination, "wb") as f:
                f.write(content)
            return True, len(content)
        else:
            return False, f"Invalid PDF response (size: {len(content)} bytes)"
    except Exception as e:
        return False, str(e)

def main():
    matched_file = os.path.join(BASE_DIR, 'matched_drive_pyqs.json')
    if not os.path.exists(matched_file):
        print(f"[X] Matched file not found: {matched_file}")
        return

    with open(matched_file) as f:
        data = json.load(f)

    excluded_keywords = [
        'Digital_Signal_Processing',
        'Digital_Forensics',
        'Digital-Image-Processing',
        'Digital-Communication'
    ]

    total_tasks = []

    for sub_key, items in data.items():
        sub_dir = os.path.join(BASE_DIR, sub_key, 'downloaded_pyqs')
        os.makedirs(sub_dir, exist_ok=True)

        for it in items:
            file_id = it['file_id']
            filename = it['filename']

            if any(ex in filename for ex in excluded_keywords):
                continue

            clean_fn = filename.replace(' ', '_').replace(',', '_').replace('(', '').replace(')', '')
            if not clean_fn.endswith('.pdf'):
                clean_fn += '.pdf'

            dest_path = os.path.join(sub_dir, clean_fn)
            total_tasks.append((sub_key, file_id, clean_fn, dest_path))

    print(f"[*] Starting download of {len(total_tasks)} question papers across 5 subjects...")

    success_count = 0
    skipped_count = 0
    failed_count = 0

    def process_task(task):
        sub_key, file_id, clean_fn, dest_path = task
        if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1000:
            return "skipped", sub_key, clean_fn, os.path.getsize(dest_path)

        success, info = download_file_from_google_drive(file_id, dest_path)
        if success:
            return "success", sub_key, clean_fn, info
        else:
            return "failed", sub_key, clean_fn, info

    with ThreadPoolExecutor(max_workers=6) as executor:
        results = list(executor.map(process_task, total_tasks))

    for status, sub_key, clean_fn, info in results:
        if status == "success":
            success_count += 1
            print(f"[✓ SUCCESS] [{sub_key}] {clean_fn} ({info} bytes)")
        elif status == "skipped":
            skipped_count += 1
            print(f"[• SKIPPED] [{sub_key}] {clean_fn} (Already present)")
        else:
            failed_count += 1
            print(f"[✗ FAILED]  [{sub_key}] {clean_fn} -> {info}")

    print("\n==========================================")
    print(f"Download Summary:")
    print(f"  - Successfully Downloaded: {success_count}")
    print(f"  - Already Present:        {skipped_count}")
    print(f"  - Failed / Rate-Limited:   {failed_count}")
    print(f"  - Total Processed:         {len(total_tasks)}")
    print("==========================================")

if __name__ == "__main__":
    main()
