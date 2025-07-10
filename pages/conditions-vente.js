import React, { useState } from 'react';
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "/components/layout/Footer";
import Header from "/components/layout/Header";

export default function ConditionsVente() {
  
  return (
    <>
            <Header />
    <div className="bg-black text-white min-h-screen px-6 py-10 md:px-24 md:py-16">
      <Head>
        <title>Sonarmo - Conditions Générales de Vente</title>
        <meta name="robots" content="noindex" />
      </Head>


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
    <Footer />
    </>
  );
}