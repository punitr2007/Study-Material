export interface QuestionSolution {
  question_id: string;
  exam: string;
  exam_type: 'Mid_Semester' | 'End_Semester' | 'Summer_Semester';
  subject_code: string;
  unit: number;
  topic: string;
  question: string;
  marks: number;
  reference: string;
  solution_markdown: string;
  question_hash: string;
}

export interface SolutionsData {
  metadata: {
    version: string;
    last_updated: string;
    curator: string;
    disclaimer: string;
  };
  solutions: Record<string, QuestionSolution[]>;
}
