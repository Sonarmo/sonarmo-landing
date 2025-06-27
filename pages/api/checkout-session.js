import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const VALID_PRICE_IDS = {
  one: 'price_1RePM2DnUAWbLtYHPSnpISD6',
  five: 'price_1RePMeDnUAWbLtYHFqZxqpQg',
  ten: 'price_1RePNDDnUAWbLtYHzWjoiiGD',
  subscription: 'price_1RePOBDnUAWbLtYHbk6qjT2c',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { priceId, email } = req.body; // ✅ email récupéré ici

  if (!Object.values(VALID_PRICE_IDS).includes(priceId)) {
    return res.status(400).json({ error: 'ID de prix non valide' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: priceId === VALID_PRICE_IDS.subscription ? 'subscription' : 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      customer_creation: 'always',
      ...(email && { customer_email: email }) // ✅ facultatif mais inclus si dispo
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe error :', err);
    return res.status(500).json({ error: 'Erreur de création de la session Stripe' });
  }
}