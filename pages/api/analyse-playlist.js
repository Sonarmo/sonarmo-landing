import { getPlaylistAudioData } from "@/lib/spotify/getPlaylistAudioData";
import { aggregateAudioStats } from "@/lib/spotify/aggregateAudioStats";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

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

    const spotifyToken = userSnap.data()?.spotifyAccessToken;

    if (!spotifyToken) {
      return res.status(401).json({ error: "Token Spotify manquant" });
    }

    const playlistId = "37i9dQZF1DXdPec7aLTmlC"; // temporaire : playlist test
    const tracks = await getPlaylistAudioData(playlistId, spotifyToken);
    const stats = aggregateAudioStats(tracks);

    return res.status(200).json({ stats, tracks });
  } catch (err) {
    console.error("Erreur dans /api/analyse-playlist :", err);
    return res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
}