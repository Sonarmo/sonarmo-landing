import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let serviceAccount;

if (process.env.NODE_ENV === "production") {
    // 🔒 En prod : on lit depuis la variable d'environnement
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
} else {
    // 💻 En local : on utilise le fichier JSON
    serviceAccount = require("./firebaseServiceAccount.json");
}

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}

export const db = getFirestore();
export const authAdmin = getAuth();
