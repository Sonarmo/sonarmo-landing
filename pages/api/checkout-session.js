// pages/api/checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { priceId } = req.body; // L’ID du produit (stripe price)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // ou 'subscription' pour un abonnement
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error", err);
    res.status(500).json({ error: 'Erreur de création de la session Stripe' });
  }
}