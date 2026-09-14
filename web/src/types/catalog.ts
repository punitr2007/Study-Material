export interface Subject {
  id: string;
  number: string;
  code: string;
  name: string;
  title: string;
  document_count: number;
}

export interface CatalogDocument {
  id: string;
  filename: string;
  title: string;
  subject_id: string;
  subject_name: string;
  subject_code: string;
  category: string;
  category_label: string;
  sub_category?: string | null;
  relative_path: string;
  size_bytes: number;
  size_formatted: string;
  file_type: string;
  year?: string;
  preview_url: string;
  download_url: string;
}

export interface CatalogData {
  repository: string;
  branch: string;
  generated_at: string;
  total_documents: number;
  total_subjects: number;
  subjects: Subject[];
  documents: CatalogDocument[];
}

export type CategoryFilter =
  | 'ALL'
  | 'Mid_Semester'
  | 'End_Semester'
  | 'Summer_Semester'
  | 'downloaded_notes'
  | 'Assignments'
  | 'Textbooks'
  | 'Lab_Manuals_and_Experiments'
  | 'Handwritten_Notes'
  | 'Lecture_Slides';
