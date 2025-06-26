// 👉 Conservé pour usage futur avec Spotify OAuth (connexion directe utilisateur)
// Actuellement inutilisé pour la génération classique de playlists
// // pages/api/login-user.js

export default function handler(req, res) {
    const scopes = process.env.NEXT_PUBLIC_SPOTIFY_SCOPES;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI_USER;
    const clientId = process.env.SPOTIFY_CLIENT_ID;

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
        scopes
    )}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    res.redirect(spotifyAuthUrl);
}
