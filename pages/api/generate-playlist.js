// pages/api/generate-playlist.js
import { db } from "../../lib/firebaseAdmin";
import { getSpotifyAccessToken } from "../../lib/spotifyTokens";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

    const safeArray = (val) => Array.isArray(val) ? val : [];

    const prompt = `Tu es un expert en design sonore pour les lieux publics. Génère une playlist cohérente de 40 titres Spotify adaptés à l’ambiance suivante :\n
    Heure : ${ambiance.hours}\n
    Mood : ${ambiance.mood}\n
    Décoration : ${ambiance.decoration}\n
    Clientèle : ${ambiance.clientele}\n
    Objectif : ${ambiance.goal}\n
    Genres préférés : ${safeArray(ambiance.genres).join(", ")}\n
    Artistes de référence : ${safeArray(ambiance.referenceArtists).join(", ")}\n
    Langues préférées : ${safeArray(ambiance.languages).join(", ")}\n
    Tempo : ${ambiance.tempo}\n
    Taille du lieu : ${ambiance.size}\n
    Type de lieu : ${ambiance.type}\n
    Spécificités : ${ambiance.specialMoments}\n
    Élément identitaire : ${ambiance.identityNotes}\n
    Donne la réponse sous forme de liste JSON d’objets avec \"name\" et \"artist\".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const jsonResponse = completion.choices[0].message.content;
    let tracks;
    try {
      tracks = JSON.parse(jsonResponse);
    } catch (e) {
      console.error("Erreur de parsing GPT:", e);
      return res.status(500).json({ error: "Erreur de parsing GPT" });
    }

    const access_token = await getSpotifyAccessToken();

    const resolvedTracks = [];
    for (const track of tracks) {
      const query = encodeURIComponent(`${track.name} ${track.artist}`);
      const searchRes = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const searchData = await searchRes.json();
      const found = searchData.tracks.items[0];
      if (found) {
        resolvedTracks.push(found.uri);
      }
    }

    const adminUserId = process.env.SPOTIFY_ADMIN_USER_ID;
    const playlistRes = await fetch(`https://api.spotify.com/v1/users/${adminUserId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Sonarmo – ${profile.placeName || "Lieu"}`,
        description: "Playlist générée par IA avec Sonarmo",
        public: false
      }),
    });

    const playlistData = await playlistRes.json();

    await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: resolvedTracks }),
    });

    await db.collection("profiles").doc(id).set({
      playlistUrl: playlistData.external_urls.spotify,
      lastGenerated: new Date().toISOString(),
    }, { merge: true });

    return res.status(200).json({
      playlist: {
        url: playlistData.external_urls.spotify,
        message: "✅ Playlist générée par IA avec succès",
        total: resolvedTracks.length
      }
    });

  } catch (error) {
    console.error("Erreur API GPT playlist:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
