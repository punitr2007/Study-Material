# 📱 NSUT Study Material — Mobile Operations & Cheatsheet

Welcome to your **Xiaomi Mi A2 (Android 10 / Rooted)** autonomous background node guide. You can view this file anytime inside **Xed-Editor** or browse the repository directly on your phone.

---

## 🚀 Quick Command Cheatsheet (Termux)

These custom aliases are pre-configured in your Termux Zsh shell:

| Command | Action Description |
| :--- | :--- |
| `sync` | Runs the full AutoSync daemon (`./phone_sync_daemon.sh`) to scan Drive, update catalogs, and push to GitHub. |
| `notes` | Navigates directly into the `~/Study-Material` repository workspace. |
| `logs` | Streams live background synchronization log output (`tail -f .automation_worker.log`). |
| `ll` | Modern file listing with Nerd Font icons, git status, and relative time (via `eza`). |
| `gs` | Runs `git status` with clean formatting. |
| `gl` | Runs `git pull --rebase origin main` to fetch host workstation updates. |
| `gp` | Runs `git push origin main` using your scoped Fine-Grained PAT. |
| `cls` / `c` | Clears the terminal screen. |

---

## ⚡ Architecture at a Glance

```
┌─────────────────────────────────┐
│     Google Drive / Uploads      │ (Scanned every 6 hours by Mi A2)
└───────────────┬─────────────────┘
                ▼
┌─────────────────────────────────┐
│   Xiaomi Mi A2 (Termux Node)    │
│  - phone_sync_daemon.sh         │ ➔ Compiles catalog.json & analytics.json
│  - Background Crond / Magisk    │ ➔ Auto-commits with Fine-Grained PAT
└───────────────┬─────────────────┘
                ▼
┌─────────────────────────────────┐
│   GitHub (punitr2007/repo)      │ (Origin Main Branch)
└───────────────┬─────────────────┘
                ▼
┌─────────────────────────────────┐
│       Vercel Edge Network       │ (Public Live Study Portal)
└─────────────────────────────────┘
```

> **Note on AI Solutions:** AI-grounded solutions (`generate_solutions.py`) run on your host RTX 3050 machine (Qwen 2.5 LLM) and are pulled to the phone via Git. The phone does **not** run LLM models to preserve RAM and battery.

---

## 🛠️ Common On-Device Workflows

### 1. Triggering an Immediate Cloud Sync & Deployment
If you just uploaded new papers or want to force a redeploy to Vercel:
```bash
sync
```
*Output: Pulls latest git changes, indexes all 5 subjects into `catalog.json`, compiles 5-year syllabus analytics, commits, and pushes to GitHub.*

---

### 2. Previewing the Web Portal Locally on Phone / WiFi
To view the live web portal directly on your phone's browser (`Chrome` / `Firefox`) before public deploy:
```bash
cd ~/Study-Material/web/dist
python3 -m http.server 8080
```
Then open `http://localhost:8080` in your phone browser!

---

### 3. Checking Background Worker Health
To verify that background daemons are running and protected from Android memory killers:
```bash
# Check if SSH and Cron are active:
ps -ef | grep -E "sshd|crond"

# Check OOM immunity score (-1000 = Unkillable):
cat /proc/$(pidof sshd)/oom_score_adj
```

---

### 4. Editing Code & Scripts with Xed-Editor
- Open **Xed-Editor** on your phone.
- Tap **Open Folder** → Select `/sdcard/Study-Material` or internal storage.
- You can edit Python scripts, markdown notes, syllabus configs (`subjects_config.json`), or view PDF catalogs with full syntax highlighting.

---

## 🔒 Security & Token Details

- **GitHub Auth:** Scoped Fine-Grained PAT (`MiA2-StudyMaterial-SyncWorker`)
- **Permissions:** Restricted strictly to `punitr2007/Study-Material` (Contents: Read/Write, Metadata: Read-Only).
- **Zero Open Inbound Ports:** The phone never serves public internet traffic; Vercel remains the only public edge CDN.
- **Boot Persistence:** Auto-starts on reboot via `/data/adb/service.d/study_material_worker.sh`.

---

*Maintained by Punit Ranjan • NSUT Academic Repository*
