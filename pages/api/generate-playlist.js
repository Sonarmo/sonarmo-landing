// pages/api/generate-playlist.js
import { db } from "../../lib/firebaseAdmin";
import { getSpotifyAccessToken } from "../../lib/spotifyTokens";
import OpenAI from "openai";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const safeArray = (val) => Array.isArray(val) ? val : [];

async function getWeatherFromCity(city) {
  const apiKey = process.env.WEATHERAPI_KEY;
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&lang=fr`;

  const response = await axios.get(url);
  const data = response.data;

  const meteo = data.current.condition.text;
  const heureLocale = data.location.localtime.split(" ")[1]; // HH:MM

  return { meteo, heureLocale };
}

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
    const city = profile.placeCity || "Paris";

    const { meteo, heureLocale } = await getWeatherFromCity(city);

    const prompt = `
Tu es un expert en design sonore pour lieux publics.
Génère une playlist cohérente de 20 morceaux Spotify pour un établissement avec les caractéristiques suivantes :

Ville : ${city}
Heure locale : ${heureLocale}
Météo actuelle : ${meteo}
Heure : ${ambiance.hours}
Ambiance générale : ${ambiance.mood}
Décoration du lieu : ${ambiance.decoration}
Clientèle visée : ${ambiance.clientele}
Objectif musical : ${ambiance.goal}
Genres musicaux préférés : ${safeArray(ambiance.genres).join(", ")}
Artistes de référence : ${safeArray(ambiance.referenceArtists).join(", ")}
Langues musicales préférées : ${safeArray(ambiance.languages).join(", ")}
Tempo souhaité : ${ambiance.tempo}
Taille du lieu : ${ambiance.size}
Type de lieu : ${ambiance.type}
Spécificités ou moments particuliers : ${ambiance.specialMoments}
Éléments identitaires du lieu : ${ambiance.identityNotes}

Ta mission : proposer une playlist cohérente, fluide, non répétitive, adaptée à cette ambiance sonore. Tu dois varier les morceaux tout en respectant une atmosphère homogène.

Donne ta réponse sous forme d’une liste JSON contenant uniquement les 20 morceaux, au format suivant :
[
  { "artist": "Nom de l’artiste", "name": "Titre du morceau" },
  ...
]
Ne fais aucun commentaire. Ne donne aucune explication. Juste la liste.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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

    const resolvedTracks = await Promise.all(
      tracks.map(async (track) => {
        const query = encodeURIComponent(`${track.name} ${track.artist}`);
        const searchRes = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });

        const searchData = await searchRes.json();
        const found = searchData.tracks.items[0];
        return found ? found.uri : null;
      })
    );

    const filteredUris = resolvedTracks.filter(uri => uri);

    const userRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const userData = await userRes.json();
    const userId = userData.id;

    const playlistRes = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Playlist principale – ${profile.placeName}`,
        description: "Playlist générée par IA avec Sonarmo",
        public: false
      }),
    });

    const playlistData = await playlistRes.json();

    if (!playlistData || !playlistData.external_urls || !playlistData.external_urls.spotify) {
      console.error("Erreur : la création de la playlist Spotify a échoué", playlistData);
      return res.status(500).json({ error: "Échec de la création de la playlist Spotify" });
    }

    await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: filteredUris }),
    });

    await db.collection("profiles").doc(id).set({
      playlistUrl: playlistData.external_urls.spotify,
      lastGenerated: new Date().toISOString(),
      mainPlaylist: {
        id: playlistData.id,
        url: playlistData.external_urls.spotify,
        isGenerative: true,
        lastUpdated: new Date().toISOString(),
        mood: ambiance.mood || "",
        meteo: meteo,
        moment: ambiance.hours || "",
        refreshInterval: 60, // en minutes, ajustable plus tard
      }
    }, { merge: true });


    return res.status(200).json({
      playlist: {
        url: playlistData.external_urls.spotify,
        message: "✅ Playlist générée par IA avec succès",
        total: filteredUris.length
      }
    });

  } catch (error) {
    console.error("Erreur API GPT playlist:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
