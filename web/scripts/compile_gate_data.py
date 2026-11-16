import os
import json
import re

QUESTIONS_ROOT = '/home/punit/Local_Codebase/Projects/Ideas/questions'
WEB_PUBLIC = '/home/punit/Local_Codebase/Projects/Extracted_Contents/notes/web/public'
GATE_IMAGES_DIR = os.path.join(WEB_PUBLIC, 'gate_images')
GATE_BOOKLETS_DIR = os.path.join(WEB_PUBLIC, 'gate_booklets')
OUTPUT_BANK_JSON = os.path.join(WEB_PUBLIC, 'gate_ece_bank.json')
OUTPUT_CATALOG_JSON = os.path.join(WEB_PUBLIC, 'gate_ece_catalog.json')

os.makedirs(GATE_IMAGES_DIR, exist_ok=True)
os.makedirs(GATE_BOOKLETS_DIR, exist_ok=True)

# 43 MSQ Verified Correct Options Mapping
MSQ_CORRECT_MAP = {
    1422115: [0, 1],       # (differential_equations)
    1422116: [2],          # (operational_amplifiers)
    1422117: [1, 2],       # (boolean_algebra)
    1422118: [2],          # (logic_families)
    1422119: [0, 1],       # (digital_communication_systems)
    1422120: [0, 2],       # (uniform_plane_waves)
    1422135: [3],          # (complex_variables)
    1422136: [2, 3],       # (lti_systems)
    1422137: [0, 2],       # (basic_semiconductor_physics)
    1422138: [0, 2],       # (sequential_circuits)
    1422139: [0, 1, 2, 3], # (logic_gates)
    1422140: [0, 1],       # (time_response_analysis)
    1422141: [0],          # (random_signals_and_noise)
    1422142: [0, 2],       # (transmission_lines)
    1423120: [0, 1],       # (random_signals_and_noise)
    1423142: [0, 2],       # (transmission_lines)
    1423143: [0, 1, 3],    # (uniform_plane_waves)
    1423144: [1, 3],       # (transmission_lines)
    1424114: [0, 2],       # (z-transform)
    1424115: [1, 2],       # (probability_and_statistics)
    1424116: [0, 2],       # (pn_junction_diodes)
    1424142: [1, 3],       # (bjt_and_fet_basics)
    1424143: [0, 1],       # (state_space_analysis)
    1424144: [0, 3],       # (calculus)
    1424145: [1, 2],       # (linear_algebra)
    1424146: [0, 2],       # (sampling)
    1425115: [1, 2],       # (calculus)
    1425117: [2, 3],       # (z-transform)
    1425118: [0, 2],       # (analog_communication_systems)
    1425119: [0, 1, 2],    # (operational_amplifiers)
    1425120: [0, 3],       # (fet_and_mosfet_analysis)
    1425121: [1, 2],       # (basic_semiconductor_physics)
    1425142: [0, 1],       # (complex_variables)
    1425144: [1, 2],       # (information_theory_and_coding)
    1425145: [0, 1],       # (fourier_series)
    1425147: [0, 2],       # (diodes_applications)
    1426116: [1, 3],       # (linear_algebra)
    1426118: [0, 1],       # (basics_of_electromagnetics)
    1426119: [2, 3],       # (bjt_and_fet_basics)
    1426144: [0, 2],       # (basic_semiconductor_physics)
    1426146: [0, 1],       # (boolean_algebra)
    1426147: [0, 1, 2],    # (analog_communication_systems)
    1426148: [0, 2, 3]     # (basics_of_signals_and_systems)
}

