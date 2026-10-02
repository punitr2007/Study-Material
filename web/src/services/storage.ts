import type { UserAcademicProgress, QuizWeekAttempt } from '../types/auth';
import { db, doc, runTransaction, isFirebaseConfigured } from './firebase';

export const LOCAL_STORAGE_KEY = 'nsut_hub_academic_progress_v1';
export const PROGRESS_EVENT_NAME = 'nsut_progress_updated';

/**
 * Creates default initial guest progress
 */
export function createDefaultProgress(uid = 'guest-user'): UserAcademicProgress {
  const now = new Date().toISOString();
  return {
    uid,
    email: null,
    displayName: 'Guest Student',
    photoURL: null,
    isAnonymous: true,
    createdAt: now,
    lastActive: now,
    version: 1,
    nptelProgress: {},
    flaggedQuestionIds: [],
    bookmarkedDocIds: [],
    notes: {}
  };
}

/**
 * Validates and sanitizes a quiz attempt to ensure scores cannot exceed total
 */
export function sanitizeQuizAttempt(attempt: Partial<QuizWeekAttempt>): QuizWeekAttempt | null {
  if (!attempt) return null;
  const week = typeof attempt.week === 'number' ? attempt.week : 1;
  const total = Math.max(1, typeof attempt.totalQuestions === 'number' ? attempt.totalQuestions : 10);
  let score = typeof attempt.highestScore === 'number' ? attempt.highestScore : 0;
  
  // Guard against spoofed/overflowed scores
  if (score < 0) score = 0;
  if (score > total) score = total;

  const percentage = Math.round((score / total) * 100);
  const attemptsCount = Math.max(1, typeof attempt.attemptsCount === 'number' ? attempt.attemptsCount : 1);
  const lastCompletedAt = attempt.lastCompletedAt || new Date().toISOString();
  const wrongQuestionIds = Array.isArray(attempt.wrongQuestionIds) ? attempt.wrongQuestionIds : [];

  return {
    week,
    highestScore: score,
    totalQuestions: total,
    percentage,
    attemptsCount,
    lastCompletedAt,
    wrongQuestionIds
  };
}

/**
 * Load local progress from browser localStorage
 */
export function loadLocalProgress(): UserAcademicProgress {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    const parsed = JSON.parse(raw);
    return {
      ...createDefaultProgress(),
      ...parsed,
      nptelProgress: parsed.nptelProgress || {},
      flaggedQuestionIds: Array.isArray(parsed.flaggedQuestionIds) ? parsed.flaggedQuestionIds : [],
      bookmarkedDocIds: Array.isArray(parsed.bookmarkedDocIds) ? parsed.bookmarkedDocIds : [],
      notes: parsed.notes || {}
    };
  } catch (err) {
    console.warn('[Storage] Failed to read localStorage, initializing default state:', err);
    return createDefaultProgress();
  }
}

/**
 * Save progress to browser localStorage and emit a change event
 */
export function saveLocalProgress(progress: UserAcademicProgress): void {
  try {
    const serialized = JSON.stringify(progress);
    localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(PROGRESS_EVENT_NAME, { detail: progress }));
    }
  } catch (err) {
    console.error('[Storage] Failed to save to localStorage:', err);
  }
}

/**
 * Pure Deterministic Merge:
 * Combines local (e.g. offline guest attempts) with cloud data without clobbering superior achievements.
 * 
 * Rules:
 * 1. Quizzes: MAX score rule. If scores match, keep most recent completedAt. Accumulate attempt counts.
 * 2. Flagged Questions: Set Union.
 * 3. Bookmarked Docs: Set Union.
 * 4. Notes: Key-by-key Last-Write-Wins (LWW) based on updatedAt timestamp.
 * 5. Sanity: Always enforce score <= totalQuestions.
 * 6. Version: Incremented monotonically for optimistic concurrency control.
 */
