import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "/lib/firebase";

export default function CreditBadge() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        return onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        });
      }
    });

    return () => unsubscribe?.();
  }, []);

  if (!userData) return null;

  const { credits = 0, abonnementActif = false } = userData;

  let message = "";
  if (abonnementActif) {
    message = "🎵 Générations illimitées";
  } else if (credits === 0) {
    message = "Plus de crédits";
  } else {
    message = `${credits} génération${credits > 1 ? "s" : ""} disponible${credits > 1 ? "s" : ""}`;
  }

  return (
    <div className="absolute top-4 right-4 z-20 bg-[#1c1c1c] text-white px-3 py-1 rounded-full border border-gray-600 text-sm">
      {message}
    </div>
  );
}