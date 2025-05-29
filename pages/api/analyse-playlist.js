import { getPlaylistAudioData } from "/lib/spotify/getPlaylistAudioData";
import { aggregateAudioStats } from "/lib/spotify/aggregateAudioStats";
import { authAdmin, db } from "/lib/firebaseAdmin";

// ✅ Vérifie si le token Spotify est encore valide
async function validateSpotifyToken(token) {
  try {
    const res = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401 || res.status === 403) {
      console.warn(`🔒 Token Spotify invalide ou expiré (status ${res.status})`);
      return false;
    }

    if (!res.ok) {
      console.error(`❌ Erreur inattendue lors de la validation du token Spotify :`, await res.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("💥 Erreur réseau lors de la validation du token Spotify :", error);
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { playlistId } = req.body;
  if (!playlistId) {
    return res.status(400).json({ error: "playlistId manquant dans le body" });
  }

  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Token Firebase manquant dans les cookies." });
    }

    const decodedToken = await authAdmin.verifyIdToken(token);
    const uid = decodedToken.uid;
    console.log("✅ Utilisateur Firebase UID :", uid);

    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "Utilisateur non trouvé dans Firestore." });
    }

    let spotifyToken = userSnap.data()?.spotifyAccessToken;
    if (!spotifyToken) {
      return res.status(400).json({ error: "Aucun token Spotify trouvé pour cet utilisateur." });
    }

    const tokenValid = await validateSpotifyToken(spotifyToken);
    if (!tokenValid) {
      console.log("♻️ Token Spotify expiré, tentative de refresh...");
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/refresh-token`, {
        headers: {
          Cookie: `token=${token};`,
        },
      });
      const refreshData = await refreshRes.json();

      if (refreshRes.ok && refreshData?.access_token) {
        spotifyToken = refreshData.access_token;
        await userRef.update({
          spotifyAccessToken: spotifyToken,
          spotifyTokenTimestamp: Date.now(),
        });
        console.log("🔄 Token Spotify rafraîchi avec succès.");
      } else {
        console.error("❌ Échec du rafraîchissement du token Spotify :", refreshData);
        return res.status(401).json({ error: "Impossible de rafraîchir le token Spotify." });
      }
    }

    console.log("📥 Analyse de la playlist :", playlistId);
    const tracks = await getPlaylistAudioData(playlistId, spotifyToken);

    if (!Array.isArray(tracks) || tracks.length === 0) {
      console.warn("⚠️ Aucun morceau récupéré depuis la playlist Spotify.");
      return res.status(500).json({ error: "Aucune donnée audio récupérée depuis Spotify." });
    }

    const stats = aggregateAudioStats(tracks);
    console.log("🧠 Statistiques générées :", stats);

    return res.status(200).json({ stats, tracks });

  } catch (err) {
    console.error("💥 Erreur critique dans /api/analyse-playlist :", err);
    return res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
}