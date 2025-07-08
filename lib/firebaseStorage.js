import { getStorage } from "firebase-admin/storage";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { FIREBASE_SERVICE_ACCOUNT_KEY } from "./firebaseAdmin"; // ou reimporte le JSON depuis process.env
import { serviceAccount } from "./firebaseAdmin";

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "sonarmo-app.appspot.com",
  });
}

export const bucket = getStorage().bucket();