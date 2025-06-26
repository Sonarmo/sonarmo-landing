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

function isValidJsonList(str) {
  try {
    const data = JSON.parse(str);
    return (
      Array.isArray(data) &&
      data.every(
        (item) =>
          typeof item === "object" &&
          typeof item.artist === "string" &&
          typeof item.name === "string"
      )
    );
  } catch (e) {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { prompt, lang = "fr" } = req.body;
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
    }

    let userData = {};
    if (userDoc?.exists) {
      userData = userDoc.data();
    }

    const abonnement = userData.abonnementActif === true;
    const credits = userData.credits ?? 0;
    const freePromptUsed = userData.freePromptUsed ?? false;

    if (!abonnement) {
      if (!freePromptUsed) {
        await userRef?.set({ freePromptUsed: true }, { merge: true });
      } else {
        if (credits <= 0) {
          return res.status(403).json({ error: "Plus de crédits disponibles." });
        }
        await userRef?.update({ credits: credits - 1 });
      }
    }

    const basePrompt = {
      fr: `Tu es un expert en curation musicale. En te basant uniquement sur le prompt utilisateur ci-dessous, génère une playlist Spotify de 20 morceaux cohérente, originale et immersive. Prompt utilisateur : """${prompt}""" Réponds avec une liste JSON stricte, format : [ { "artist": "Nom artiste", "name": "Titre du morceau" }, ... ] Aucun commentaire. Aucun texte.`,
      en: `You are a music curation expert. Based only on the user's description below, generate a coherent, original, and immersive playlist of 20 Spotify tracks. User prompt: """${prompt}""" Respond with a strict JSON list, format: [ { "artist": "Artist Name", "name": "Track Title" }, ... ] No explanation. No comments. Just the JSON list.`,
      es: `Eres un experto en curaduría musical. Basándote únicamente en el siguiente prompt del usuario, genera una lista de reproducción de Spotify con 20 canciones coherente, original e inmersiva. Prompt del usuario: """${prompt}""" Devuelve una lista en formato JSON estricto: [ { "artist": "Nombre del artista", "name": "Título de la canción" }, ... ] Solo la lista JSON, nada más.`
    }[lang];

    const completions = await Promise.all([
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: basePrompt }],
        temperature: 0.7,
      }),
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: basePrompt }],
        temperature: 0.7,
      }),
    ]);

    const [raw1, raw2] = completions.map(
      (comp) => comp?.choices?.[0]?.message?.content?.trim() || ""
    );

    if (!isValidJsonList(raw1) || !isValidJsonList(raw2)) {
      return res.status(500).json({ error: "Réponse GPT non valide." });
    }

    const tracks = [...JSON.parse(raw1), ...JSON.parse(raw2)];

    const resolvedUris = await Promise.all(
      tracks.map(async (t) => {
        const queries = [
          `${t.name} ${t.artist}`,
          `${t.name}`,
          `${t.artist}`,
          `${t.artist} ${t.name.split(" ")[0]}`,
        ];

        let uri = null;

        for (const rawQuery of queries) {
          const q = encodeURIComponent(rawQuery);
          const resSearch = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const data = await resSearch.json();
          uri = data.tracks?.items?.[0]?.uri || null;
          if (uri) break;
        }

        return uri;
      })
    );

    const uris = resolvedUris.filter(Boolean);

    if (uris.length === 0) {
      return res.status(400).json({ error: "Aucun morceau trouvé" });
    }

    const userRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      const errorText = await userRes.text();
      return res.status(401).json({ error: "Token Spotify invalide ou expiré.", details: errorText });
    }

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
        description: lang === "fr" ? "Générée par Sonarmo" : "Generated by Sonarmo",
        public: false,
      }),
    });

    const playlist = await playlistRes.json();

    await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris }),
    });

    if (uid) {
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
        createdAt: Timestamp.now(),
      });
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