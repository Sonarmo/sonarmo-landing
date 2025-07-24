import React, { useState } from 'react';
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "/components/layout/Footer";
import Header from "/components/layout/Header";

export default function ConditionsEtConfidentialite() {
  
  return (
    <>
    <Header />
    <div className="bg-black text-white min-h-screen px-6 py-10 md:px-24 md:py-16">
      <Head>
        <title>Sonarmo - Conditions d&apos;utilisation & Confidentialité</title>
        <meta name="robots" content="noindex" />
      </Head>

  

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
<p>Notre site n’utilise pas de cookies de suivi marketing ou publicitaire. Aucune donnée personnelle n’est stockée à travers des cookies.</p>

<h3 className="text-xl font-semibold mt-6 mb-2">6. Analyse d’audience avec Umami</h3>
<p>Nous utilisons <strong>Umami</strong>, un outil d’analyse d’audience respectueux de la vie privée. Il est hébergé en Europe et ne collecte aucune donnée personnelle identifiable.</p>
<p>Aucun cookie n’est utilisé, et aucune information permettant d’identifier un visiteur n’est conservée. Les données (pages consultées, durée de session, type de navigateur, etc.) sont totalement anonymisées et utilisées uniquement pour améliorer l’expérience globale du site.</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">7. Vos droits</h3>
        <p>Conformément au RGPD, vous pouvez accéder, modifier ou supprimer vos données. Contactez-nous à <a href="mailto:arthur.fromont@sonarmo.com" className="text-blue-400 underline">arthur.fromont@sonarmo.com</a>.</p>
      </section>
    </div>
    <Footer />
            </>
  );
}