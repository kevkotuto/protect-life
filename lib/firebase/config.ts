import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyC6HvlXQHI8giacf350k5h3ZHgENQuySuM",
  authDomain: "protect-life-4279a.firebaseapp.com",
  projectId: "protect-life-4279a",
  storageBucket: "protect-life-4279a.firebasestorage.app",
  messagingSenderId: "79724457523",
  appId: "1:79724457523:web:5ac8b5d3d751ca6eb2fd46",
  measurementId: "G-YFMQ8Z1247"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app; 