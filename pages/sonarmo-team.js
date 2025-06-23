// pages/team.js

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Team() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="overflow-x-hidden bg-black text-white font-[Poppins]">
      <Head>
        <title>Sonarmo - L&apos;équipe</title>
        <meta name="description" content="Page en construction." />
        <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
      </Head>

      <main className="min-h-screen px-6 md:px-20 py-16 relative">
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
              className="relative z-20 md:hidden px-6 py-4 bg-[#1c1c1c] shadow-lg flex flex-col gap-4 text-sm"
            >
              <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
              <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
              <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
                <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
                SE CONNECTER
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Effets lumineux */}
        <div className="absolute inset-0 z-0">
          <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-0" />
          <div className="absolute w-[600px] h-[600px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-20" />
        </div>

        {/* Message de construction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center justify-center text-center mt-32"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Page en construction</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl">
            Cette section est en cours de préparation. Revenez bientôt pour découvrir l&apos;équipe Sonarmo !
          </p>
        </motion.div>
      </main>
    </div>
  );
}