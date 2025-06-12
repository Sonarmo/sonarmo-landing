import { db } from "/lib/firebaseAdmin";
import cookie from "cookie";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end("Méthode non autorisée");
    }

    try {
        const cookies = cookie.parse(req.headers.cookie || "");
        const idToken = cookies.token;

        if (!idToken) {
            return res.status(401).json({ error: "Non authentifié" });
        }

        // On stocke la playlist sélectionnée dans Firestore
        const { uri } = req.body;
        const decodedToken = await (await import("/lib/firebaseAdmin")).authAdmin.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        await db.collection("users").doc(uid).set(
            { selectedPlaylistUri: uri },
            { merge: true }
        );

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("❌ Erreur API launch-playlist:", error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}
