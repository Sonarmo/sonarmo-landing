import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Zap, Target, Link as LinkIcon, Brain } from "lucide-react";
import LanguageSwitcher from "/components/builder/LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "/components/layout/Footer";

export default function ExplicationGeneration() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Comment ça marche ? - Sonarmo</title>
        <meta name="description" content="Découvrez comment Sonarmo génère votre playlist parfaite en quelques secondes." />
        <link rel="icon" href="/sonarmo-experience.png" />
      </Head>

      <main className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">

        {/* Fond lumineux */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-60" />
          <div className="absolute w-[300px] h-[300px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-50" />
        </div>

        {/* HEADER */}
        <header className="flex justify-between items-center px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
            <span className="text-white text-lg font-semibold italic">Sonarmo</span>
          </Link>

          <nav className="hidden md:flex gap-6 text-sm items-center">
            <Link href="/explique-generation" className="hover:text-gray-300">GENERATEUR DE PLAYLIST</Link>
            <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
            <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
            <Link href="/blog" className="hover:text-gray-300">BLOG</Link>
            <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
              <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
              SE CONNECTER
            </Link>
            <LanguageSwitcher />
          </nav>

          {/* Mobile burger menu */}
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

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden px-6 py-4 bg-black shadow-lg flex flex-col gap-4 text-sm z-[60] pointer-events-auto"
            >
              <Link href="/explique-generation" className="hover:text-gray-300">GENERATEUR DE PLAYLIST</Link>
              <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
              <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
              <Link href="/blog" className="hover:text-gray-300">BLOG</Link>
              <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
                <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
                SE CONNECTER
              </Link>
              <LanguageSwitcher />
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENU PRINCIPAL */}
        
        <section className="flex-grow flex flex-col items-center justify-center px-4 py-15 relative z-10 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-white">Générateur </span>
            <span className="text-[#FCE2BA]">Atmosphérique</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Chaque playlist Sonarmo se construisent avec notre Intelligence Atmospherique capable de lire votre ambiance, vos besoins, et de transformer l&apos;instant en une expérience sonore mémorable.
          </motion.p>

          <motion.div
            className="bg-[#1c1c1c] p-6 md:p-10 rounded-xl shadow-lg max-w-3xl w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <ul className="text-left text-gray-300 space-y-6 mb-10">
  <li className="flex items-center gap-5">
    <Zap className="text-orange-400 mt-1" size={40} />
    <span><strong>Instantané :</strong> Votre playlist prête en moins de 5 secondes.</span>
  </li>
  <li className="flex items-center gap-5">
    <Target className="text-pink-400 mt-1" size={40} />
    <span><strong>Personnalisé :</strong> Chaque morceau est sélectionné selon votre description.</span>
  </li>
  <li className="flex items-center gap-5">
  <LinkIcon className="text-purple-400 mt-1" size={40} />
  <span>
    <strong>Playlist disponible sur Spotify :</strong> Un lien immédiat pour écouter et partager votre ambiance.
  </span>
</li>
  <li className="flex items-center gap-5">
    <Brain className="text-blue-400 mt-1" size={40} />
    <span><strong>IA évolutive :</strong> Elle apprend au fil de vos ambiances.</span>
  </li>
</ul>

            <div className="mt-10 text-center">
              <Link href="/login">
                <button className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-8 py-3 rounded-full text-white font-semibold text-lg hover:scale-105 transition">
                  Générer ma playlist maintenant
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        <Footer />
      </main>
    </>
  );
}