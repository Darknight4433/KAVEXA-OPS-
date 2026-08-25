import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

export interface FirebaseConfigOptions {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

export const REAL_FIREBASE_CONFIG: FirebaseConfigOptions = {
  apiKey: "AIzaSyBWv-Vf_c9bmZRVUc-G_jrF60f3-SN-XdA",
  authDomain: "kavexa-ops.firebaseapp.com",
  projectId: "kavexa-ops",
  storageBucket: "kavexa-ops.firebasestorage.app",
  messagingSenderId: "196784445155",
  appId: "1:196784445155:web:772049e0fa578afc1a97d6",
  measurementId: "G-FNXK397L64"
};

let app: any = null;
let auth: any = null;
let db: any = null;
let analytics: any = null;
const googleProvider = new GoogleAuthProvider();

export function initFirebase(customConfig?: FirebaseConfigOptions) {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : {};
  const config = customConfig || {
    apiKey: metaEnv?.VITE_FIREBASE_API_KEY || REAL_FIREBASE_CONFIG.apiKey,
    authDomain: metaEnv?.VITE_FIREBASE_AUTH_DOMAIN || REAL_FIREBASE_CONFIG.authDomain,
    projectId: metaEnv?.VITE_FIREBASE_PROJECT_ID || REAL_FIREBASE_CONFIG.projectId,
    storageBucket: metaEnv?.VITE_FIREBASE_STORAGE_BUCKET || REAL_FIREBASE_CONFIG.storageBucket,
    messagingSenderId: metaEnv?.VITE_FIREBASE_MESSAGING_SENDER_ID || REAL_FIREBASE_CONFIG.messagingSenderId,
    appId: metaEnv?.VITE_FIREBASE_APP_ID || REAL_FIREBASE_CONFIG.appId,
    measurementId: metaEnv?.VITE_FIREBASE_MEASUREMENT_ID || REAL_FIREBASE_CONFIG.measurementId
  };

  try {
    if (!getApps().length) {
      app = initializeApp(config as any);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    db = getFirestore(app);

    if (typeof window !== 'undefined') {
      isSupported().then((supported: boolean) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      }).catch(() => {});
    }
  } catch (err) {
    console.warn("Firebase initialized with local synchronization fallback:", err);
  }

  return { app, auth, db, analytics };
}

// Auto-initialize with real credentials
initFirebase();

/**
 * Sign in using Google OAuth with Firebase Authentication
 */
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  if (!auth) initFirebase();
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Google Auth error:", error);
    // If popup was blocked or failed, attempt redirect
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectErr) {
        console.error("Google redirect sign-in error:", redirectErr);
      }
    }
    throw error;
  }
}

/**
 * Sign out the currently authenticated user
 */
export async function signOutUser(): Promise<void> {
  if (!auth) initFirebase();
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign out error:", error);
  }
}

/**
 * Subscribe to Firebase Auth state changes
 */
export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void) {
  if (!auth) initFirebase();
  return onAuthStateChanged(auth, callback);
}

export { app, auth, db, analytics, googleProvider };
