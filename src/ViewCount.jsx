import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import { useState, useEffect, useRef } from "react";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function ViewCounter() {
  const [viewCount, setViewCount] = useState(0);
  const hasIncremented = useRef(false);

  useEffect(() => {
    const viewsRef = ref(db, "viewCount");

    if (!hasIncremented.current) {
      runTransaction(viewsRef, (current) => {
        return (current || 0) + 1;
      });
      hasIncremented.current = true;
    }

    const unsub = onValue(viewsRef, (snapshot) => {
      setViewCount(snapshot.val() || 0);
    });

    return () => unsub();
  }, []);

  if (viewCount <= 500) {
    return null;
  }

  return (
    <div className="bg-black/50 px-3 py-2 rounded-lg border border-white/20">
      <div className="text-white/90 text-sm font-medium">
        Views:{"  "}
        <span className="text-yellow-300 font-bold">
          {viewCount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
