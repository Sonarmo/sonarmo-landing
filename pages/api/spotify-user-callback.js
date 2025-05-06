import { db, authAdmin } from "@/lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";
import cookie from "cookie";

export default async function handler(req, res) {
    const code = req.query.code || null;

    if (!code) return res.status(400).send("❌ Code manquant.");

    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirect_uri = process.env.SPOTIFY_REDIRECT_URI_USER;

    const authHeader = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

    try {
        const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${authHeader}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri,
            }),
        });

        const data = await tokenRes.json();

        if (data.error) {
            console.error("❌ Spotify error:", data);
            return res.status(500).json({ error: data });
        }

        // 🔐 Récupère l'utilisateur Firebase via cookie (authToken)
        const cookies = cookie.parse(req.headers.cookie || "");
        const idToken = cookies.token || null;

        if (!idToken) {
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }

        const decodedToken = await getAuth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // ✅ Stocke le token dans Firestore
        await dbAdmin.collection("users").doc(uid).set(
            {
                spotifyAccessToken: data.access_token,
                updatedAt: new Date(),
            },
            { merge: true }
        );

        // Redirige vers dashboard proprement
        res.redirect("/dashboard/settings");
    } catch (err) {
        console.error("❌ Erreur réseau Spotify:", err);
        res.status(500).send("Erreur serveur.");
    }
}
