# 🎓 NSUT Academic Resource Hub & Notes Directory

> **Target Location**: `/home/punit/Local_Codebase/Projects/Extracted_Contents/notes`
> **Notes Source**: [NSUTMagnet](https://nsutmagnet.com/notes)
> **PYQ Archives**: StudyHub NSUT & NSUT Google Drive Archive (`16Zbjd822kq96vjIAKmoQr2xxGih0XoyE`)
> **OCR Classification**: Classified into `Mid_Semester/`, `End_Semester/`, and `Summer_Semester/` using Tesseract OCR & Poppler.

---

## 📑 Subject Catalog & Examination Inventory

| Code | Subject Name | Notes (NSUTMagnet) | Mid-Sem PYQs | End-Sem PYQs | Summer PYQs | Total Local PYQs | Local Folder |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **`EAEPC302`** | **Signals and Systems** | 5 Units (Drive) | **10** | **8** | **2** | **20 PDFs** | [`01_Signals_and_Systems_EAEPC302/`](./01_Signals_and_Systems_EAEPC302/README.md) |
| **`EAEPC303`** | **Probability Theory and Random Process (PTRP)** | 5 Units (Drive) | **12** | **15** | **4** | **31 PDFs** | [`02_Probability_Theory_and_Random_Process_EAEPC303/`](./02_Probability_Theory_and_Random_Process_EAEPC303/README.md) |
| **`EAEPC304`** | **Microelectronics Circuits and Applications (MCA)** | 5 Units (Drive) | **7** | **7** | **0** | **14 PDFs** | [`03_Microelectronics_Circuits_and_Applications_EAEPC304/`](./03_Microelectronics_Circuits_and_Applications_EAEPC304/README.md) |
| **`EAEPC305`** | **Digital Circuits and Systems (DCS)** | 5 Units (Drive) | **4** | **9** | **4** | **17 PDFs** | [`04_Digital_Circuits_and_Systems_EAEPC305/`](./04_Digital_Circuits_and_Systems_EAEPC305/README.md) |
| **`EPMTC301`** | **Mathematics For Machine Learning (MML)** | 5 Units (Drive) | **5** | **3** | **2** | **10 PDFs** | [`05_Mathematics_For_Machine_Learning_EPMTC301/`](./05_Mathematics_For_Machine_Learning_EPMTC301/README.md) |

---

## 📂 Directory Layout

```
Extracted_Contents/notes/
├── 01_Signals_and_Systems_EAEPC302/
│   ├── downloaded_pyqs/
│   │   ├── Mid_Semester/        # 10 Midsem Papers (2022-2026)
│   │   ├── End_Semester/        # 8 Endsem Papers
│   │   └── Summer_Semester/     # 2 Summer Papers
│   ├── notes_links.json         # NSUTMagnet Unit 1-5 Links
│   └── README.md
├── 02_Probability_Theory_and_Random_Process_EAEPC303/
│   ├── downloaded_pyqs/
│   │   ├── Mid_Semester/        # 12 Midsem Papers
│   │   ├── End_Semester/        # 15 Endsem Papers
│   │   └── Summer_Semester/     # 4 Summer Papers
│   ├── notes_links.json
│   └── README.md
├── 03_Microelectronics_Circuits_and_Applications_EAEPC304/
│   ├── downloaded_pyqs/
│   │   ├── Mid_Semester/        # 7 Midsem Papers
│   │   └── End_Semester/        # 7 Endsem Papers
│   ├── notes_links.json
│   └── README.md
├── 04_Digital_Circuits_and_Systems_EAEPC305/
│   ├── downloaded_pyqs/
│   │   ├── Mid_Semester/        # 4 Midsem Papers
│   │   ├── End_Semester/        # 9 Endsem Papers
│   │   └── Summer_Semester/     # 4 Summer Papers
│   ├── notes_links.json
│   └── README.md
├── 05_Mathematics_For_Machine_Learning_EPMTC301/
│   ├── downloaded_pyqs/
│   │   ├── Mid_Semester/        # 5 Midsem Papers
│   │   ├── End_Semester/        # 3 Endsem Papers
│   │   └── Summer_Semester/     # 2 Summer Papers
│   ├── notes_links.json
│   └── README.md
├── sort_pyqs_by_semester.py     # OCR & Poppler classifier script
├── download_all_resources.py    # Resource downloader
└── MASTER_INDEX.md
```

---

## 🛠️ Re-running OCR Sorting

If you add new PDFs to any `downloaded_pyqs/` folder, run:
```bash
python3 sort_pyqs_by_semester.py
```
It will automatically extract text/OCR on the first page, classify into `Mid_Semester/`, `End_Semester/`, or `Summer_Semester/`, and update the Markdown documentation.