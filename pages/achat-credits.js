import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import LanguageSwitcher from "/components/builder/LanguageSwitcher";

export default function AchatCredits() {
  const handleCheckout = async (priceId) => {
    const res = await fetch("/api/checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erreur de redirection vers Stripe.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header Sonarmo */}
      <header className="flex justify-between items-center px-6 py-4 w-full">
        <Link href="/" passHref>
  <a className="flex items-center gap-2">
    <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
    <span className="text-white text-lg font-semibold italic">Sonarmo</span>
  </a>
</Link>
        <nav className="hidden md:flex gap-6 text-sm items-center">
          <Link href="/generateur" className="hover:text-gray-300">GÉNÉRATEUR DE PLAYLIST</Link>
          <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
          <Link href="/contact" className="hover:text-gray-300">CONTACT</Link>
          <LanguageSwitcher />
        </nav>
      </header>

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

      <footer className="bg-black text-sm text-gray-400 px-6 py-10">
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-y-8 w-full">

    {/* Bloc gauche + logo FT (stacké proprement en mobile) */}
    <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6 items-center text-center sm:text-left">

      {/* Réseaux + Liens */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-center sm:justify-start gap-4">
          <a href="https://www.instagram.com/sonarmo_ia/?hl=fr" target="_blank" rel="noopener noreferrer">
            <Image src="/icons/instagram.png" alt="Instagram" width={24} height={24} />
          </a>
          <a href="https://www.linkedin.com/company/sonarmo/" target="_blank" rel="noopener noreferrer">
            <Image src="/icons/linkedin.png" alt="LinkedIn" width={24} height={24} />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61574580608705" target="_blank" rel="noopener noreferrer">
            <Image src="/icons/facebook.png" alt="Facebook" width={24} height={24} />
          </a>
        </div>
        <Link href="/sonarmo-team" className="hover:text-white">Sonarmo Team</Link>
        <Link href="/about" className="hover:text-white">À propos de nous</Link>
        <Link href="/contact" className="hover:text-white">Nous contacter</Link>
      </div>

      {/* Logo French Tech (centré sur mobile) */}
      <div className="mt-4 sm:mt-0 sm:ml-3 flex justify-center sm:justify-start">
        <Image
          src="/icons/Logo_FT.png"
          alt="Logo French Tech Est"
          width={80}
          height={80}
          className="opacity-90"
        />
      </div>

    </div>

    {/* Bloc droit = logo Sonarmo + mentions légales */}
    <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2">
      <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
      <p className="text-xs">Sonarmo™</p>
      <Link href="/cgu" className="text-sm hover:underline">Conditions d&apos;utilisation &amp; Politique de confidentialité</Link>
      <Link href="/mentions-legales" className="text-sm hover:underline">Mentions légales</Link>
      <Link href="/conditions-vente" className="text-sm hover:underline">Conditions de vente</Link>
    </div>

  </div>
</footer>
    </div>
  );
}
