/**
 * Authentication Service
 * Wraps Firebase Auth for login, register, and logout.
 */
import { auth, isFirebaseConfigured } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

export const authService = {
  register: async (email, password) => {
    if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  login: async (email, password) => {
    if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  loginWithGoogle: async () => {
    if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  },

  logout: async () => {
    if (!isFirebaseConfigured()) return;
    await signOut(auth);
  },

  onAuthChange: (callback) => {
    if (!isFirebaseConfigured()) return () => {};
    return onAuthStateChanged(auth, callback);
  },

  getCurrentUser: () => {
    if (!isFirebaseConfigured()) return null;
    return auth.currentUser;
  }
};
