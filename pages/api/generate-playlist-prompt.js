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

    // 🔐 Contrôle utilisateur
    let userData = {};
    if (userDoc?.exists) {
      userData = userDoc.data();
    }

    const abonnement = userData.abonnement ?? false;
    const credits = userData.credits ?? 0;
    const freePromptUsed = userData.freePromptUsed ?? false;

    console.log("👤 Statut utilisateur :", {
      abonnement,
      credits,
      freePromptUsed,
    });

    if (abonnement === true) {
      console.log("✅ Utilisateur avec abonnement actif : accès illimité");
    } else {
      if (!freePromptUsed) {
        await userRef?.set({ freePromptUsed: true }, { merge: true });
        console.log("🎁 Premier prompt gratuit activé.");
      } else {
        if (credits <= 0) {
          console.warn("⛔️ Blocage : plus de crédits.");
          return res.status(403).json({ error: "Plus de crédits disponibles." });
        }
        await userRef?.update({ credits: credits - 1 });
        console.log("🔢 Crédit utilisé : il en reste", credits - 1);
      }
    }

  

    // 🎯 Prompts adaptés pour 20 morceaux × 2
    const basePrompt = {
      fr: `
Tu es un expert en curation musicale.
En te basant uniquement sur le prompt utilisateur ci-dessous, génère une playlist Spotify de 20 morceaux cohérente, originale et immersive.

Ta sélection doit inclure un mélange équilibré de titres populaires et de morceaux moins connus, rares ou émergents, afin de proposer une écoute à la fois engageante et surprenante. Priorise la cohérence de l'ambiance tout en favorisant la découverte musicale.

Prompt utilisateur : """${prompt}"""

Réponds avec une liste JSON stricte, format :
[
  { "artist": "Nom artiste", "name": "Titre du morceau" },
  ...
]
Aucun commentaire. Aucun texte. Seulement la liste JSON.`,
      en: `
You are a music curation expert.
Based only on the user's description below, generate a coherent, original, and immersive playlist of 20 Spotify tracks.

Your selection should include a balanced mix of popular songs and lesser-known, rare, or emerging tracks to offer a fresh and surprising listening experience. Prioritize the overall vibe and atmosphere while encouraging musical discovery.

User prompt: """${prompt}"""

Respond with a strict JSON list, format:
[
  { "artist": "Artist Name", "name": "Track Title" },
  ...
]
No explanation. No comments. Just the JSON list.`,
      es: `
Eres un experto en curaduría musical.
Basándote únicamente en el siguiente prompt del usuario, genera una lista de reproducción de Spotify con 20 canciones coherente, original e inmersiva.

Tu selección debe incluir una mezcla equilibrada entre canciones populares y temas menos conocidos, raros o emergentes, con el fin de ofrecer una experiencia auditiva fresca y sorprendente. Prioriza la coherencia de la atmósfera y el estado de ánimo, fomentando el descubrimiento musical.

Prompt del usuario: """${prompt}"""

Tu única tarea es devolver una lista en formato JSON estricto como este:
[
  { "artist": "Nombre del artista", "name": "Título de la canción" },
  ...
]

⚠️ No agregues ningún comentario, explicación, texto introductorio o final.
Solo responde con la lista JSON, nada más.
`
    }[lang];

    // 🚀 Génération GPT en 2 appels de 20
    const [completion1, completion2] = await Promise.all([
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

    const raw1 = completion1.choices[0].message.content.trim();
    const raw2 = completion2.choices[0].message.content.trim();

    if (!raw1.startsWith("[") || !raw2.startsWith("[")) {
      console.error("❌ Réponse GPT invalide :", { raw1, raw2 });
      return res.status(500).json({ error: "Réponse GPT non valide. Veuillez reformuler votre demande." });
    }

    let tracks1, tracks2;
    try {
      tracks1 = JSON.parse(raw1);
      tracks2 = JSON.parse(raw2);
    } catch (err) {
      console.error("❌ Parsing JSON GPT", err);
      return res.status(500).json({ error: "Erreur GPT, JSON invalide" });
    }

    const tracks = [...tracks1, ...tracks2];

    // 🔍 Recherche intelligente des URIs Spotify avec fallback
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

      if (uri) {
        if (rawQuery !== `${t.name} ${t.artist}`) {
          console.log(`🔁 Fallback réussi : ${rawQuery} → ${uri}`);
        }
        break;
      }
    }

    if (!uri) {
      console.warn(`❌ Non trouvé sur Spotify : ${t.artist} - ${t.name}`);
    }

    return uri;
  })
);

const uris = resolvedUris.filter(Boolean);

console.log(`🎯 ${uris.length}/${tracks.length} morceaux trouvés sur Spotify`);

if (uris.length === 0) {
  return res.status(400).json({ error: "Aucun morceau trouvé" });
}

    // 👤 Récupération de l'utilisateur Spotify
    const userRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = await userRes.json();

    const rawTitle = prompt.length > 40 ? prompt.slice(0, 40) + "…" : prompt;
    const cleanTitle = rawTitle.replace(/[^\w\sÀ-ÿ!?.,:;'-]/g, "").trim();
    const playlistName = `${cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)}`;

    // 📝 Création de la playlist
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
    console.log("🎵 Playlist Spotify API response :", playlist);

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