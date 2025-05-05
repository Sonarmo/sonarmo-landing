// pages/api/cron/regenerate-playlist.js
export default async function handler(req, res) {
    if (req.headers["x-vercel-cron"] !== "true") {
        return res.status(403).json({ error: "Accès refusé" });
    }

    const playlistId = "L’ID DU PROFIL FIRESTORE À RÉGÉNÉRER"; // remplace par l’ID du document

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/generate-playlist?id=${playlistId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Erreur API");

        return res.status(200).json({ success: true, playlist: data.playlist });
    } catch (err) {
        console.error("Erreur tâche CRON :", err);
        return res.status(500).json({ error: "Erreur serveur CRON" });
    }
}
