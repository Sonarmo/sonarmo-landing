import { db } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
  try {
    const testRef = db.collection("debug").doc("test");
    await testRef.set({ ok: true, time: new Date() });

    console.log("✅ Firestore fonctionne, document écrit.");
    return res.status(200).json({ message: "✅ Firestore fonctionne." });
  } catch (error) {
    console.error("❌ Erreur Firestore :", error);
    return res.status(500).json({ error: error.message });
  }
}