export interface QuizWeekMeta {
  week: number;
  title: string;
  lectures: string;
  description: string;
  topics: string[];
  questionCount: number;
  pdfUrl?: string;
}

export interface QuizQuestion {
  id: string;
  week: number;
  weekTitle: string;
  questionNumber: number;
  scenario: string;
  prompt: string;
  options: string[];
  correctAnswers: number[];
  isMultiple: boolean;
  explanation: string;
  lectureRef: string;
  tags?: string[];
}

export interface QuizDatabase {
  courseCode: string;
  courseTitle: string;
  instructor: string;
  totalQuestions: number;
  weeks: QuizWeekMeta[];
  questions: QuizQuestion[];
}

export type QuizMode = 'practice' | 'exam';

export interface QuizUserAnswer {
  questionId: string;
  selectedIndices: number[];
  isFlagged?: boolean;
}
