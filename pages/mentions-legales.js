import React from 'react';
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "/components/layout/Footer";
import Header from "/components/layout/Header";

export default function MentionsLegales() {
  
  return (
    <>
    <Header />
    <div className="bg-black text-white min-h-screen px-6 py-10 md:px-5 md:py-5">
    <Head>
      <title>Mentions légales | Sonarmo</title>
      <meta name="robots" content="noindex" />
    </Head>

    

    <h1 className="text-4xl font-bold mt-10 mb-18 text-center">Mentions Légales</h1>

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
<p>
  Pour toute information relative à la collecte et au traitement de vos données, veuillez consulter notre{" "}
  <Link href="/cgu" className="text-blue-400 underline">Politique de confidentialité</Link>.
</p>      </section>
<Footer />
    </div>
    </>
  );
}