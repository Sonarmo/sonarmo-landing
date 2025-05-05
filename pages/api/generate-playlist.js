// pages/api/generate-playlist.js
import { db } from "../../lib/firebaseAdmin";
import { getSpotifyAccessToken } from "../../lib/spotifyTokens";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "ID manquant" });
  }

  try {
    const docRef = db.collection("profiles").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Profil non trouvé" });
    }

    const profile = docSnap.data();
    const ambiance = profile.ambianceDetails || {};

    const access_token = await getSpotifyAccessToken();

    const allowedGenres = [
      "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "chill",
      "classical", "dance", "deep-house", "disco", "electronic", "folk",
      "french", "house", "indie", "jazz", "latin", "lo-fi", "pop", "rock",
      "soul", "techno", "trance", "trip-hop"
    ];

    const seedGenresArray = (ambiance.genres || []).filter(genre => allowedGenres.includes(genre)).slice(0, 5);
    if (seedGenresArray.length === 0) {
      return res.status(400).json({ error: "Aucun genre valide fourni pour Spotify" });
    }

    const seedGenres = seedGenresArray.join(",");

    const recommendationsResponse = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${seedGenres}&limit=40`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!recommendationsResponse.ok) {
      const status = recommendationsResponse.status;
      const errorText = await recommendationsResponse.text();
      console.error("❌ Erreur Spotify API (reco) – status :", status);
      console.error("❌ Corps de réponse :", errorText);
      return res.status(500).json({
        error: "Erreur lors de la récupération des recommandations Spotify",
        spotifyStatus: status,
        spotifyBody: errorText
      });
    }

    const recommendationsData = await recommendationsResponse.json();
    const tracks = recommendationsData.tracks.map(track => ({
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      url: track.external_urls.spotify,
      uri: track.uri
    }));

    const adminUserId = process.env.SPOTIFY_ADMIN_USER_ID;
    const playlistName = `Sonarmo – ${profile.placeName || "Lieu"}`;

    const createPlaylistRes = await fetch(`https://api.spotify.com/v1/users/${adminUserId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playlistName,
        description: `Playlist Sonarmo générée automatiquement pour ${profile.placeName || "un lieu"}`,
        public: false
      }),
    });

    if (!createPlaylistRes.ok) {
      const errorText = await createPlaylistRes.text();
      console.error("Erreur création playlist:", errorText);
      return res.status(500).json({ error: "Erreur création playlist" });
    }

    const playlistData = await createPlaylistRes.json();

    const addTracksRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: tracks.map(t => t.uri) }),
    });

    if (!addTracksRes.ok) {
      const errorText = await addTracksRes.text();
      console.error("Erreur ajout morceaux:", errorText);
      return res.status(500).json({ error: "Erreur ajout morceaux à la playlist" });
    }

    await db.collection("profiles").doc(id).set({
      playlistUrl: playlistData.external_urls.spotify,
      lastGenerated: new Date().toISOString()
    }, { merge: true });

    return res.status(200).json({
      playlist: {
        url: playlistData.external_urls.spotify,
        tracks,
        message: "✅ Playlist Spotify créée avec succès"
      }
    });
  } catch (error) {
    console.error("Erreur API playlist:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
} 
