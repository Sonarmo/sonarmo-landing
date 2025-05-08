import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "./firebaseServiceAccount.json"; // 🔐 ton fichier sécurisé local

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}

export const db = getFirestore();
export const authAdmin = getAuth();
