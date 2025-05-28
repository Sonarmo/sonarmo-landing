import { getPlaylistAudioData } from "@/lib/spotify/getPlaylistAudioData";
import { aggregateAudioStats } from "@/lib/spotify/aggregateAudioStats";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Vérifie qu’un token Spotify fonctionne avec une requête simple
async function validateSpotifyToken(token) {
  try {
    const res = await fetch("https://api.spotify.com/v1/audio-features/5py3FJrHEuR67BjR7wm8uj", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.status !== 401 && res.status !== 403;
  } catch (err) {
    console.error("❌ Erreur lors de la validation du token :", err.message);
    return false;
  }
}

export default async function handler(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.warn("🚫 Aucun cookie token reçu");
      return res.status(401).json({ error: "Non authentifié" });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;
    console.log("✅ Utilisateur Firebase UID :", uid);

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("❌ Utilisateur introuvable dans Firestore :", uid);
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    let spotifyToken = userSnap.data()?.spotifyAccessToken;

    if (!spotifyToken) {
      console.warn("❌ Aucun token Spotify stocké");
      return res.status(401).json({ error: "Token Spotify manquant" });
    }

    const isValid = await validateSpotifyToken(spotifyToken);
    console.log("🎫 Token Spotify valide :", isValid);

    if (!isValid) {
      console.log("♻️ Token expiré, appel au refresh...");
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/refresh-token`, {
        headers: { Cookie: `token=${token};` },
      });

      const refreshData = await refreshRes.json();

      if (!refreshRes.ok || !refreshData?.access_token) {
        console.error("❌ Échec du refresh Spotify :", refreshData);
        return res.status(401).json({ error: "Impossible de rafraîchir le token Spotify" });
      }

      spotifyToken = refreshData.access_token;
      console.log("🔑 Nouveau token Spotify reçu :", spotifyToken.slice(0, 10) + "...");
    }

    const playlistId = "37i9dQZF1DXdPec7aLTmlC";
    console.log("🎧 Lecture de la playlist :", playlistId);

    const tracks = await getPlaylistAudioData(playlistId, spotifyToken);
    console.log(`🎶 ${tracks.length} morceaux récupérés.`);

    const stats = aggregateAudioStats(tracks);
    console.log("📊 Statistiques générées :", stats);

    return res.status(200).json({ stats, tracks });
  } catch (err) {
    console.error("💥 Erreur critique dans /api/analyse-playlist :", err.message);
    console.error(err.stack);
    return res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
}