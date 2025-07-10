import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeaderLabelPage from "/components/builder/HeaderLabelPage";
import TiltedCard from "/components/builder/TiltedCard"; // sans .module.css


export default function LabelPage() {
    
  return (
    <>
      <Head>
        <title>Atmosphère Respectueuse – Label Sonarmo</title>
        <meta name="description" content="Découvrez le label Atmosphère Respectueuse proposé par Sonarmo pour valoriser les lieux soucieux de leur environnement sonore." />
      </Head>
<HeaderLabelPage />
      <main className="bg-white min-h-screen px-6 py-12 text-gray-800">
<div className="max-w-[700px] w-full mx-auto px-4 sm:px-6 md:px-8">
    <div className="mb-8">
          <TiltedCard
          imageSrc="/images/label-atmosphere-respectueuse.png"
          altText="Label Atmosphère Respectueuse"
          captionText="Label exclusif Sonarmo"
          imageHeight="300px"
          imageWidth="300px"
          containerHeight="320px"
          containerWidth="100%"
          scaleOnHover={1.05}
          rotateAmplitude={12}
          showMobileWarning={false}
          showTooltip={true}
        /></div>

          {/* Titre */}
          <h1 className="text-3xl font-bold mb-6 text-center">
            Atmosphère Respectueuse
          </h1>

          {/* Intro */}
          <p className="text-lg mb-8 text-center">
            Sonarmo s’engage pour un monde sonore plus doux. Le label <strong>“Atmosphère Respectueuse”</strong> met en valeur les lieux qui prennent soin du bien-être auditif de leurs clients.
          </p>

          {/* Critères */}
          <div className="text-left bg-blue-50 border border-blue-100 rounded-xl p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4">Critères du label :</h2>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Ambiance sonore apaisée</li>
              <li>Respect des personnes sensibles (hyperesthésie, neuroatypie, etc.)</li>
              <li>Sans publicité audio intrusive</li>
              <li>Volume sonore maîtrisé en toute situation</li>
              <li>Personnel sensibilisé au confort auditif</li>
            </ul>
          </div>

          {/* Pourquoi c’est important */}
          <h2 className="text-xl font-semibold mb-2 text-center">Pourquoi ce label ?</h2>
          <p className="mb-8 text-center">
            Le bruit excessif est source de stress, de fatigue et nuit à l’expérience client. Offrir une atmosphère sonore respectueuse, c’est créer un lieu de bien-être et de qualité de vie.
          </p>

          {/* Appel à action */}
          <div className="text-center">
          <Link
  href="/contact"
  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition text-center"
>
  Devenir un lieu labellisé
</Link>
</div>
        </div>
      </main>
    </>
  );
}