import { db, authAdmin } from "/lib/firebaseAdmin";
import cookie from "cookie";

export default async function handler(req, res) {
  const code = req.query.code || null;

  if (!code) {
    console.warn("❌ Aucun code reçu depuis Spotify.");
    return res.status(400).send("Code manquant.");
  }

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI_USER;

  if (!client_id || !client_secret || !redirect_uri) {
    console.error("❌ Variables d'environnement Spotify manquantes.");
    return res.status(500).json({ error: "Variables d'environnement Spotify manquantes." });
  }

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

    const cookies = cookie.parse(req.headers.cookie || "");
    const idToken = cookies.token || null;

    // 🔓 Mode B2C sans connexion Firebase (optionnel)
    if (!idToken) {
      console.warn("⚠️ Aucun token Firebase trouvé dans les cookies (mode B2C ?)");
      const safeRedirect = `/generateur?access_token=${data.access_token}`;
      return res.redirect(safeRedirect);
    }

    let uid;
    try {
      const decodedToken = await authAdmin.verifyIdToken(idToken);
      uid = decodedToken.uid;
    } catch (verifyError) {
      console.error("❌ Erreur de vérification Firebase :", verifyError);
      return res.status(401).json({ error: "Token Firebase invalide" });
    }

    const userRef = db.collection("users").doc(uid);
    const existingUser = await userRef.get();
    const existingRefreshToken = existingUser.exists ? existingUser.data().spotifyRefreshToken : null;

    await userRef.set(
      {
        spotifyAccessToken: data.access_token,
        spotifyRefreshToken: data.refresh_token || existingRefreshToken,
        expiresIn: data.expires_in,
        expiresAt: Date.now() + data.expires_in * 1000,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    console.log("✅ Token Spotify stocké pour UID :", uid);

    // 🔁 Redirection selon le rôle
    const role = existingUser.exists ? existingUser.data().role : "particulier";

    if (role === "admin" || role === "pro") {
      return res.redirect("/dashboard/settings");
    } else {
      return res.redirect(`/generateur?access_token=${data.access_token}`);
    }
  } catch (err) {
    console.error("❌ Erreur Spotify callback :", err);
    return res.status(500).json({ error: err.message || "Erreur serveur." });
  }
}