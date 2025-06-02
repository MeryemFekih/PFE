import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database"; 
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // ✅ Import storage

const firebaseConfig = {
  apiKey: "AIzaSyBm03sG3SadkfPfQETb8kGHCGIL0S2i9Jw",
  authDomain: "pfe-project-f5f7b.firebaseapp.com",
  databaseURL: "https://pfe-project-f5f7b-default-rtdb.firebaseio.com",
  projectId: "pfe-project-f5f7b",
  storageBucket: "pfe-project-f5f7b.firebasestorage.app",
  messagingSenderId: "445560289586",
  appId: "1:445560289586:web:0a208f7a8f73273829bf2b",
  measurementId: "G-H2YEDWEXYQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Initialize storage

let analytics;

if (typeof window !== 'undefined') {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, storage, analytics };