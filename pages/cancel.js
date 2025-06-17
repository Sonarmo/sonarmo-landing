// pages/cancel.js
import Link from "next/link";
import Image from "next/image";

export default function Cancel() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <header className="w-full flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
          <span className="text-lg font-semibold italic">Sonarmo</span>
        </div>
        <Link href="/" className="text-sm text-gray-300 hover:text-white">Accueil</Link>
      </header>

      <main className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold mb-4">⛔ Paiement annulé</h1>
        <p className="text-gray-400 mb-6">Ton paiement n&apos;a pas été finalisé. Tu peux réessayer à tout moment.</p>
        <Link
          href="/achat-credits"
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl"
        >
          Retour à l&apos;achat de crédits
        </Link>
      </main>

      <footer className="mt-20 text-sm text-gray-500">
        Sonarmo™
      </footer>
    </div>
  );
}