export function mergeProgress(
  local: UserAcademicProgress,
  cloud: UserAcademicProgress
): UserAcademicProgress {
  const merged: UserAcademicProgress = {
    ...cloud,
    lastActive: new Date().toISOString(),
    version: Math.max(local.version || 0, cloud.version || 0) + 1,
    nptelProgress: { ...(cloud.nptelProgress || {}) },
    flaggedQuestionIds: Array.from(new Set([
      ...(cloud.flaggedQuestionIds || []),
      ...(local.flaggedQuestionIds || [])
    ])),
    bookmarkedDocIds: Array.from(new Set([
      ...(cloud.bookmarkedDocIds || []),
      ...(local.bookmarkedDocIds || [])
    ])),
    notes: { ...(cloud.notes || {}) }
  };

  // 1. Quizzes: Merge each week
  const allWeekKeys = Array.from(new Set([
    ...Object.keys(local.nptelProgress || {}),
    ...Object.keys(cloud.nptelProgress || {})
  ]));

  allWeekKeys.forEach((weekKey) => {
    const rawLocal = local.nptelProgress?.[weekKey];
    const rawCloud = cloud.nptelProgress?.[weekKey];

    const localAttempt = rawLocal ? sanitizeQuizAttempt(rawLocal) : null;
    const cloudAttempt = rawCloud ? sanitizeQuizAttempt(rawCloud) : null;

    if (localAttempt && !cloudAttempt) {
      merged.nptelProgress[weekKey] = localAttempt;
    } else if (!localAttempt && cloudAttempt) {
      merged.nptelProgress[weekKey] = cloudAttempt;
    } else if (localAttempt && cloudAttempt) {
      // Both exist: pick highest score; if tied, pick most recent completion
      const totalAttempts = (localAttempt.attemptsCount || 1) + (cloudAttempt.attemptsCount || 1);

      if (localAttempt.highestScore > cloudAttempt.highestScore) {
        merged.nptelProgress[weekKey] = {
          ...localAttempt,
          attemptsCount: totalAttempts
        };
      } else if (cloudAttempt.highestScore > localAttempt.highestScore) {
        merged.nptelProgress[weekKey] = {
          ...cloudAttempt,
          attemptsCount: totalAttempts
        };
      } else {
        // Tied score -> pick most recent
        const isLocalNewer = new Date(localAttempt.lastCompletedAt).getTime() >= new Date(cloudAttempt.lastCompletedAt).getTime();
        const base = isLocalNewer ? localAttempt : cloudAttempt;
        merged.nptelProgress[weekKey] = {
          ...base,
          attemptsCount: totalAttempts
        };
      }
    }
  });

  // 2. Notes: Last-Write-Wins (LWW) per note key
  const allNoteKeys = Array.from(new Set([
    ...Object.keys(local.notes || {}),
    ...Object.keys(cloud.notes || {})
  ]));

  allNoteKeys.forEach((noteKey) => {
    const localNote = local.notes?.[noteKey];
    const cloudNote = cloud.notes?.[noteKey];

    if (localNote && !cloudNote) {
      merged.notes[noteKey] = localNote;
    } else if (!localNote && cloudNote) {
      merged.notes[noteKey] = cloudNote;
    } else if (localNote && cloudNote) {
      const isLocalNewer = new Date(localNote.updatedAt).getTime() > new Date(cloudNote.updatedAt).getTime();
      merged.notes[noteKey] = isLocalNewer ? localNote : cloudNote;
    }
  });

  return merged;
}

/**
 * Atomic Firestore Transaction Sync:
 * Executes read-merge-write inside runTransaction to eliminate race conditions
 * when the same user logs in on multiple devices concurrently.
 */
