// pages/api/generate-playlist-prompt.js
import OpenAI from "openai";
import { db, authAdmin } from "/lib/firebaseAdmin";
import cookie from "cookie";
import admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export const config = {
  runtime: "nodejs",
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { prompt } = req.body;
  if (!prompt || prompt.length < 10) {
    return res.status(400).json({ error: "Prompt trop court ou manquant" });
  }

  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ error: "Token Spotify manquant." });
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const idToken = cookies.token;
    let uid = null;
    let userRef = null;
    let userDoc = null;

    if (idToken) {
      const decodedToken = await authAdmin.verifyIdToken(idToken);
      uid = decodedToken.uid;
      userRef = db.collection("users").doc(uid);
      userDoc = await userRef.get();

      const userData = userDoc.exists ? userDoc.data() : {};
      const freePromptUsed = userData.freePromptUsed ?? false;
      const credits = userData.credits ?? 0;

      if (freePromptUsed) {
        if (credits <= 0) {
          return res.status(403).json({ error: "Plus de crédits disponibles." });
        }
        await userRef.update({ credits: credits - 1 });
      } else {
        await userRef.set({ freePromptUsed: true }, { merge: true });
      }
    }

    const systemPrompt = `
Tu es un expert en curation musicale.
En te basant uniquement sur le prompt utilisateur ci-dessous, génère une playlist de 20 morceaux Spotify cohérente, originale et fluide.

Prompt utilisateur : """${prompt}"""

Réponds avec une liste JSON stricte, format :
[
  { "artist": "Nom artiste", "name": "Titre du morceau" },
  ...
]
Aucun commentaire. Aucun texte. Seulement la liste JSON.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: systemPrompt }],
      temperature: 0.7,
    });

    let tracks;
    try {
      tracks = JSON.parse(completion.choices[0].message.content);
    } catch (err) {
      console.error("❌ Parsing JSON GPT", err);
      return res.status(500).json({ error: "Erreur GPT, JSON invalide" });
    }

    const resolvedUris = await Promise.all(
      tracks.map(async (t) => {
        const q = encodeURIComponent(`${t.name} ${t.artist}`);
        const resSearch = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await resSearch.json();
        return data.tracks?.items?.[0]?.uri || null;
      })
    );

    const uris = resolvedUris.filter(Boolean);
    if (uris.length === 0) {
      return res.status(400).json({ error: "Aucun morceau trouvé" });
    }

    const userRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = await userRes.json();

    const rawTitle = prompt.length > 40 ? prompt.slice(0, 40) + "…" : prompt;
    const cleanTitle = rawTitle.replace(/[^\w\sÀ-ÿ!?.,:;'-]/g, "").trim();
    const playlistName = `${cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)}`;

    const playlistRes = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playlistName,
        description: `Générée par Sonarmo`,
        public: false,
      }),
    });

    const playlist = await playlistRes.json();
console.log("🎵 Playlist Spotify API response :", playlist);
    if (!playlist.id || !playlist.external_urls?.spotify) {
      console.warn("⚠️ Playlist créée mais URL manquante ou incomplète :", playlist);
    }

    await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris }),
    });

    if (uid) {
      try {
        await db.collection("promptHistory").add({
          uid,
          prompt,
          playlistUrl: playlist?.external_urls?.spotify || "",
          playlistName: playlist.name,
          totalTracks: uris.length,
          spotifyEmail: user.email || "",
          spotifyCountry: user.country || "",
          spotifyProduct: user.product || "",
          spotifyDisplayName: user.display_name || "",
          createdAt: admin.firestore.Timestamp.now(),
        });
      } catch (err) {
        console.warn("⚠️ Impossible d'enregistrer l'historique du prompt :", err);
      }
    }

    return res.status(200).json({
      url: playlist?.external_urls?.spotify || "",
      total: uris.length,
      message: "✅ Playlist générée avec succès",
    });
  } catch (err) {
    console.error("❌ Erreur génération playlist via prompt", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
