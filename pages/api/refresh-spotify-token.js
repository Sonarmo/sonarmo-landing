import { authAdmin, db } from "/lib/firebaseAdmin";
import cookie from "cookie";

export default async function handler(req, res) {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

    const cookies = cookie.parse(req.headers.cookie || "");
    const idToken = cookies.token;

    if (!idToken) {
        return res.status(401).json({ error: "Non authentifié" });
    }

    try {
        const decodedToken = await authAdmin.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const userDoc = await db.collection("users").doc(uid).get();
        const userData = userDoc.data();

        const refresh_token = userData?.spotifyRefreshToken;

        if (!refresh_token) {
            return res.status(400).json({ error: "Aucun refresh_token disponible" });
        }

        const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${basicAuth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ Erreur Spotify:", data);
            return res.status(500).json({ error: "Échec du rafraîchissement du token." });
        }

        const { access_token, expires_in } = data;

        // 🔄 Met à jour Firestore avec le nouveau token
        await db.collection("users").doc(uid).set({
            spotifyAccessToken: access_token,
            tokenExpiresAt: Date.now() + expires_in * 1000,
            updatedAt: new Date(),
        }, { merge: true });

        // ✅ Renvoie le token fraîchement obtenu directement
        return res.status(200).json({ access_token });

    } catch (err) {
        console.error("❌ Erreur serveur:", err);
        return res.status(500).json({ error: "Erreur serveur pendant le refresh token" });
    }
}
