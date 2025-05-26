import { db, authAdmin } from "/lib/firebaseadmin";

export default async function handler(req, res) {
  try {
    // Exemple : lecture d'un document Firestore fictif
    const doc = await db.collection("test").doc("demo").get();
    const data = doc.exists ? doc.data() : null;

    // Exemple : liste des 5 premiers utilisateurs Firebase Auth
    const users = await authAdmin.listUsers(5);

    res.status(200).json({
      firestoreData: data,
      authUsers: users.users.map(u => ({ uid: u.uid, email: u.email })),
    });
  } catch (error) {
    console.error("Firebase error:", error);
    res.status(500).json({ error: error.message });
  }
}