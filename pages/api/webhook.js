import { buffer } from 'micro';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Initialise Firebase Admin si ce n'est pas déjà fait
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

const PRICE_CREDIT_MAPPING = {
  "price_1RYvdbDnUAWbLtYHm8e4eHjn": 1,
  "price_1RYvg0DnUAWbLtYHytj446r3": 5,
  "price_1RYvgxDnUAWbLtYHZbHwwP9K": 10,
  "price_1RYvjLDnUAWbLtYHuVqkc3vk": "abonnement",
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Méthode non autorisée');
  }

  const sig = req.headers['stripe-signature'];

  let event;
  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('❌ Erreur de validation Stripe :', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_details?.email;

    if (!email) {
      console.warn("⚠️ Email manquant dans la session");
      return res.status(400).send("Email manquant");
    }

    // Récupération des line items (obligatoire pour obtenir le price ID)
    let priceId = null;
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
      priceId = lineItems.data?.[0]?.price?.id;
    } catch (err) {
      console.error("❌ Erreur lors de la récupération des line_items :", err);
      return res.status(500).send("Erreur récupération des line items");
    }

    const creditsToAdd = PRICE_CREDIT_MAPPING[priceId];
    if (!creditsToAdd) {
      console.warn("⚠️ Price ID non reconnu :", priceId);
      return res.status(400).send("Price ID invalide");
    }

    try {
      const userSnapshot = await db.collection('users').where('email', '==', email).limit(1).get();
      if (userSnapshot.empty) {
        return res.status(404).send('Utilisateur introuvable');
      }

      const userRef = userSnapshot.docs[0].ref;
      const userData = userSnapshot.docs[0].data();

      if (creditsToAdd === "abonnement") {
        await userRef.set({ abonnementActif: true }, { merge: true });
      } else {
        const newCredits = (userData.credits || 0) + creditsToAdd;
        await userRef.set({ credits: newCredits }, { merge: true });
      }

      console.log(`✅ Crédit mis à jour pour ${email}`);
      return res.status(200).send("OK");
    } catch (err) {
      console.error("❌ Erreur Firestore :", err);
      return res.status(500).send("Erreur serveur");
    }
  }

  res.status(200).send('Événement ignoré');
}