import React, { useState } from 'react';
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ConditionsEtConfidentialite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="bg-black text-white min-h-screen px-6 py-10 md:px-24 md:py-16">
      <Head>
        <title>Sonarmo - Conditions d&apos;utilisation & Confidentialité</title>
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

      <h1 className="text-4xl font-bold mb-10 text-center">Conditions d&apos;utilisation & Politique de confidentialité</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">✅ Conditions Générales d’Utilisation (CGU)</h2>

        <h3 className="text-xl font-semibold mt-6 mb-2">1. Présentation du service</h3>
        <p>Sonarmo est une plateforme intelligente permettant aux professionnels de créer des ambiances musicales personnalisées via l&apos;intelligence artificielle, en se connectant à Spotify.</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">2. Acceptation des conditions</h3>
        <p>En utilisant Sonarmo, vous acceptez sans réserve les présentes Conditions Générales d’Utilisation. Elles peuvent être modifiées à tout moment.</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">3. Utilisation du service</h3>
        <ul className="list-disc ml-6">
          <li>Ne pas utiliser Sonarmo à des fins illégales ou nuisibles.</li>
          <li>Respecter les droits d’auteur liés à l’usage de musique via Spotify.</li>
          <li>Ne pas copier ou redistribuer le contenu du service.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">4. Compte utilisateur</h3>
        <p>Vous êtes responsable de la confidentialité de vos identifiants. Toute activité via votre compte est réputée effectuée par vous.</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">5. Fonctionnalités payantes</h3>
        <p>Certains services sont payants (crédits ou abonnements). Les paiements sont traités via Stripe.</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">6. Résiliation</h3>
        <p>Vous pouvez supprimer votre compte à tout moment. Sonarmo se réserve le droit de résilier un compte en cas d’abus.</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">7. Responsabilités</h3>
        <p>Sonarmo ne garantit pas une disponibilité continue du service et ne peut être tenu responsable de pertes liées à l&apos;utilisation du service.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">🔒 Politique de Confidentialité</h2>

        <h3 className="text-xl font-semibold mt-6 mb-2">1. Données collectées</h3>
        <p>Nous collectons uniquement les données nécessaires au service : nom, email, connexion Spotify, historique de playlists, paiements (via Stripe).</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">2. Utilisation des données</h3>
        <p>Les données sont utilisées pour créer votre compte, personnaliser l&apos;expérience et vous informer.</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">3. Stockage et sécurité</h3>
        <p>Les données sont stockées via Firebase. Des mesures sont prises pour garantir leur sécurité.</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">4. Partage des données</h3>
        <p>Les données ne sont jamais revendues. Elles sont partagées uniquement avec Spotify, Stripe, et Firebase si nécessaire.</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">5. Cookies</h3>
        <p>Des cookies peuvent être utilisés pour améliorer l&apos;expérience. Vous pouvez les désactiver dans votre navigateur.</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">6. Google Analytics</h3>
        <p>Nous utilisons Google Analytics (GA4) pour analyser l&apos;audience du site et améliorer l&apos;expérience utilisateur. Cet outil collecte des données anonymes de navigation (pages visitées, durée de session, type de navigateur...).</p>
        <p>Les informations générées sont transmises à Google et peuvent être stockées hors de l&apos;Union européenne. Nous avons configuré Google Analytics pour limiter le traitement des adresses IP et respecter les recommandations de la CNIL.</p>
        <p>L&apos;utilisation de Google Analytics est soumise à votre consentement. Vous pouvez accepter ou refuser le suivi lors de votre première visite sur notre site via la bannière de cookies, ou à tout moment en modifiant les paramètres de votre navigateur.</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">7. Vos droits</h3>
        <p>Conformément au RGPD, vous pouvez accéder, modifier ou supprimer vos données. Contactez-nous à <a href="mailto:arthur.fromont@sonarmo.com" className="text-blue-400 underline">arthur.fromont@sonarmo.com</a>.</p>
      </section>
    </div>
  );
}