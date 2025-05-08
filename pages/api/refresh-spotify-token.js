// pages/api/refresh-spotify-token.js

export default async function handler(req, res) {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

    const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${basicAuth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refresh_token,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ Erreur rafraîchissement token :", data);
            return res.status(500).json({ error: "Échec du rafraîchissement du token." });
        }

        return res.status(200).json({ access_token: data.access_token });
    } catch (error) {
        console.error("❌ Erreur serveur :", error);
        res.status(500).json({ error: "Erreur serveur pendant le refresh token" });
    }
}
