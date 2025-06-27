import { buffer } from 'micro';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Initialise Firebase Admin si ce n'est pas déjà fait
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
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
  "price_1RePM2DnUAWbLtYHPSnpISD6": 2,
  "price_1RePMeDnUAWbLtYHFqZxqpQg": 5,
  "price_1RePNDDnUAWbLtYHzWjoiiGD": 10,
  "price_1RePOBDnUAWbLtYHbk6qjT2c": "abonnement",
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

  // 🎯 GESTION DE L'ACHAT
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;

  let email;

  try {
    if (session.customer_details?.email) {
      email = session.customer_details.email;
    } else if (session.customer) {
      const customer = await stripe.customers.retrieve(session.customer);
      email = customer.email;
    }
  } catch (err) {
    console.error("❌ Erreur récupération email client Stripe :", err);
    return res.status(500).send("Erreur récupération email client");
  }

  if (!email) {
    console.warn("⚠️ Email manquant dans la session ou le client");
    return res.status(400).send("Email manquant");
  }

  let priceId;
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
    priceId = lineItems.data?.[0]?.price?.id;
  } catch (err) {
    console.error("❌ Erreur récupération line_items :", err);
    return res.status(500).send("Erreur récupération line items");
  }

  const creditsToAdd = PRICE_CREDIT_MAPPING[priceId];
  if (!creditsToAdd) {
    return res.status(400).send("Price ID invalide");
  }

  try {
    const userSnapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    if (userSnapshot.empty) return res.status(404).send('Utilisateur introuvable');

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

  // 🔕 GESTION DE L'ANNULATION D’ABONNEMENT
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const customerId = subscription.customer;

    try {
      const customer = await stripe.customers.retrieve(customerId);
      const email = customer.email;

      if (!email) {
        console.warn("⚠️ Email manquant pour désactivation");
        return res.status(400).send("Email manquant");
      }

      const userSnapshot = await db.collection('users').where('email', '==', email).limit(1).get();
      if (userSnapshot.empty) return res.status(404).send('Utilisateur introuvable');

      const userRef = userSnapshot.docs[0].ref;

      await userRef.set({ abonnementActif: false }, { merge: true });
      console.log(`🔕 Abonnement désactivé pour ${email}`);
      return res.status(200).send("Abonnement désactivé");
    } catch (err) {
      console.error("❌ Erreur Firestore (désabonnement) :", err);
      return res.status(500).send("Erreur serveur");
    }
  }

  res.status(200).send('Événement ignoré');
}