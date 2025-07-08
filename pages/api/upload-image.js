// pages/api/upload-image.js

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";

// ⚙️ Firebase config minimal (ou importe depuis /lib/firebase si tu préfères)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // max image upload size
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { file, fileName } = req.body;

  if (!file || !fileName) {
    return res.status(400).json({ error: "Fichier manquant" });
  }

  try {
    const buffer = Buffer.from(file.split(",")[1], "base64");
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `blog/${Date.now()}-${sanitizedFileName}`;
    const fileRef = ref(storage, filePath);

    await uploadBytes(fileRef, buffer);
    const downloadURL = await getDownloadURL(fileRef);

    return res.status(200).json({ url: downloadURL });
  } catch (err) {
    console.error("Erreur upload image API :", err);
    return res.status(500).json({ error: "Échec de l'upload" });
  }
}