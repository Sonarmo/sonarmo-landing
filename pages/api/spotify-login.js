export default function handler(req, res) {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

    const scopes = [
        "user-read-email",
        "user-read-private",
        "streaming",
        "user-modify-playback-state",
        "user-read-playback-state",
        "user-read-currently-playing",
        "playlist-read-private",
        "playlist-read-collaborative"
    ];

    const queryParams = new URLSearchParams({
        response_type: "code",
        client_id,
        scope: scopes.join(" "),
        redirect_uri,
    });

    const redirectUrl = `https://accounts.spotify.com/authorize?${queryParams.toString()}`;
    res.redirect(redirectUrl);
}
