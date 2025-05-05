// pages/api/spotify-login.js

export default function handler(req, res) {
    // Vérification en console des variables d'environnement
    console.log("🔑 SPOTIFY_CLIENT_ID:", process.env.SPOTIFY_CLIENT_ID);
    console.log("🔁 SPOTIFY_REDIRECT_URI:", process.env.SPOTIFY_REDIRECT_URI);

    const scopes = [
        "playlist-modify-public",
        "playlist-modify-private",
        "user-read-private"
    ].join(" ");

    const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${encodeURIComponent(
        process.env.SPOTIFY_CLIENT_ID
    )}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}`;

    res.redirect(url);
}
