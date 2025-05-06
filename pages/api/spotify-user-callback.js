import { db, authAdmin } from "@/lib/firebaseAdmin";
import cookie from "cookie";

export default async function handler(req, res) {
    const code = req.query.code || null;

    if (!code) {
        console.error("❌ Code manquant dans la requête Spotify");
        return res.status(400).send("❌ Code manquant.");
    }

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
            console.error("❌ Erreur Spotify :", data);
            return res.status(500).json({ error: data });
        }

        // 🔍 Étape 2 : Vérifie le cookie
        const cookies = cookie.parse(req.headers.cookie || "");
        const idToken = cookies.token;

        if (!idToken) {
            console.error("❌ Cookie 'token' manquant ou invalide");
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }

        const decodedToken = await authAdmin.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        console.log("✅ Utilisateur Firebase identifié :", uid);

        // 🔧 Stocke dans Firestore
        await db.collection("users").doc(uid).set(
            {
                spotifyAccessToken: data.access_token,
                updatedAt: new Date(),
            },
            { merge: true }
        );

        console.log("✅ Token Spotify enregistré avec succès pour", uid);
        res.redirect("/dashboard/settings");

    } catch (err) {
        console.error("❌ Erreur serveur Spotify-user-callback :", err);
        res.status(500).send("Erreur serveur.");
    }
}
