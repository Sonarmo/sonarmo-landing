export default async function handler(req, res) {
  try {
    const token = req.cookies.token;
    console.log("✅ Token reçu :", token);

    const decodedToken = await auth.verifyIdToken(token);
    console.log("✅ Utilisateur Firebase :", decodedToken.uid);

    const uid = decodedToken.uid;
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.log("❌ Utilisateur non trouvé en base");
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const spotifyToken = userSnap.data()?.spotifyAccessToken;
    console.log("🎵 Spotify token trouvé :", spotifyToken);

    if (!spotifyToken) {
      return res.status(401).json({ error: "Token Spotify manquant" });
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