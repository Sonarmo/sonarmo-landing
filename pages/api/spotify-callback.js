// pages/api/spotify-callback.js

export default async function handler(req, res) {
  const code = req.query.code || null;

  if (!code) {
    return res.status(400).send("❌ Code manquant.");
  }

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI_ADMIN;

  if (!client_id || !client_secret || !redirect_uri) {
    return res.status(500).send("❌ Variables d'environnement Spotify manquantes.");
  }

  const authHeader = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ Erreur Spotify callback:", data);
      return res.status(500).json({ error: data });
    }

    console.log("✅ Access token:", data.access_token);
    console.log("🔁 Refresh token:", data.refresh_token);

    res.status(200).send(`
      <h2>Authentification réussie ✅</h2>
      <p>Copie le <strong>refresh_token</strong> affiché dans ta console pour le coller dans ton .env.local</p>
    `);
  } catch (err) {
    console.error("❌ Erreur réseau Spotify:", err);
    res.status(500).send("Erreur serveur.");
  }
}
