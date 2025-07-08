import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { imageBase64, fileName } = req.body;

  if (!imageBase64 || !fileName) {
    return res.status(400).json({ error: "Image ou nom de fichier manquant" });
  }

  try {
    const uploadRes = await cloudinary.uploader.upload(imageBase64, {
      folder: "sonarmo_blog",
      public_id: fileName.split(".")[0], // sans extension
      overwrite: true,
    });

    return res.status(200).json({ imageUrl: uploadRes.secure_url });
  } catch (error) {
    console.error("❌ Erreur Cloudinary upload:", error);
    return res.status(500).json({ error: "Échec de l'upload sur Cloudinary" });
  }
}