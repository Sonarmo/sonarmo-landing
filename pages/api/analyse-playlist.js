import { getPlaylistAudioData } from "@/lib/spotify/getPlaylistAudioData";
import { aggregateAudioStats } from "@/lib/spotify/aggregateAudioStats";
import { authAdmin } from "@/lib/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";

// Vérifie qu’un token Spotify fonctionne avec une requête simple
async function validateSpotifyToken(token) {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.status !== 401 && res.status !== 403;
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
    const decodedToken = await authAdmin.verifyIdToken(token);
    const uid = decodedToken.uid;
    console.log("✅ Utilisateur Firebase UID :", uid);

    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    let spotifyToken = userSnap.data()?.spotifyAccessToken;

    const valid = await validateSpotifyToken(spotifyToken);
    if (!valid) {
      console.log("♻️ Token expiré, tentative de refresh...");
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/refresh-token`, {
        headers: {
          Cookie: `token=${token};`,
        },
      });
      const refreshData = await refreshRes.json();

      if (refreshData?.access_token) {
        spotifyToken = refreshData.access_token;
      } else {
        return res.status(401).json({ error: "Impossible de rafraîchir le token Spotify" });
      }
    }

    const tracks = await getPlaylistAudioData(playlistId, spotifyToken);
    const stats = aggregateAudioStats(tracks);

    return res.status(200).json({ stats, tracks });

  } catch (err) {
    console.error("💥 Erreur critique dans /api/analyse-playlist :", err);
    return res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
}