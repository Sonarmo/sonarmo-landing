import React, { useState } from 'react';
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ConditionsVente() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="bg-black text-white min-h-screen px-6 py-10 md:px-24 md:py-16">
      <Head>
        <title>Conditions Générales de Vente | Sonarmo</title>
        <meta name="robots" content="noindex" />
      </Head>

      <header className="flex justify-between items-center px-5 py-10">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
          <span className="text-white text-lg font-semibold italic">Sonarmo</span>
        </Link>

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

      <h1 className="text-4xl font-bold mb-10 text-center">Conditions Générales de Vente</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">1. Objet</h2>
        <p>Les présentes conditions régissent les ventes de services (génération de playlists, crédits, abonnements) proposés sur le site <strong>Sonarmo</strong>.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">2. Offres et tarifs</h2>
        <p>Les prix sont indiqués en euros toutes taxes comprises (TTC). Sonarmo se réserve le droit de modifier ses prix à tout moment, mais les services sont facturés sur la base des tarifs en vigueur au moment de l’achat.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">3. Paiement</h2>
        <p>Le paiement s&apos;effectue via la plateforme sécurisée Stripe. Aucune donnée bancaire n’est stockée par Sonarmo.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">4. Accès au service</h2>
        <p>Après validation du paiement, l&apos;accès au service est immédiat. Aucun support physique n&apos;est fourni.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">5. Droit de rétractation</h2>
        <p>Conformément à l&apos;article L221-28 du Code de la consommation, le droit de rétractation ne s&apos;applique pas aux contenus numériques exécutés immédiatement après l&apos;achat, avec l&apos;accord du client.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">6. Réclamations et remboursements</h2>
        <p>Pour toute réclamation, contactez <a href="mailto:arthur.fromont@sonarmo.com" className="text-blue-400 underline">arthur.fromont@sonarmo.com</a>. Aucun remboursement ne sera accordé pour les contenus numériques consommés immédiatement.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">7. Responsabilité</h2>
        <p>Sonarmo ne saurait être tenu responsable des dommages indirects liés à l&apos;usage du service. L&apos;utilisateur est seul responsable des données qu&apos;il fournit.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">8. Droit applicable</h2>
        <p>Les présentes CGV sont régies par le droit français. En cas de litige, une solution amiable sera privilégiée. À défaut, les tribunaux compétents seront ceux du ressort du siège de l&apos;auto-entrepreneur.</p>
      </section>
    </div>
  );
}