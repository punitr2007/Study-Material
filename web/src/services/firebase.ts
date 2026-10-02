import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  runTransaction,
  type Firestore
} from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Environment variable config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.authDomain
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);

    // Initialize Firebase App Check if site key is configured (prevents API abuse & bot scraping)
    const appCheckKey = import.meta.env.VITE_FIREBASE_APP_CHECK_KEY;
    if (appCheckKey && typeof window !== 'undefined') {
      try {
        initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(appCheckKey),
          isTokenAutoRefreshEnabled: true
        });
        console.log('[Firebase] App Check activated.');
      } catch (err) {
        console.warn('[Firebase] App Check initialization skipped:', err);
      }
    }
  } catch (err) {
    console.error('[Firebase] Failed to initialize Firebase SDK:', err);
  }
}

export { auth, db };

/**
 * Sign in with Google using OAuth popup
 */
export async function signInWithGoogle(): Promise<User | { uid: string; email: string; displayName: string; photoURL: string; isAnonymous: boolean }> {
  if (isFirebaseConfigured && auth) {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    return result.user;
  }

  // Graceful offline/demo mock flow if Firebase project keys are not in environment
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        uid: 'demo-google-user-' + Math.floor(Math.random() * 10000),
        email: 'student.ece@nsut.ac.in',
        displayName: 'NSUT Student (Demo)',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        isAnonymous: false
      });
    }, 400);
  });
}

/**
 * Sign out current authenticated user
 */
export async function logoutUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
}

/**
 * Listen to auth state changes
 */
export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, callback);
  }
  return () => {};
}

export { doc, runTransaction };
