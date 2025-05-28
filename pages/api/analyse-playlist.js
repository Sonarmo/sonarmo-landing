import { getPlaylistAudioData } from "@/lib/spotify/getPlaylistAudioData";
import { aggregateAudioStats } from "@/lib/spotify/aggregateAudioStats";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

async function validateSpotifyToken(token) {
  const res = await fetch("https://api.spotify.com/v1/audio-features/5py3FJrHEuR67BjR7wm8uj", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.status !== 401 && res.status !== 403;
}

export default async function handler(req, res) {
  try {
    const token = req.cookies.token;
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    let spotifyToken = userSnap.data()?.spotifyAccessToken;

    // ✅ Vérifie si le token Spotify est encore valide
    const valid = await validateSpotifyToken(spotifyToken);

    // 🔁 Si non, appelle la route de refresh
    if (!valid) {
      console.log("♻️ Token expiré, tentative de refresh...");
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/refresh-token`, {
        headers: {
          Cookie: `token=${token};`, // passe le cookie Firebase à ta route API
        },
      });
      const refreshData = await refreshRes.json();

      if (refreshData?.access_token) {
        spotifyToken = refreshData.access_token;
      } else {
        return res.status(401).json({ error: "Impossible de rafraîchir le token Spotify" });
      }
    }

    const playlistId = "37i9dQZF1DXdPec7aLTmlC";
    const tracks = await getPlaylistAudioData(playlistId, spotifyToken);
    const stats = aggregateAudioStats(tracks);

    return res.status(200).json({ stats, tracks });
  } catch (err) {
    console.error("💥 Erreur dans /api/analyse-playlist :", err);
    return res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
}