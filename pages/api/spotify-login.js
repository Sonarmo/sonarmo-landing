// pages/api/spotify-login.js
export default function handler(req, res) {
    const scopes = [
        "playlist-modify-public",
        "playlist-modify-private",
        "user-read-private"
    ].join(" ");

    const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
    const client_id = process.env.SPOTIFY_CLIENT_ID;

    const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${encodeURIComponent(
        client_id
    )}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirect_uri)}`;

    res.redirect(url);
}
