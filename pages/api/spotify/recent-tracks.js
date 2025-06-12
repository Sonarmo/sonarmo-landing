// Désactiver complètement pour ne pas bloquer Vercel
export default function handler(req, res) {
  res.status(200).json([]); // Renvoie une liste vide pour éviter les erreurs
}