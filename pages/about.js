// pages/about.js

import Head from "next/head";
import { Music, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function About() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="overflow-x-hidden bg-black text-white font-[Poppins]">
            <Head>
                <title>Sonarmo - À propos</title>
                <meta name="description" content="Découvrez la mission et la vision de Sonarmo, une expérience musicale intelligente." />
                <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
            </Head>

            <main className="min-h-screen px-6 md:px-20 py-16 relative">
                {/* HEADER */}
                <header className="relative z-10 flex justify-between items-center py-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
                        <span className="text-white text-lg font-semibold italic">Sonarmo</span>
                    </Link>

                    <nav className="relative z-10 hidden md:flex gap-6 text-sm items-center">
                        <Link href="/explique-generation" className="hover:text-gray-300">GENERATEUR DE PLAYLIST</Link>
                        <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
                        <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
                        <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
                            <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
                            SE CONNECTER
                        </Link>
                    </nav>

                    {/* Mobile Nav Toggle */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </header>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="relative z-20 md:hidden px-6 py-4 bg-[#1c1c1c] shadow-lg flex flex-col gap-4 text-sm"
                        >
                            <Link href="/explique-generation" className="hover:text-gray-300">GENERATEUR DE PLAYLIST</Link>
                            <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
                            <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
                            <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
                                <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
                                SE CONNECTER
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* BACKGROUND FX */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-0" />
                    <div className="absolute w-[600px] h-[600px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-20" />
                </div>

                {/* LOGO */}
                <div className="flex justify-center items-center relative mb-10">
                    <Image
                        src="/sonarmo-experience.png"
                        alt="Sonarmo Logo"
                        width={150}
                        height={83}
                        className="object-contain"
                        priority
                    />
                </div>

                {/* CONTENU */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto relative z-10"
                >
                    <h1 className="text-3xl md:text-5xl font-semibold mb-8">À propos de Sonarmo</h1>

                    <p className="text-lg md:text-xl mb-8 leading-relaxed text-gray-300">
                        Chez <strong>Sonarmo</strong>, nous croyons que la musique n&apos;est pas un simple fond sonore —
                        c&apos;est un vecteur d&apos;émotions, un outil puissant pour créer des ambiances, influencer les comportements
                        et enrichir les expériences.
                    </p>

                    <div className="flex items-center gap-3 mb-2">
                        <Music className="text-white" />
                        <h2 className="text-xl md:text-2xl font-semibold">Notre mission</h2>
                    </div>
                    <p className="text-lg md:text-xl mb-10 leading-relaxed text-gray-300">
                        Permettre aux lieux publics (bars, cafés, hôtels, espaces de travail, maisons de retraite...) d&apos;offrir
                        une ambiance musicale intelligente, adaptée à chaque instant, grâce à une technologie mêlant IA,
                        psychologie sonore et sensibilité artistique.
                    </p>

                    <div className="flex items-center gap-3 mb-2">
                        <Globe className="text-white" />
                        <h2 className="text-xl md:text-2xl font-semibold">Notre vision</h2>
                    </div>
                    <p className="text-lg md:text-xl mb-10 leading-relaxed text-gray-300">
                        Construire un monde où chaque espace devient une expérience sensorielle,
                        où la musique joue un rôle actif dans le bien-être des personnes et le rayonnement des lieux.
                    </p>

                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="text-white" />
                        <h2 className="text-xl md:text-2xl font-semibold">Notre origine</h2>
                    </div>
                    <p className="text-lg md:text-xl mb-10 leading-relaxed text-gray-300">
                        Sonarmo est né d’une passion : celle de l&apos;art sonore et de son impact sur nos émotions, notre énergie, nos souvenirs.
                        Nous mettons la technologie au service de l’humain, pour créer des atmosphères uniques et mémorables.
                    </p>

                    <p className="text-xl md:text-3xl italic mt-10 text-center text-white">
                        Bienvenue dans l&apos;univers de l&apos;Intelligence Atmosphérique.
                    </p>
                </motion.div>
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
