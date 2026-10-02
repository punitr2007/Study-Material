export interface QuizWeekAttempt {
  week: number;
  highestScore: number;
  totalQuestions: number;
  percentage: number;
  attemptsCount: number;
  lastCompletedAt: string;
  wrongQuestionIds: string[];
}

export interface UserNote {
  title: string;
  content: string;
  updatedAt: string;
}

export interface UserAcademicProgress {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  createdAt: string;
  lastActive: string;
  version: number; // for optimistic concurrency control

  // NPTEL Quiz attempts across all weeks
  nptelProgress: Record<string, QuizWeekAttempt>;

  // Question flags across both practice & exam modes
  flaggedQuestionIds: string[];

  // Saved PDF documents & solutions
  bookmarkedDocIds: string[];

  // Custom user notes keyed by subject or topic ID
  notes: Record<string, UserNote>;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

export type SyncState = 'idle' | 'syncing' | 'synced' | 'error';
