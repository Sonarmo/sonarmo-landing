import Link from "next/link";
import Image from "next/image";

export default function Success() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between px-6 py-8">
      
      {/* Header avec logo à gauche */}
      <header className="flex justify-between items-center w-full">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image src="/sonarmo-experience.png" alt="Sonarmo Logo" width={32} height={32} />
            <span className="text-white text-lg font-semibold italic">Sonarmo</span>
          </div>
        </Link>
        <div /> {/* Pour équilibrer l'espace */}
      </header>

      {/* Contenu principal centré */}
      <main className="flex flex-col items-center justify-center text-center flex-grow">
        <h1 className="text-4xl font-bold mb-4">Merci pour ton achat</h1>
        <p className="text-gray-400 mb-6 max-w-md">
          Tes crédits ont bien été ajoutés. Tu peux maintenant créer de nouvelles playlists adaptées à ton ambiance.
        </p>
        <Link
          href="/generateur"
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition"
        >
          Accéder au générateur
        </Link>
      </main>

      {/* Footer */}
      <footer className="text-sm text-gray-500 text-center mt-16">
        © 2025 Sonarmo Team — Tous droits réservés
      </footer>
    </div>
  );
}