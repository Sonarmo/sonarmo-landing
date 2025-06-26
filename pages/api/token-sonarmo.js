// pages/api/token-sonarmo.js

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("❌ Aucun code reçu depuis Spotify.");
  }

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = "https://www.sonarmo.com/api/token-sonarmo";

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

    if (!data.access_token) {
      console.error("❌ Token Spotify manquant :", data);
      return res.status(500).json({ error: "Token Spotify manquant ou invalide." });
    }

    console.log("✅ Access Token :", data.access_token);
    console.log("♻️ Refresh Token :", data.refresh_token);

    return res.status(200).send(`
      <h2 style="font-family:sans-serif">✅ Token Spotify récupéré avec succès !</h2>
      <p><strong>Access Token (valide 1h) :</strong><br><code>${data.access_token}</code></p>
      <p><strong>Refresh Token :</strong><br><code>${data.refresh_token}</code></p>
      <p>➡️ Copie ces deux valeurs dans ton fichier .env.local pour utiliser le compte Spotify Sonarmo automatiquement.</p>
    `);
  } catch (err) {
    console.error("❌ Erreur callback Spotify :", err);
    return res.status(500).json({ error: "Erreur serveur." });
  }
}