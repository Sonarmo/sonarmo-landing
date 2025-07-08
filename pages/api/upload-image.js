import { v4 as uuidv4 } from "uuid";
import { bucket } from "@/lib/firebaseStorage"; // 🔥 Tu utilises maintenant le bon bucket initialisé

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { file: image, fileName } = req.body;

    if (!image || !fileName) {
      return res.status(400).json({ error: "Image ou nom de fichier manquant" });
    }

    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Format d'image invalide" });
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const destination = `blog/${Date.now()}-${sanitizedFileName}`;
    const file = bucket.file(destination);

    await file.save(buffer, {
      metadata: {
        contentType,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
      public: true,
    });

    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media`;

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("🔥 Erreur dans upload-image:", error);
    return res.status(500).json({ error: "Erreur serveur durant l'upload" });
  }
}