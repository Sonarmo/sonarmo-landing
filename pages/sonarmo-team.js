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
                <meta name="description" content="Rencontrez Arthur Fromont, fondateur de Sonarmo et passionné de musique." />
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

                <div className="absolute inset-0 z-0">
                    <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-0" />
                    <div className="absolute w-[600px] h-[600px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-20" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto relative z-10"
                >
                    <div className="flex justify-center mb-8">
                        <Image
                            src="/arthur-fromont.jpg"
                            alt="Arthur Fromont"
                            width={180}
                            height={180}
                            className="rounded-full shadow-lg"
                        />
                    </div>

                    <h1 className="text-3xl md:text-5xl font-semibold mb-6 text-center">Rencontrez le fondateur</h1>

                    <p className="text-lg md:text-xl leading-relaxed text-gray-300">
                        La musique a toujours été au cœur de ma vie. DJ pendant plus de 10 ans, multi-instrumentiste — guitare,
                        batterie, piano, harmonica — je compose mes propres morceaux, explorant sans cesse les émotions que le son peut faire naître.
                        Pour moi, la musique n&apos;est pas qu&apos;un fond sonore : c&apos;est une énergie, un lien invisible entre les gens,
                        un vecteur d&apos;émotions puissantes et durables.
                    </p>

                    <p className="text-lg md:text-xl mt-6 leading-relaxed text-gray-300">
                        Après un parcours international entre l&apos;Europe le Canada et l&apos;Asie, j&apos;ai voulu créer <strong>Sonarmo</strong>
                        pour rassembler tout ce qui m&apos;anime : la technologie, l&apos;art, et surtout l&apos;humain. Ce projet est né
                        d&apos;une volonté profonde de créer du lien, d&apos;apporter du bien-être, et de transformer les lieux de vie
                        en véritables expériences sensorielles.
                    </p>

                    <p className="text-lg md:text-xl mt-6 leading-relaxed text-gray-300">
                        Avec Sonarmo, j&apos;explore comment l&apos;intelligence artificielle peut enrichir notre rapport à la musique tout en
                        respectant une vision plus émotionnelle, sincère et porteuse de sens. Mon objectif ? Offrir aux lieux de vie un
                        outil qui crée des ambiances harmonieuses, cohérentes, et surtout pleines de vie.
                    </p>

                    <p className="text-xl md:text-3xl italic mt-10 text-center text-white">
                        Sonarmo, c&apos;est ma manière d&apos;apporter un peu de bonheur à travers ce que je sais faire de mieux : créer des émotions.
                    </p>

                    <div className="mt-10 flex justify-center">
                        <a
                            href="https://www.linkedin.com/in/arthur-fromont/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-[#0077B5] hover:bg-[#005582] text-white font-semibold px-6 py-3 rounded-full transition"
                        >
                            Me contacter sur LinkedIn
                        </a>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
