import { db } from "../../lib/firebaseAdmin";

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

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Erreur token Spotify:", errorText);
      throw new Error("Erreur lors de la récupération du token Spotify");
    }

    const { access_token } = await tokenResponse.json();

    const allowedGenres = [
      "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "black-metal",
      "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "chill",
      "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal",
      "deep-house", "detroit-techno", "disco", "drum-and-bass", "dub", "dubstep",
      "edm", "electronic", "emo", "folk", "french", "funk", "garage", "german",
      "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock",
      "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk",
      "house", "idm", "indian", "indie", "indie-pop", "industrial", "j-dance", "j-idol",
      "j-pop", "j-rock", "jazz", "k-pop", "latin", "latino", "lo-fi", "metal", "minimal-techno",
      "movie", "mpb", "new-age", "new-release", "opera", "party", "piano", "pop", "power-pop",
      "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae",
      "reggaeton", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba",
      "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul",
      "spanish", "study", "summer", "synth-pop", "tango", "techno", "trance", "trip-hop",
      "turkish", "work-out", "world-music"
    ];

    const seedGenresArray = (ambiance.genres || []).filter(genre => allowedGenres.includes(genre)).slice(0, 5);

    console.log("🎵 Genres sélectionnés :", ambiance.genres);
    console.log("✅ Genres valides pour Spotify :", seedGenresArray);
    console.log("🔐 Access Token (abrégé) :", access_token?.slice(0, 10) + "...");

    if (seedGenresArray.length === 0) {
      return res.status(400).json({ error: "Aucun genre valide fourni pour Spotify" });
    }

    const seedGenres = seedGenresArray.join(",");

    const recommendationsResponse = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${seedGenres}&limit=20`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!recommendationsResponse.ok) {
      const errorText = await recommendationsResponse.text();
      console.error("❌ Erreur Spotify API (reco) – status :", recommendationsResponse.status);
      console.error("❌ Corps de réponse :", errorText);
      return res.status(500).json({
        error: "Erreur lors de la récupération des recommandations Spotify",
        spotifyResponse: errorText
      });
    }


    const recommendationsData = await recommendationsResponse.json();
    const tracks = recommendationsData.tracks.map(track => ({
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      url: track.external_urls.spotify,
    }));

    // Création de la playlist sur ton compte Spotify
    const userId = process.env.SPOTIFY_ADMIN_USER_ID;
    const adminToken = process.env.SPOTIFY_ADMIN_TOKEN;

    const createPlaylistRes = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Sonarmo – ${profile.placeName || "Nouveau lieu"} 🎵`,
        description: `Playlist générée automatiquement pour ${profile.placeName || "votre lieu"} – Sonarmo`,
        public: false
      }),
    });

    if (!createPlaylistRes.ok) {
      const text = await createPlaylistRes.text();
      console.error("Erreur création playlist :", text);
      return res.status(500).json({ error: "Erreur lors de la création de la playlist Spotify" });
    }

    const playlistData = await createPlaylistRes.json();
    const playlistId = playlistData.id;
    const playlistUrl = playlistData.external_urls.spotify;

    // Ajout des morceaux à la playlist
    const trackUris = recommendationsData.tracks.map(t => t.uri);

    const addTracksRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: trackUris }),
    });

    if (!addTracksRes.ok) {
      const text = await addTracksRes.text();
      console.error("Erreur ajout morceaux :", text);
      return res.status(500).json({ error: "Erreur lors de l'ajout des morceaux à la playlist" });
    }

    // Sauvegarde dans Firestore
    await docRef.set({
      playlistUrl,
      lastGenerated: new Date().toISOString()
    }, { merge: true });

    return res.status(200).json({
      playlist: {
        url: playlistUrl,
        tracks,
        mood: ambiance.mood,
        tempo: ambiance.tempo,
        message: "✅ Playlist créée et ajoutée à ton compte Spotify !"
      }
    });

  } catch (err) {
    console.error("💥 Erreur API playlist:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
