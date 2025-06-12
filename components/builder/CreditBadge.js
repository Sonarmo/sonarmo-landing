// components/CreditBadge.js
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "/lib/firebase";

export default function CreditBadge() {
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        return onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setCredits(docSnap.data().credits ?? 0);
          }
        });
      }
    });

    return () => unsubscribe?.();
  }, []);

  if (credits === null) return null;

  return (
    <div className="fixed top-6 right-6 bg-[#1c1c1c] text-white px-4 py-2 rounded-full shadow-lg border border-gray-700 z-50">
      🎧 Crédits restants : <span className="text-orange-400 font-semibold">{credits}</span>
    </div>
  );
}