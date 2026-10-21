export interface QuizWeekMeta {
  week: number;
  title: string;
  lectures: string;
  description: string;
  topics: string[];
  questionCount: number;
  pdfUrl?: string;
}

export interface QuizOptionBreakdown {
  option: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  week: number;
  weekTitle: string;
  questionNumber: number;
  questionType?: 'MSQ' | 'MCQ' | 'True/False';
  scenario: string;
  prompt: string;
  options: string[];
  correctAnswers: number[];
  isMultiple: boolean;
  explanation: string;
  lectureRef: string;
  rawLectureRef?: string;
  conceptualJustification?: string;
  optionBreakdown?: QuizOptionBreakdown[];
  tags?: string[];
  suggestedAnswers?: number[];
  suggestedExplanation?: string;
  disputeNotes?: string;
}

export interface QuizDatabase {
  courseCode: string;
  courseTitle: string;
  instructor: string;
  source?: string;
  totalQuestions: number;
  questionTypeCounts?: {
    MSQ: number;
    MCQ: number;
    TrueFalse: number;
  };
  weeks: QuizWeekMeta[];
  questions: QuizQuestion[];
}

export type QuizMode = 'practice' | 'exam';

export interface QuizUserAnswer {
  questionId: string;
  selectedIndices: number[];
  isFlagged?: boolean;
}
