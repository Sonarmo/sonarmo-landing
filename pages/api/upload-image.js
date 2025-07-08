import { getStorage } from "firebase-admin/storage";
import { getApp, getApps, initializeApp, cert } from "firebase-admin/app";
import { v4 as uuidv4 } from "uuid";

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = getStorage().bucket();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { image, fileName } = req.body;

    if (!image || !fileName) {
      return res.status(400).json({ error: "Image ou nom de fichier manquant" });
    }

    const base64EncodedImage = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64EncodedImage, "base64");

    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const destination = `blog/${Date.now()}-${sanitizedFileName}`;

    const file = bucket.file(destination);

    await file.save(buffer, {
      metadata: {
        contentType: "image/jpeg",
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