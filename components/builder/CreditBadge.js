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
    <div className="absolute top-4 right-4 z-20 bg-[#1c1c1c] text-white px-3 py-1 rounded-full border border-gray-600 text-sm">
  {credits === 0 ? "Plus de crédits" : `${credits} génération${credits > 1 ? "s" : ""} disponible${credits > 1 ? "s" : ""}`}
</div>
  );
}