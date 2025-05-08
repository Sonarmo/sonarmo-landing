import { db, authAdmin } from "@/lib/firebaseAdmin"; // ✅ utilise ton fichier centralisé
import cookie from "cookie";

export default async function handler(req, res) {
    const code = req.query.code || null;

    if (!code) {
        console.warn("❌ Aucun code reçu depuis Spotify.");
        return res.status(400).send("❌ Code manquant.");
    }

    console.log("▶️ Code reçu :", code);

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
            console.error("❌ Erreur de récupération token Spotify :", data);
            return res.status(500).json({ error: data });
        }

        console.log("✅ Token Spotify reçu :", {
            access_token: data.access_token?.slice(0, 10) + "...",
            expires_in: data.expires_in,
            scope: data.scope,
        });

        // 🔐 Récupère l'utilisateur Firebase via cookie (authToken)
        const cookies = cookie.parse(req.headers.cookie || "");
        console.log("🍪 Cookies reçus :", cookies);

        const idToken = cookies.token || null;
        console.log("🔑 ID Token extrait :", idToken ? idToken.slice(0, 10) + "..." : null);

        if (!idToken) {
            console.warn("⚠️ Aucun token Firebase trouvé dans les cookies.");
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }

        const decodedToken = await authAdmin.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        console.log("👤 UID Firebase vérifié :", uid);

        // ✅ Stocke le token Spotify dans Firestore
        await db.collection("users").doc(uid).set(
            {
                spotifyAccessToken: data.access_token,
                updatedAt: new Date(),
            },
            { merge: true }
        );

        console.log("📦 Token stocké pour UID :", uid);

        // Redirige proprement vers le dashboard
        res.redirect("/dashboard/settings");
    } catch (err) {
        console.error("❌ Erreur réseau ou Firebase :", err);
        res.status(500).send("Erreur serveur.");
    }
}
