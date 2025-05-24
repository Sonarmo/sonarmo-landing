import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let serviceAccount;

if (process.env.NODE_ENV === "production") {
    // Ne fais PAS de JSON.parse ici si tu as déjà parsé ailleurs
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
} else {
    serviceAccount = require("./firebaseServiceAccount.json");
}

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}

export const db = getFirestore();
export const authAdmin = getAuth();