HANDBOOKS = [
    {
        "id": "gate-formula-handbook",
        "title": "GATE ECE Complete High-Density Formula Handbook",
        "filename": "GATE_ECE_Complete_Formula_Handbook.md",
        "url": "/gate_handbooks/GATE_ECE_Complete_Formula_Handbook.md",
        "category": "Handbooks",
        "description": "Comprehensive markdown formula sheet covering all 9 technical subjects with key formulas, shortcuts, and theorems."
    },
    {
        "id": "calculus-cheat-sheet",
        "title": "Calculus Derivatives, Integrals & Series Reference",
        "filename": "Calculus_Cheat_Sheet_All.pdf",
        "url": "/gate_handbooks/Calculus_Cheat_Sheet_All.pdf",
        "category": "Mathematics",
        "description": "Full calculus cheatsheet: limits, differential calculus, multiple integrals, vector calculus, and Green's/Stokes' theorems."
    },
    {
        "id": "trig-cheat-sheet",
        "title": "Trigonometric Formulas & Identities Card",
        "filename": "Trigonometric_Formulas.pdf",
        "url": "/gate_handbooks/Trigonometric_Formulas.pdf",
        "category": "Mathematics",
        "description": "Quick reference for trigonometric transformations, angle identities, and hyperbolic trigonometric properties."
    },
    {
        "id": "fourier-cheat-sheet",
        "title": "Fourier Transforms & Continuous/Discrete Properties",
        "filename": "Fourier_Transforms_Cheat_Sheet.pdf",
        "url": "/gate_handbooks/Fourier_Transforms_Cheat_Sheet.pdf",
        "category": "Signals",
        "description": "CTFT, DTFT, DFT, and Z-transform pair tables, duality, convolution, Parseval's energy theorem, and frequency scaling."
    },
    {
        "id": "nyquist-guide",
        "title": "Nyquist Plots & Frequency Stability Guide",
        "filename": "Nyquist_Plots_Guide.pdf",
        "url": "/gate_handbooks/Nyquist_Plots_Guide.pdf",
        "category": "Control",
        "description": "Step-by-step encirclement analysis, mapping poles/zeros, gain margin, phase margin, and non-minimum phase systems."
    },
    {
        "id": "intel-8085-guide",
        "title": "Intel 8085 Microprocessor Instructions & Architecture",
        "filename": "Intel_8085_Microprocessor_Instructions_Detail.pdf",
        "url": "/gate_handbooks/Intel_8085_Microprocessor_Instructions_Detail.pdf",
        "category": "Microprocessors",
        "description": "Complete opcode table, addressing modes, T-states, machine cycles, flag register behavior, and interrupt vectors."
    }
]

def clean_html_and_images(text):
    if not text:
        return ""
    
    # Clean whitespace and strip stray newlines in tags
    text = re.sub(r'[\r\n]+', ' ', text)
    
    # Fix and normalize <img> tags
    def replace_img(match):
        raw_src = match.group(1).strip()
        cleaned_src = re.sub(r'\s+', '', raw_src)
        clean_name = re.sub(r'[^a-zA-Z0-9_\.]', '_', cleaned_src.lstrip('/'))
        stem, _ = os.path.splitext(clean_name)
        local_src = f"/gate_images/{stem}.png"
        remote_src = cleaned_src if cleaned_src.startswith('http') else f"https://practicepaper.in{cleaned_src}"
        return f'<div class="gate-img-wrapper"><img src="{local_src}" onerror="this.onerror=null; this.src=\'{remote_src}\';" alt="Circuit or Mathematical Diagram" class="gate-diagram-img" loading="lazy" /></div>'

    text = re.sub(r'<img[^>]+src=[\'"]([^\'"]+)[\'"][^>]*\/?>', replace_img, text, flags=re.IGNORECASE)
    
    # Clean redundant consecutive line breaks
    text = re.sub(r'(?:<br\s*\/?>\s*){3,}', '<br><br>', text)
    
    # Fix LaTeX unsupported macros in [latex] tags
    def clean_latex_block(match):
        code = match.group(1)
        code = re.sub(r'\\underleftrightarrow\{([^}]*)\}', r'\\longleftrightarrow', code)
        code = code.replace(r'\underleftrightarrow', r'\longleftrightarrow')
        code = re.sub(r'\\overleftrightarrow\{([^}]*)\}', r'\\longleftrightarrow', code)
        code = code.replace(r'\overleftrightarrow', r'\longleftrightarrow')
        code = re.sub(r'\\underrightarrow\{([^}]*)\}', r'\\longrightarrow', code)
        code = code.replace(r'\underrightarrow', r'\longrightarrow')
        code = re.sub(r'\\underleftarrow\{([^}]*)\}', r'\\longleftarrow', code)
        code = code.replace(r'\underleftarrow', r'\longleftarrow')
        code = re.sub(r'\\overrightarrow\{([^}]*)\}', r'\\longrightarrow', code)
        code = code.replace(r'\overrightarrow', r'\longrightarrow')
        code = re.sub(r'\\overleftarrow\{([^}]*)\}', r'\\longleftarrow', code)
        code = code.replace(r'\overleftarrow', r'\longleftarrow')
        code = code.replace(r'\oplus', r'\text{ ⊕ }')
        return f'[latex]{code}[/latex]'

    text = re.sub(r'\[latex\]([\s\S]*?)\[\/latex\]', clean_latex_block, text)
    
    return text.strip()

