import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
        <div className="flex items-center gap-2">
          <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
          <span className="text-white text-lg font-semibold italic">Sonarmo</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm items-center">
          <Link href="/generateur-en" className="hover:text-gray-300">PLAYLIST GENERATOR</Link>
          <Link href="/experience-en" className="hover:text-gray-300">SONARMO PRO</Link>
          <Link href="/contact-en" className="hover:text-gray-300">CONTACT US</Link>
        </nav>
      </header>

      <main className="flex flex-col items-center flex-grow px-6 py-10">
        <h1 className="text-3xl font-bold mb-4">Recharge your Sonarmo credits</h1>
        <p className="mb-8 text-center text-gray-300 max-w-xl">
          Each generated playlist uses 1 credit. Choose a simple formula or opt for an unlimited subscription!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[{ credits: 1, priceId: "price_1RYvdbDnUAWbLtYHm8e4eHjn", price: "0,99€" }, { credits: 5, priceId: "price_1RYvg0DnUAWbLtYHytj446r3", price: "4,49€" }, { credits: 10, priceId: "price_1RYvgxDnUAWbLtYHZbHwwP9K", price: "8,49€" }].map((offer, i) => (
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
                Buy
              </button>
            </motion.div>
          ))}

          {/* Abonnement */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#2b2b2b] p-6 rounded-xl text-center shadow-xl border border-pink-500"
          >
            <h2 className="text-xl font-semibold mb-2">Unlimited subscription</h2>
            <p className="text-gray-400 mb-4">10€ / month</p>
            <button
              onClick={() => handleCheckout("price_1RYvjLDnUAWbLtYHuVqkc3vk")}
              className="bg-pink-600 px-4 py-2 rounded-lg text-white font-medium hover:bg-pink-700"
            >
              Subscribe
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer Sonarmo */}
      <footer className="bg-black text-sm text-gray-400 px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-col gap-2 mb-6 md:mb-0">
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/sonarmo_music/" target="_blank" rel="noopener noreferrer">
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
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
          <div className="flex flex-col items-end text-right gap-2">
            <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
            <p className="text-xs">©2025 Sonarmo Team. All Rights Reserved</p>
            <p className="text-xs">Terms of Use & Privacy Policy</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
