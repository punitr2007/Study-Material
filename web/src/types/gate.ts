export type GateQuestionType = 'MCQ' | 'MSQ' | 'NAT';

export interface GateQuestion {
  id: string;
  rawId: number;
  globalIndex: number;
  number: number;
  subjectOrder: number;
  subjectSlug: string;
  subjectName: string;
  topicSlug: string;
  topicTitle: string;
  type: GateQuestionType;
  marks: number;
  tagYear: string;
  tagTopic: string;
  text: string;
  options: string[];
  correct: number | null;
  correctAnswers: number[];
  ansMin: number | null;
  ansMax: number | null;
  solution: string;
}

export interface GateTopic {
  id: string;
  title: string;
  slug: string;
  subjectSlug: string;
  subjectName: string;
  questionCount: number;
  mcqCount: number;
  msqCount: number;
  natCount: number;
  pdfQuesUrl?: string;
  pdfAnsUrl?: string;
}

export interface GateSubject {
  order: number;
  name: string;
  slug: string;
  topicsCount: number;
  questionCount: number;
  topics: GateTopic[];
}

export interface GateHandbook {
  id: string;
  title: string;
  filename: string;
  url: string;
  category: string;
  description: string;
}

export interface GateCatalog {
  title: string;
  exam: string;
  branch: string;
  totalQuestions: number;
  totalSubjects: number;
  totalTopics: number;
  typeCounts: {
    MCQ: number;
    NAT: number;
    MSQ: number;
  };
  subjects: GateSubject[];
  handbooks?: GateHandbook[];
}

export interface GateDatabase extends GateCatalog {
  questions: GateQuestion[];
}

export type GateFilterType = 'ALL' | 'MCQ' | 'MSQ' | 'NAT';
export type GateQuizMode = 'practice' | 'exam';
