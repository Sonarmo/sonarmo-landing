export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Token manquant" });

  try {
    const decoded = await authAdmin.verifyIdToken(token);
    const uid = decoded.uid;

    const snapshot = await db
      .collection("users")
      .doc(uid)
      .collection("trackAnalyses")
      .get();

    const tracks = snapshot.docs.map((doc) => doc.data());

    if (tracks.length === 0) {
      return res.status(200).json({
        stats: {
          averageEnergy: 0,
          averageValence: 0,
          topGenres: [],
          total_tracks: 0,
          history: [],
        },
      });
    }

    const stats = aggregateAudioStats(tracks);

    return res.status(200).json({
      stats: {
        ...stats,
        total_tracks: tracks.length,
        history: tracks.map((track, i) => ({
          id: i,
          energy: track.energy ?? 0,
          valence: track.valence ?? 0,
        })),
      },
    });
  } catch (error) {
    console.error("❌ Erreur dans /api/user-stats:", error);
    return res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
}