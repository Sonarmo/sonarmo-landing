// pages/api/generate-playlist-prompt.js
import OpenAI from "openai";
import { getSpotifyAccessToken } from "/lib/spotifyTokens";
import { db } from "/lib/firebaseAdmin"; // 🔥 Ajout Firestore
import { authAdmin } from "/lib/firebaseAdmin";
import cookie from "cookie";

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

    try {
        const systemPrompt = `
Tu es un expert en curation musicale.
En te basant uniquement sur le prompt utilisateur ci-dessous, génère une playlist de 15 morceaux Spotify cohérente, originale et fluide.

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

        const raw = completion.choices[0].message.content;
        let tracks;

        try {
            tracks = JSON.parse(raw);
        } catch (err) {
            console.error("❌ Parsing JSON GPT", err);
            return res.status(500).json({ error: "Erreur GPT, JSON invalide" });
        }

        const accessToken = await getSpotifyAccessToken();

        const resolvedUris = await Promise.all(tracks.map(async (t) => {
            const q = encodeURIComponent(`${t.name} ${t.artist}`);
            const res = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await res.json();
            return data.tracks?.items?.[0]?.uri || null;
        }));

        const uris = resolvedUris.filter(Boolean);
        if (uris.length === 0) return res.status(400).json({ error: "Aucun morceau trouvé" });

        const userRes = await fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const user = await userRes.json();

        const playlistRes = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: `Sonarmo – Playlist personnalisée`,
                description: `Générée par GPT via un prompt personnalisé`,
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

        // 🔥 Sauvegarde dans Firestore
        const cookies = cookie.parse(req.headers.cookie || "");
        const idToken = cookies.token;

        if (idToken) {
            try {
                const decodedToken = await authAdmin.verifyIdToken(idToken);
                const uid = decodedToken.uid;
                await db.collection("promptHistory").add({
                    uid,
                    prompt,
                    playlistUrl: playlist.external_urls.spotify,
                    createdAt: new Date(),
                });
            } catch (err) {
                console.warn("⚠️ Impossible d'enregistrer l'historique du prompt:", err);
            }
        }

        return res.status(200).json({
            url: playlist.external_urls.spotify,
            total: uris.length,
            message: "✅ Playlist générée avec succès",
        });

    } catch (err) {
        console.error("❌ Erreur génération playlist via prompt", err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}
