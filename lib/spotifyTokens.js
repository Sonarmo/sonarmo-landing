// lib/spotifyTokens.js
export async function getSpotifyAccessToken() {
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
                refresh_token,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error_description || "Impossible d'obtenir le token Spotify.");
        }

        return data.access_token;
    } catch (error) {
        console.error("Erreur lors de la récupération du token Spotify :", error);
        throw error;
    }
}
