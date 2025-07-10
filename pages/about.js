// pages/about.js

import Head from "next/head";
import { Music, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Footer from "/components/layout/Footer";
import Header from "/components/layout/Header";

export default function About() {
    

    return (
        <>
        <Header />
        <div className="overflow-x-hidden bg-black text-white font-[Poppins]">
            <Head>
                <title>Sonarmo - À propos</title>
                <meta name="description" content="Découvrez la mission et la vision de Sonarmo, une expérience musicale intelligente." />
                <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
            </Head>

            <main className="min-h-screen px-6 md:px-20 relative">
                

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
        </div>
        <Footer />
        </>
    );
}
