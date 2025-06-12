import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function ExplicationGeneration() {
  return (
    <>
      <Head>
        <title>Comment ça marche ? - Sonarmo</title>
        <meta name="description" content="Découvrez comment Sonarmo génère votre playlist parfaite en quelques secondes." />
        <link rel="icon" href="/sonarmo-experience.png" />
      </Head>

      <main className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">

        {/* Fond lumineux */}
        <div className="absolute inset-0 z-0">
          <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-60" />
          <div className="absolute w-[300px] h-[300px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-50" />
        </div>

        {/* HEADER */}
        <header className="flex justify-between items-center px-6 py-4 relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
            <span className="text-white text-lg font-semibold italic">Sonarmo</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm items-center">
            <Link href="/explique-generation" className="hover:text-gray-300">GENERATEUR DE PLAYLIST</Link>
            <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
            <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
            <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
              <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
              SE CONNECTER
            </Link>
          </nav>
        </header>

        {/* CONTENU PRINCIPAL */}
        <section className="flex-grow flex items-center justify-center px-4 py-10 relative z-10">
          <div className="max-w-2xl text-center">
            <h1 className="text-4xl font-bold mb-6">Une playlist instantanée, sur-mesure</h1>
            <p className="text-lg text-gray-300 mb-8">
              Chez Sonarmo, une IA musicale analyse en temps réel votre ambiance ou votre demande pour générer une playlist Spotify unique, fluide et parfaitement adaptée.
            </p>

            <ul className="text-left text-gray-300 space-y-4 mb-10">
              <li>⚡ <strong>Instantané :</strong> Votre playlist prête en moins de 5 secondes.</li>
              <li>🎯 <strong>Personnalisé :</strong> Chaque morceau est sélectionné selon votre description.</li>
              <li>🔗 <strong>Directement sur Spotify :</strong> Écoutez, modifiez et partagez librement.</li>
              <li>🧠 <strong>IA évolutive :</strong> Elle apprend au fil de vos ambiances.</li>
            </ul>

            <Link href="/login">
              <button className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 rounded-xl text-white font-semibold hover:scale-105 transition">
                🎵 Générer ma playlist maintenant
              </button>
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-black text-sm text-gray-400 border-t border-gray-700 px-6 py-10 w-full relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex flex-col gap-2 mb-6 md:mb-0">
              <div className="flex items-center gap-4">
                <a href="https://www.instagram.com/sonarmo_music/?hl=fr" target="_blank" rel="noopener noreferrer">
                  <Image src="/icons/instagram.png" alt="Instagram" width={24} height={24} className="hover:opacity-70 transition" />
                </a>
                <a href="https://www.linkedin.com/company/sonarmo/" target="_blank" rel="noopener noreferrer">
                  <Image src="/icons/linkedin.png" alt="LinkedIn" width={24} height={24} className="hover:opacity-70 transition" />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61574580608705" target="_blank" rel="noopener noreferrer">
                  <Image src="/icons/facebook.png" alt="Facebook" width={24} height={24} className="hover:opacity-70 transition" />
                </a>
              </div>
              <Link href="/sonarmo-team" className="hover:text-white">Sonarmo Team</Link>
              <Link href="/about" className="hover:text-white">À propos de nous</Link>
              <Link href="/contact" className="hover:text-white">Nous contacter</Link>
            </div>
            <div className="flex flex-col items-end text-right gap-2">
              <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
              <p className="text-xs">&copy;2025 Sonarmo Team. Tous droits réservés</p>
              <p className="text-xs">Conditions d&apos;utilisation &amp; Politique de confidentialité</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}