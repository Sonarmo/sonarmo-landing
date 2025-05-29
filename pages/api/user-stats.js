// pages/api/user-stats.js
import { authAdmin, db } from "@/lib/firebaseAdmin";

function aggregateAudioStats(tracks) {
  const total = tracks.length;
  if (total === 0) return null;

  let energy = 0, valence = 0;
  const genreCount = {};

  for (const track of tracks) {
    energy += track.energy || 0;
    valence += track.valence || 0;

    if (track.genres && Array.isArray(track.genres)) {
      for (const genre of track.genres) {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      }
    }
  }

  const averageEnergy = energy / total;
  const averageValence = valence / total;
  const topGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => ({ genre }));

  return { averageEnergy, averageValence, topGenres };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Token manquant" });

  try {
    const decoded = await authAdmin.verifyIdToken(token);
    const uid = decoded.uid;

    const snapshot = await db.collection("users").doc(uid).collection("trackAnalyses").get();
    const tracks = snapshot.docs.map(doc => doc.data());

    const stats = aggregateAudioStats(tracks);

    return res.status(200).json({ stats });
  } catch (error) {
    console.error("❌ Erreur dans /api/user-stats:", error);
    return res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
}
