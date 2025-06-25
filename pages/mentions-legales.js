import React from 'react';
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MentionsLegales() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="bg-black text-white min-h-screen px-6 py-10 md:px-5 md:py-5">
      <header className="flex justify-between items-center px-5 py-10">
  <Link href="/" className="flex items-center gap-2">
    <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
    <span className="text-white text-lg font-semibold italic">Sonarmo</span>
  </Link>
  <Head>
  <title>Mentions légales | Sonarmo</title>
  <meta name="robots" content="noindex" />
</Head>

  {/* Desktop Nav */}
  <nav className="hidden md:flex gap-6 text-sm items-center">
    <Link href="/explique-generation" className="hover:text-gray-300">GENERATEUR DE PLAYLIST</Link>
    <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
    <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
    <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
      <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
      SE CONNECTER
    </Link>
  </nav>

  {/* Mobile Nav Toggle */}
  <div className="md:hidden">
    <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu mobile">
      {isMenuOpen ? (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  </div>
</header>

{/* Mobile Nav Menu */}
<AnimatePresence>
  {isMenuOpen && (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center gap-4 pb-6 md:hidden"
    >
      <Link href="/explique-generation" className="hover:text-gray-300">GENERATEUR DE PLAYLIST</Link>
      <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
      <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
      <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
        <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
        SE CONNECTER
      </Link>
    </motion.nav>
  )}
</AnimatePresence>
      <h1 className="text-4xl font-bold mb-20 text-center">Mentions Légales</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. Éditeur du site</h2>
        <p>Le site <strong>Sonarmo</strong> est édité par :</p>
        <ul className="list-disc ml-6 mt-2">
          <li>Nom : Arthur Fromont</li>
          <li>Statut : Auto-entrepreneur</li>
          <li>SIRET : 83538853900024</li>
          <li>Adresse : 2 rue leon beaugrand, 10300 Montgueux, FRANCE</li>
          <li>Email : <a href="mailto:arthur.fromont@sonarmo.com" className="text-blue-400 underline">arthur.fromont@sonarmo.com</a></li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">2. Hébergement</h2>
        <p>Le site est hébergé par :</p>
        <ul className="list-disc ml-6 mt-2">
          <li>Vercel Inc.</li>
          <li>340 S Lemon Ave #4133</li>
          <li>Walnut, CA 91789, États-Unis</li>
          <li>Site : <a href="https://vercel.com" className="text-blue-400 underline">https://vercel.com</a></li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">3. Propriété intellectuelle</h2>
        <p>Tous les contenus du site (textes, images, logos, éléments sonores, logiciels, etc.) sont la propriété exclusive de Sonarmo, sauf mentions contraires, et sont protégés par le droit d’auteur.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">4. Responsabilité</h2>
        <p>Le site Sonarmo met tout en œuvre pour fournir des informations fiables. Toutefois, l&apos;éditeur ne peut être tenu responsable des erreurs ou omissions, ni de l&apos;usage qui pourrait être fait des informations fournies.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">5. Données personnelles</h2>
        <p>Pour toute information relative à la collecte et au traitement de vos données, veuillez consulter notre <a href="/cgu" className="text-blue-400 underline">Politique de confidentialité</a>.</p>
      </section>
    </div>
  );
}