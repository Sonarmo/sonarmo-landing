import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "/lib/firebase";

export default function CreditBadge() {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

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
  let bgColor = "";
  let title = "";

  if (abonnementActif) {
    message = "🎵 Générations illimitées";
    bgColor = "bg-green-700 border-green-500 hover:bg-green-600";
    title = "Abonnement actif : générations illimitées";
  } else if (credits === 0) {
    message = "Plus de crédits";
    bgColor = "bg-red-700 border-red-500 hover:bg-red-600";
    title = "Aucun crédit restant. Cliquez pour en acheter.";
  } else {
    message = `${credits} génération${credits > 1 ? "s" : ""} disponible${credits > 1 ? "s" : ""}`;
    bgColor = "bg-[#1c1c1c] border-gray-600 hover:border-white hover:bg-[#2a2a2a]";
    title = "Cliquez pour recharger votre compte";
  }

  return (
    <div
      onClick={() => router.push("/achat-credits")}
      className={`absolute top-4 right-4 z-20 text-white px-3 py-1 rounded-full text-sm cursor-pointer transition-colors duration-200 border ${bgColor}`}
      title={title}
    >
      {message}
    </div>
  );
}