def main():
    print("Reading topics catalog...")
    with open(os.path.join(QUESTIONS_ROOT, 'topics_catalog.json')) as f:
        catalog = json.load(f)

    all_questions = []
    subjects_meta = []
    
    global_index = 0
    total_mcqs = 0
    total_msqs = 0
    total_nats = 0

    for s_idx, subj in enumerate(catalog, start=1):
        s_slug = subj['subject_slug']
        s_name = subj['subject']
        subj_dir = os.path.join(QUESTIONS_ROOT, s_slug)

        subject_topics = []
        subj_q_count = 0

        for t_idx, topic in enumerate(subj['topics'], start=1):
            t_title = topic['title']
            t_slug = topic['slug']
            clean_t_slug = t_slug.replace('-', '_')
            topic_dir = os.path.join(subj_dir, clean_t_slug)
            json_path = os.path.join(topic_dir, 'questions.json')

            if not os.path.exists(json_path):
                print(f"Warning: {json_path} does not exist!")
                continue

            with open(json_path, encoding='utf-8') as f:
                raw_qs = json.load(f)

            topic_mcqs = 0
            topic_msqs = 0
            topic_nats = 0

            # Check booklets
            pdf_ques_name = f"{clean_t_slug}_ques.pdf"
            pdf_ans_name = f"{clean_t_slug}_ans.pdf"
            pdf_ques_path = os.path.join(GATE_BOOKLETS_DIR, s_slug, pdf_ques_name)
            pdf_ans_path = os.path.join(GATE_BOOKLETS_DIR, s_slug, pdf_ans_name)

            pdf_ques_url = f"/gate_booklets/{s_slug}/{pdf_ques_name}" if os.path.exists(pdf_ques_path) else None
            pdf_ans_url = f"/gate_booklets/{s_slug}/{pdf_ans_name}" if os.path.exists(pdf_ans_path) else None

            for q in raw_qs:
                global_index += 1
                qid = q.get('id')
                qtype = q.get('type', 'MCQ')
                marks = q.get('marks', 1)
                num = q.get('number', len(all_questions) + 1)
                tag1 = q.get('tag1') or f"GATE EC {q.get('year', '')}".strip()
                tag2 = q.get('tag2') or s_name

                # Clean text and solution
                cleaned_text = clean_html_and_images(q.get('text', ''))
                cleaned_solution = clean_html_and_images(q.get('solution', ''))

                # Clean options
                raw_options = q.get('options') or []
                cleaned_options = [clean_html_and_images(opt) for opt in raw_options]

                # Correct answer logic
                correct = None
                correct_answers = []
                ans_min = None
                ans_max = None

                if qtype == 'MCQ':
                    topic_mcqs += 1
                    total_mcqs += 1
                    correct = q.get('correct')
                    if isinstance(correct, int) and 0 <= correct < len(cleaned_options):
                        correct_answers = [correct]
                elif qtype == 'MSQ':
                    topic_msqs += 1
                    total_msqs += 1
                    correct_answers = MSQ_CORRECT_MAP.get(qid, [0])
                elif qtype == 'NAT':
                    topic_nats += 1
                    total_nats += 1
                    ans_min = q.get('ansMin')
                    ans_max = q.get('ansMax')
                    if ans_min is not None:
                        try:
                            ans_min = float(ans_min)
                        except (ValueError, TypeError):
                            ans_min = None
                    if ans_max is not None:
                        try:
                            ans_max = float(ans_max)
                        except (ValueError, TypeError):
                            ans_max = None

                q_entry = {
                    "id": f"gate-{qid}",
                    "rawId": qid,
                    "globalIndex": global_index,
                    "number": num,
                    "subjectOrder": s_idx,
                    "subjectSlug": s_slug,
                    "subjectName": s_name,
                    "topicSlug": clean_t_slug,
                    "topicTitle": t_title,
                    "type": qtype,
                    "marks": marks,
                    "tagYear": tag1,
                    "tagTopic": tag2,
                    "text": cleaned_text,
                    "options": cleaned_options,
                    "correct": correct,
                    "correctAnswers": correct_answers,
                    "ansMin": ans_min,
                    "ansMax": ans_max,
                    "solution": cleaned_solution
                }

                all_questions.append(q_entry)

            t_count = len(raw_qs)
            subj_q_count += t_count
            subject_topics.append({
                "id": clean_t_slug,
                "title": t_title,
                "slug": clean_t_slug,
                "subjectSlug": s_slug,
                "subjectName": s_name,
                "questionCount": t_count,
                "mcqCount": topic_mcqs,
                "msqCount": topic_msqs,
                "natCount": topic_nats,
                "pdfQuesUrl": pdf_ques_url,
                "pdfAnsUrl": pdf_ans_url
            })

        subjects_meta.append({
            "order": s_idx,
            "name": s_name,
            "slug": s_slug,
            "topicsCount": len(subject_topics),
            "questionCount": subj_q_count,
            "topics": subject_topics
        })

    master_bank = {
        "title": "GATE EC (Electronics & Communication Engineering) Master PYQ Bank",
        "exam": "GATE EC",
        "branch": "Electronics & Communication Engineering",
        "totalQuestions": len(all_questions),
        "totalSubjects": len(subjects_meta),
        "totalTopics": sum(len(s['topics']) for s in subjects_meta),
        "typeCounts": {
            "MCQ": total_mcqs,
            "NAT": total_nats,
            "MSQ": total_msqs
        },
        "subjects": subjects_meta,
        "handbooks": HANDBOOKS,
        "questions": all_questions
    }

    catalog_manifest = {
        "title": "GATE EC Master Curriculum & PYQ Catalog",
        "exam": "GATE EC",
        "branch": "Electronics & Communication Engineering",
        "totalQuestions": len(all_questions),
        "totalSubjects": len(subjects_meta),
        "totalTopics": sum(len(s['topics']) for s in subjects_meta),
        "typeCounts": {
            "MCQ": total_mcqs,
            "NAT": total_nats,
            "MSQ": total_msqs
        },
        "subjects": subjects_meta,
        "handbooks": HANDBOOKS
    }

    print(f"Writing master bank to {OUTPUT_BANK_JSON} ({len(all_questions)} questions)...")
    with open(OUTPUT_BANK_JSON, 'w', encoding='utf-8') as f:
        json.dump(master_bank, f, ensure_ascii=False, indent=2)

    print(f"Writing catalog manifest to {OUTPUT_CATALOG_JSON}...")
    with open(OUTPUT_CATALOG_JSON, 'w', encoding='utf-8') as f:
        json.dump(catalog_manifest, f, ensure_ascii=False, indent=2)

    bank_size_mb = os.path.getsize(OUTPUT_BANK_JSON) / (1024 * 1024)
    cat_size_kb = os.path.getsize(OUTPUT_CATALOG_JSON) / 1024
    print(f"Done! Bank size: {bank_size_mb:.2f} MB, Catalog size: {cat_size_kb:.2f} KB")

if __name__ == '__main__':
    main()
