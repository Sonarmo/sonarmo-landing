// pages/api/spotify-callback.js
export default async function handler(req, res) {
    const code = req.query.code || null;

    if (!code) {
        return res.status(400).send("Code manquant.");
    }

    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

    const authHeader = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
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

        const data = await response.json();

        if (data.error) {
            console.error("Erreur OAuth:", data);
            return res.status(500).json({ error: data });
        }

        // 🔐 Affiche les tokens dans la console pour les sauvegarder à la main
        console.log("✅ Access token:", data.access_token);
        console.log("🔁 Refresh token:", data.refresh_token);

        res.status(200).send("Authentification réussie ! Copie les tokens affichés en console pour les utiliser.");
    } catch (err) {
        console.error("Erreur callback Spotify:", err);
        res.status(500).send("Erreur serveur.");
    }
}
