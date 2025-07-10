import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import LanguageSwitcher from "/components/builder/LanguageSwitcher";
import Footer from "/components/layout/Footer";
import Header from "/components/layout/Header";

export default function AchatCredits() {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && user.email) {
      setEmail(user.email);
    }
  }, []);

  const handleCheckout = async (priceId) => {
    const res = await fetch("/api/checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, email }), // ✅ on envoie aussi l'email
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erreur de redirection vers Stripe.");
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-black text-white flex flex-col">
      
      <main className="flex flex-col items-center flex-grow px-6 py-10">
        <h1 className="text-3xl font-bold mb-4">Recharge tes crédits Sonarmo</h1>
        <p className="mb-8 text-center text-gray-300 max-w-xl">
          Chaque playlist générée utilise 1 crédit. Choisis une formule simple ou opte pour l&apos;abonnement illimité !
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[{ credits: 2, priceId: "price_1RePM2DnUAWbLtYHPSnpISD6", price: "0,99€" }, { credits: 5, priceId: "price_1RePMeDnUAWbLtYHFqZxqpQg", price: "1,99€" }, { credits: 10, priceId: "price_1RePNDDnUAWbLtYHzWjoiiGD", price: "3,99€" }].map((offer, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-[#1c1c1c] p-6 rounded-xl text-center shadow-xl"
            >
              <h2 className="text-xl font-semibold mb-2">{offer.credits} crédit{offer.credits > 1 ? "s" : ""}</h2>
              <p className="text-gray-400 mb-4">{offer.price}</p>
              <button
                onClick={() => handleCheckout(offer.priceId)}
                className="bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90"
              >
                Acheter
              </button>
            </motion.div>
          ))}

          {/* Abonnement */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#2b2b2b] p-6 rounded-xl text-center shadow-xl border border-pink-500"
          >
            <h2 className="text-xl font-semibold mb-2">Abonnement Illimité</h2>
            <p className="text-gray-400 mb-4">4,90€ / mois</p>
            <button
              onClick={() => handleCheckout("price_1RePOBDnUAWbLtYHbk6qjT2c")}
              className="bg-pink-600 px-4 py-2 rounded-lg text-white font-medium hover:bg-pink-700"
            >
              S&apos;abonner
            </button>
          </motion.div>
        </div>
  {/* Bouton de désabonnement */}
<div className="mt-10 text-center">
  <p className="text-gray-400 mb-2 text-sm">Déjà abonné ?</p>
  <a
    href="https://billing.stripe.com/p/login/14AdR9dTVgJP6DN1Dr24000"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white-400 font-medium px-6 py-2 rounded-2xl transition-colors"
  >
    Gérer ou résilier mon abonnement
  </a>
</div>
      </main>

      
    </div>
    <Footer />
    </>
  );
}
