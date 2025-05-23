
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const { OpenAI } = require("openai");
const { getSpotifyAccessToken } = require("./spotifyTokens");

admin.initializeApp();
const db = admin.firestore();

const openai = new OpenAI({ apiKey: functions.config().openai.key });

exports.updateGenerativePlaylistsClean = functions.pubsub
  .schedule("every 60 minutes")
  .onRun(async () => {
    const snapshot = await db.collection("profiles").get();
    const profiles = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(p => p.mainPlaylist?.isGenerative);

    for (const profile of profiles) {
      try {
        const { id, mainPlaylist } = profile;
        const { mood, meteo, moment } = mainPlaylist;

        const prompt = `Génère une nouvelle sélection de 10 morceaux Spotify pour une ambiance ${mood}, en ${meteo}, durant ${moment}. Réponds avec uniquement une liste JSON : [{ "artist": "", "name": "" }, ...]`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
        });

        const tracks = JSON.parse(completion.choices[0].message.content);

        const access_token = await getSpotifyAccessToken();
        const resolvedUris = await Promise.all(
          tracks.map(async (track) => {
            const q = encodeURIComponent(`${track.name} ${track.artist}`);
            const res = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`, {
              headers: { Authorization: `Bearer ${access_token}` },
            });
            const data = await res.json();
            return data.tracks.items[0]?.uri || null;
          })
        );
        const uris = resolvedUris.filter(Boolean);

        await fetch(`https://api.spotify.com/v1/playlists/${mainPlaylist.id}/tracks`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris }),
        });

        await db.collection("profiles").doc(id).update({
          "mainPlaylist.lastUpdated": new Date().toISOString(),
        });

        console.log(`✅ Playlist mise à jour pour ${id}`);
      } catch (err) {
        console.error(`❌ Erreur sur ${profile.id}:`, err);
      }
    }

    return null;
  });