export async function atomicSyncWithCloud(
  uid: string,
  localProgress: UserAcademicProgress
): Promise<UserAcademicProgress> {
  if (isFirebaseConfigured && db) {
    const userDocRef = doc(db, 'users', uid);

    const canonicalProgress = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(userDocRef);
      if (!snapshot.exists()) {
        // New user document in cloud
        const initialCloudDoc: UserAcademicProgress = {
          ...localProgress,
          uid,
          version: 1,
          lastActive: new Date().toISOString()
        };
        transaction.set(userDocRef, initialCloudDoc);
        return initialCloudDoc;
      }

      // Existing cloud document: perform atomic deterministic merge
      const cloudData = snapshot.data() as UserAcademicProgress;
      const mergedCanonical = mergeProgress(localProgress, cloudData);
      transaction.set(userDocRef, mergedCanonical);
      return mergedCanonical;
    });

    // Mirror canonical state into localStorage
    saveLocalProgress(canonicalProgress);
    return canonicalProgress;
  }

  // Graceful fallback for offline / mock mode: increment local version
  const updatedLocal = {
    ...localProgress,
    uid,
    version: (localProgress.version || 0) + 1,
    lastActive: new Date().toISOString()
  };
  saveLocalProgress(updatedLocal);
  return updatedLocal;
}

/**
 * Record a quiz attempt into user progress
 */
export function recordQuizAttempt(
  current: UserAcademicProgress,
  week: number,
  score: number,
  total: number,
  wrongQuestionIds: string[] = []
): UserAcademicProgress {
  const weekKey = `week_${week}`;
  const existing = current.nptelProgress[weekKey];
  const now = new Date().toISOString();

  // Enforce score sanity
  const sanitizedScore = Math.min(Math.max(0, score), total);
  const percentage = Math.round((sanitizedScore / total) * 100);

  const updatedAttempt: QuizWeekAttempt = {
    week,
    highestScore: existing ? Math.max(existing.highestScore, sanitizedScore) : sanitizedScore,
    totalQuestions: total,
    percentage: existing
      ? Math.max(existing.percentage, percentage)
      : percentage,
    attemptsCount: (existing?.attemptsCount || 0) + 1,
    lastCompletedAt: now,
    wrongQuestionIds: sanitizedScore >= (existing?.highestScore || 0)
      ? wrongQuestionIds
      : (existing?.wrongQuestionIds || wrongQuestionIds)
  };

  const updated: UserAcademicProgress = {
    ...current,
    lastActive: now,
    version: (current.version || 0) + 1,
    nptelProgress: {
      ...current.nptelProgress,
      [weekKey]: updatedAttempt
    }
  };

  saveLocalProgress(updated);
  return updated;
}

/**
 * Toggle question flag
 */
export function toggleFlaggedQuestion(
  current: UserAcademicProgress,
  questionId: string
): UserAcademicProgress {
  const flags = new Set(current.flaggedQuestionIds || []);
  if (flags.has(questionId)) {
    flags.delete(questionId);
  } else {
    flags.add(questionId);
  }

  const updated: UserAcademicProgress = {
    ...current,
    lastActive: new Date().toISOString(),
    flaggedQuestionIds: Array.from(flags)
  };
  saveLocalProgress(updated);
  return updated;
}

/**
 * Toggle document bookmark
 */
export function toggleBookmarkedDocument(
  current: UserAcademicProgress,
  docId: string
): UserAcademicProgress {
  const bookmarks = new Set(current.bookmarkedDocIds || []);
  if (bookmarks.has(docId)) {
    bookmarks.delete(docId);
  } else {
    bookmarks.add(docId);
  }

  const updated: UserAcademicProgress = {
    ...current,
    lastActive: new Date().toISOString(),
    bookmarkedDocIds: Array.from(bookmarks)
  };
  saveLocalProgress(updated);
  return updated;
}

/**
 * Reset local progress and purge cached credentials
 */
export function clearAllLocalProgress(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    const fresh = createDefaultProgress();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(PROGRESS_EVENT_NAME, { detail: fresh }));
    }
  } catch (err) {
    console.error('[Storage] Error clearing local progress:', err);
  }
}
