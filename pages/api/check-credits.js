// pages/api/check-credits.js
import { authAdmin, db } from "/lib/firebaseAdmin";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const idToken = cookies.token;

    if (!idToken) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    const decodedToken = await authAdmin.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const historySnapshot = await db
      .collection("promptHistory")
      .where("uid", "==", uid)
      .limit(1)
      .get();

    const hasUsedFreePrompt = !historySnapshot.empty;

    return res.status(200).json({ hasUsedFreePrompt });
  } catch (err) {
    console.error("Erreur check credits:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}