import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthUser, UserAcademicProgress, SyncState } from '../types/auth';
import {
  loadLocalProgress,
  recordQuizAttempt,
  toggleFlaggedQuestion,
  toggleBookmarkedDocument,
  atomicSyncWithCloud,
  clearAllLocalProgress,
  createDefaultProgress,
  PROGRESS_EVENT_NAME
} from '../services/storage';
import {
  signInWithGoogle,
  logoutUser,
  subscribeToAuthState
} from '../services/firebase';

interface AuthContextType {
  user: AuthUser | null;
  isGuest: boolean;
  progress: UserAcademicProgress;
  syncState: SyncState;
  lastSyncedAt: string | null;
  loginWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
  deleteAccountData: () => Promise<void>;
  saveQuizScore: (week: number, score: number, total: number, wrongIds?: string[]) => Promise<void>;
  toggleFlagQuestion: (questionId: string) => void;
  toggleBookmarkDoc: (docId: string) => void;
  triggerManualSync: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('nsut_hub_cached_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [progress, setProgress] = useState<UserAcademicProgress>(() => loadLocalProgress());
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() => {
    return localStorage.getItem('nsut_hub_last_synced_at');
  });

  const isGuest = !user;

  // Listen to external progress update events (e.g. from other tabs or quiz actions)
  useEffect(() => {
    const handleProgressEvent = (e: Event) => {
      const customEvent = e as CustomEvent<UserAcademicProgress>;
      if (customEvent.detail) {
        setProgress(customEvent.detail);
      }
    };

    window.addEventListener(PROGRESS_EVENT_NAME, handleProgressEvent);
    return () => window.removeEventListener(PROGRESS_EVENT_NAME, handleProgressEvent);
  }, []);

  // Listen to real-time Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isAnonymous: firebaseUser.isAnonymous
        };
        setUser(authUser);
        localStorage.setItem('nsut_hub_cached_auth_user', JSON.stringify(authUser));

        // Trigger atomic cloud sync on active session
        try {
          setSyncState('syncing');
          const currentLocal = loadLocalProgress();
          const syncedCanonical = await atomicSyncWithCloud(authUser.uid, currentLocal);
          setProgress(syncedCanonical);
          setSyncState('synced');
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastSyncedAt(nowStr);
          localStorage.setItem('nsut_hub_last_synced_at', nowStr);
        } catch (err) {
          console.error('[AuthContext] Atomic sync on auth change error:', err);
          setSyncState('error');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Login with Google and execute deterministic atomic merge
   */
  const loginWithGoogle = useCallback(async () => {
    try {
      setSyncState('syncing');
      const rawUser = await signInWithGoogle();
      const authUser: AuthUser = {
        uid: rawUser.uid,
        email: rawUser.email,
        displayName: rawUser.displayName,
        photoURL: rawUser.photoURL,
        isAnonymous: rawUser.isAnonymous
      };

      setUser(authUser);
      localStorage.setItem('nsut_hub_cached_auth_user', JSON.stringify(authUser));

      // Fetch local progress and merge atomically via Cloud Transaction
      const localCurrent = loadLocalProgress();
      const canonical = await atomicSyncWithCloud(authUser.uid, localCurrent);
      setProgress(canonical);
      setSyncState('synced');
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncedAt(nowStr);
      localStorage.setItem('nsut_hub_last_synced_at', nowStr);
    } catch (err) {
      console.error('[AuthContext] Google sign-in failed:', err);
      setSyncState('error');
      throw err;
    }
  }, []);

  /**
   * Explicit continue as Guest
   */
  const continueAsGuest = useCallback(() => {
    setUser(null);
    localStorage.removeItem('nsut_hub_cached_auth_user');
    setSyncState('idle');
  }, []);

  /**
   * Sign out current user
   */
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('[AuthContext] Logout exception:', e);
    }
    setUser(null);
    localStorage.removeItem('nsut_hub_cached_auth_user');
    setSyncState('idle');
  }, []);

  /**
   * Delete account and data (DPDP Act compliance)
   */
  const deleteAccountData = useCallback(async () => {
    try {
      if (user) {
        await logoutUser();
      }
    } catch (e) {
      console.warn('[AuthContext] Logout during deletion exception:', e);
    }
    clearAllLocalProgress();
    setUser(null);
    localStorage.removeItem('nsut_hub_cached_auth_user');
    localStorage.removeItem('nsut_hub_last_synced_at');
    setProgress(createDefaultProgress());
    setSyncState('idle');
    setLastSyncedAt(null);
  }, [user]);

  /**
   * Trigger manual sync
   */
  const triggerManualSync = useCallback(async () => {
    if (!user) {
      setSyncState('synced');
      setTimeout(() => setSyncState('idle'), 1500);
      return;
    }

    try {
      setSyncState('syncing');
      const current = loadLocalProgress();
      const synced = await atomicSyncWithCloud(user.uid, current);
      setProgress(synced);
      setSyncState('synced');
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncedAt(nowStr);
      localStorage.setItem('nsut_hub_last_synced_at', nowStr);
      setTimeout(() => setSyncState('idle'), 2500);
    } catch (err) {
      console.error('[AuthContext] Manual sync error:', err);
      setSyncState('error');
    }
  }, [user]);

  /**
   * Save quiz score with bounds check & optional cloud transaction
   */
  const saveQuizScore = useCallback(async (
    week: number,
    score: number,
    total: number,
    wrongIds: string[] = []
  ) => {
    const updated = recordQuizAttempt(progress, week, score, total, wrongIds);
    setProgress(updated);

    if (user) {
      try {
        setSyncState('syncing');
        const canonical = await atomicSyncWithCloud(user.uid, updated);
        setProgress(canonical);
        setSyncState('synced');
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSyncedAt(nowStr);
        localStorage.setItem('nsut_hub_last_synced_at', nowStr);
      } catch (err) {
        console.error('[AuthContext] Failed to background-sync quiz attempt:', err);
        setSyncState('error');
      }
    }
  }, [progress, user]);

  /**
   * Toggle question flag
   */
  const toggleFlagQuestion = useCallback((questionId: string) => {
    const updated = toggleFlaggedQuestion(progress, questionId);
    setProgress(updated);
    if (user) {
      atomicSyncWithCloud(user.uid, updated).catch(console.error);
    }
  }, [progress, user]);

  /**
   * Toggle document bookmark
   */
  const toggleBookmarkDoc = useCallback((docId: string) => {
    const updated = toggleBookmarkedDocument(progress, docId);
    setProgress(updated);
    if (user) {
      atomicSyncWithCloud(user.uid, updated).catch(console.error);
    }
  }, [progress, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        progress,
        syncState,
        lastSyncedAt,
        loginWithGoogle,
        continueAsGuest,
        logout,
        deleteAccountData,
        saveQuizScore,
        toggleFlagQuestion,
        toggleBookmarkDoc,
        triggerManualSync
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
