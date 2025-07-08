import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ✅ Recycle ou initialise Firebase uniquement côté API
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const storage = getStorage();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // augmente la taille autorisée pour le body
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { file, fileName } = req.body;

  if (!file || !fileName) {
    return res.status(400).json({ error: "Fichier ou nom manquant" });
  }

  try {
    const base64Data = file.split(",")[1]; // retire le header "data:image/..."
    const buffer = Buffer.from(base64Data, "base64");
    const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fullPath = `blog/${Date.now()}-${safeName}`;
    const storageRef = ref(storage, fullPath);

    await uploadBytes(storageRef, buffer);
    const downloadURL = await getDownloadURL(storageRef);

    return res.status(200).json({ url: downloadURL });
  } catch (err) {
    console.error("🔥 Erreur dans upload-image:", err);
    return res.status(500).json({ error: "Erreur serveur durant l'upload" });
  }
}