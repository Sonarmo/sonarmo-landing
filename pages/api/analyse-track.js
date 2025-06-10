// /pages/api/analyse-track.js
import { getTrackData } from "/lib/spotify/getTrackData";
import { authAdmin, db } from "/lib/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { trackId, sessionId } = req.body;

  if (!trackId || !sessionId) {
    return res.status(400).json({ error: "trackId ou sessionId manquant" });
  }

  try {
    const token = req.cookies.token;
    console.log("🎫 Token reçu :", token);
    const decodedToken = await authAdmin.verifyIdToken(token);
    const uid = decodedToken.uid;
    console.log("✅ UID utilisateur :", uid);

    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const accessToken = userSnap.data().spotifyAccessToken;
    const trackData = await getTrackData(trackId, accessToken);
    console.log("🎶 Track data récupérée :", trackData);

    if (!trackData) {
      return res.status(500).json({ error: "Impossible de récupérer les données du morceau" });
    }

    // Enregistre le morceau dans la session
    console.log("📥 Données prêtes à être enregistrées dans Firestore :", trackData);
    const trackRef = db
      .collection("listeningSessions")
      .doc(sessionId)
      .collection("tracks")
      .doc(trackId);
    await trackRef.set(trackData);

    // Met à jour les stats globales
    const tracksSnap = await db
      .collection("listeningSessions")
      .doc(sessionId)
      .collection("tracks")
      .get();

    let energySum = 0;
    let valenceSum = 0;
    const genreCount = {};
    let count = 0;

    tracksSnap.forEach((doc) => {
      const t = doc.data();
      energySum += t.energy || 0;
      valenceSum += t.valence || 0;
      count++;
      (t.genres || []).forEach((g) => {
        genreCount[g] = (genreCount[g] || 0) + 1;
      });
    });

    const averageEnergy = count ? energySum / count : 0;
    const averageValence = count ? valenceSum / count : 0;
    const sortedGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => ({ genre }));

    await db.collection("listeningSessions").doc(sessionId).set(
      {
        stats: {
          averageEnergy,
          averageValence,
          topGenres: sortedGenres,
          updatedAt: new Date(),
        },
      },
      { merge: true }
    );

    return res.status(200).json({ message: "Analyse mise à jour", stats: { averageEnergy, averageValence, topGenres: sortedGenres } });
  } catch (err) {
    console.error("❌ Erreur analyse de morceau:", err.message);
console.error(err.stack); // ➕ pour avoir l'origine exacte
    return res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
}