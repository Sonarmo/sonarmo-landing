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
const getSonarmoAccessToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SONARMO_REFRESH_TOKEN;

  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("Impossible d'obtenir un token Spotify.");
  }

  return data.access_token;
};
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { prompt, lang = "fr" } = req.body;
  if (!prompt || prompt.length < 10) {
    return res.status(400).json({ error: "Prompt trop court ou manquant" });
  }

  const accessToken = await getSonarmoAccessToken();

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
  fr: `Tu es un expert en curation musicale. En te basant uniquement sur le prompt utilisateur ci-dessous, génère une playlist Spotify de 20 morceaux cohérente, originale et immersive.

Inclue environ 10 morceaux peu connus, rares ou sous-estimés, pour faire découvrir des artistes ou titres qui sortent de l'ordinaire. Le reste peut être plus populaire, mais toujours en lien avec l'ambiance décrite.

Prompt utilisateur : """${prompt}"""

Réponds uniquement avec une liste JSON stricte, au format :
[
  { "artist": "Nom artiste", "name": "Titre du morceau" },
  ...
]

Aucun commentaire. Aucun texte. Juste la liste JSON.`,
  
  en: `You are a music curation expert. Based only on the user's description below, generate a coherent, original, and immersive Spotify playlist of 20 tracks.

Include around 10 lesser-known, underrated, or rare tracks to help discover hidden gems. The rest can be more popular but must still match the described mood.

User prompt: """${prompt}"""

Reply with a strict JSON list only, formatted as:
[
  { "artist": "Artist Name", "name": "Track Title" },
  ...
]

No explanation. No comments. Just the JSON list.`,

  es: `Eres un experto en curaduría musical. Basándote únicamente en el siguiente prompt del usuario, genera una lista de reproducción de Spotify con 20 canciones coherente, original e inmersiva.

Incluye alrededor de 10 canciones poco conocidas, raras o infravaloradas para descubrir nuevas joyas. El resto puede ser más popular, pero siempre en línea con la atmósfera descrita.

Prompt del usuario: """${prompt}"""

Devuelve únicamente una lista estricta en formato JSON:
[
  { "artist": "Nombre del artista", "name": "Título de la canción" },
  ...
]

Nada de explicaciones ni comentarios. Solo la lista JSON.`
}[lang];

    const completion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: basePrompt }],
  temperature: 0.7,
});

const raw = completion?.choices?.[0]?.message?.content?.trim() || "";

if (!isValidJsonList(raw)) {
  return res.status(500).json({ error: "Réponse GPT non valide." });
}

const tracks = JSON.parse(raw);

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