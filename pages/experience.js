import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Experience() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <Head>
                <title>L&apos;expérience Sonarmo</title>
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <main className="bg-[#121212] text-white font-[Poppins] min-h-screen px-6">
                {/* HEADER */}
                <header className="flex justify-between items-center px-6 py-4">
                    <Link href="/">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Image src="/Logo-app-header.png" alt="Logo" width={140} height={30} />
                        </div>
                    </Link>

                    <nav className="hidden md:flex gap-6 text-sm items-center">
                        <Link href="/experience" className="hover:text-gray-300">L&apos;EXPÉRIENCE SONARMO</Link>
                        <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
                        <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
                            <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
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
                            className="md:hidden px-6 py-4 bg-[#1c1c1c] shadow-lg flex flex-col gap-4 text-sm z-50"
                        >
                            <Link href="/experience" className="hover:text-gray-300">L&apos;EXPÉRIENCE SONARMO</Link>
                            <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
                            <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
                                <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
                                SE CONNECTER
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* SECTION - LE CONCEPT */}
                <motion.section
                    className="py-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-semibold text-center mb-12">
                        Transformez l&apos;ambiance de votre lieu en un instant avec Sonarmo
                    </h2>
                    <div className="max-w-5xl mx-auto space-y-10">
                        <div className="flex justify-between gap-12">
                            {/* Premier bloc */}
                            <div className="flex flex-col items-center gap-4">
                                <Image src="/icons/AI.png" alt="IA" width={92} height={92} />
                                <p className="text-gray-300 text-base leading-relaxed text-center">
                                    <strong className="text-white">Ambiance intelligente</strong> : Notre IA adapte la musique au lieu, à l&apos;heure, à l&apos;énergie et à la clientèle en temps réel.
                                </p>
                            </div>
                            {/* Deuxième bloc */}
                            <div className="flex flex-col items-center gap-4">
                                <Image src="/icons/cible.png" alt="Cible" width={92} height={92} />
                                <p className="text-gray-300 text-base leading-relaxed text-center">
                                    <strong className="text-white">Identité sonore unique</strong> : chaque lieu dispose d&apos;une ambiance musicale cohérente avec son image et ses clients.
                                </p>
                            </div>
                            {/* Troisième bloc */}
                            <div className="flex flex-col items-center gap-4">
                                <Image src="/icons/pouce.png" alt="Pouce" width={92} height={92} />
                                <p className="text-gray-300 text-base leading-relaxed text-center">
                                    <strong className="text-white">Contrôle simple</strong> : depuis un tableau de bord intuitif, gère ta musique en quelques clics.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>



                {/* SECTION - CIBLE */}
                <motion.section
                    className="py-16 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-semibold text-white mb-8">
                        À qui s&apos;adresse Sonarmo ?
                    </h2>
                    <p className="text-gray-300 text-base leading-relaxed max-w-2xl mx-auto mb-6">
                        Sonarmo est conçu pour tous les lieux souhaitant créer une ambiance musicale sur mesure, en toute simplicité.
                        Peu importe l&apos;atmosphère que vous désirez, Sonarmo s&apos;adapte et optimise la musique pour que votre espace prenne vie.
                    </p>
                    <p className="text-base text-white font-semibold max-w-2xl mx-auto">
                        Sonarmo s&apos;adapte à votre espace :
                        <br />
                        <span className="font-semibold text-[#FCE2BA]">Bars, cafés, restaurants, coworkings, concept stores,</span>
                        <br />
                        peu importe votre univers, nous créons l&apos;ambiance idéale. Vous choisissez l&apos;atmosphère, et Sonarmo prend tout en charge.
                    </p>



                </motion.section>


                {/* SECTION - PERSONNALISATION */}
                <motion.section
                    className="py-10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2 text-center md:text-left">
                            <h2 className="text-3xl font-semibold mb-4">Contrôle en temps réel</h2>
                            <p className="text-gray-300 text-base leading-relaxed">
                                Adapte instantanément l&apos;énergie musicale selon l&apos;heure, la météo ou l&apos;ambiance. Depuis ton téléphone, tu peux générer ou changer de playlist en quelques secondes.
                            </p>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <Image src="/iphone.png" alt="Contrôle mobile" width={200} height={450} />
                        </div>
                    </div>
                </motion.section>

                {/* SECTION - SUIVI */}
                <motion.section
                    className="py-10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2 flex justify-center">
                            <Image src="/Mockup mac.png" alt="Dashboard Sonarmo" width={500} height={300} />
                        </div>
                        <div className="md:w-1/2 text-center md:text-left">
                            <h2 className="text-3xl font-semibold mb-4">Analyse & optimisation</h2>
                            <p className="text-gray-300 text-base leading-relaxed">
                                Visualise l&apos;impact de ta programmation sonore grâce à des données claires. Identifie les moments forts et ajuste l&apos;ambiance pour une meilleure fidélisation.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* SECTION - CATALOGUE */}
                <motion.section
                    className="relative min-h-[400px] md:min-h-[500px] flex items-center overflow-hidden py-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="absolute left-1/2 top-1/2 w-[300px] h-[300px] bg-[#2FD668] rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2 z-0"
                        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -20, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto px-4">
                        <div className="text-left">
                            <h3 className="text-2xl font-semibold text-white mb-2">Connecté à Spotify</h3>
                            <div className="text-white text-5xl font-light">+100</div>
                            <div className="text-gray-300 text-sm">millions de titres disponibles</div>
                        </div>
                        <div className="text-left max-w-md">
                            <h4 className="text-white font-semibold text-lg mb-2">Toute la musique, sans limite</h4>
                            <p className="text-gray-300 text-base leading-relaxed">
                                Connecte ton compte Spotify et accède à l&apos;intégralité de son catalogue, directement depuis la plateforme Sonarmo. Zéro friction, 100% fluide.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* CTA */}
                <motion.section
                    className="py-20 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                >
                    <Link href="/contact">
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-8 py-4 rounded-full text-white font-semibold shadow-md cursor-pointer"
                        >
                            ON S&apos;APPELLE ?
                        </motion.button>
                    </Link>

                </motion.section>

                {/* FOOTER */}
                <footer className="bg-[#121212] text-sm text-gray-400 border-t border-gray-700 px-6 py-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex flex-col gap-2 mb-6 md:mb-0">
                            <div className="flex items-center gap-4">
                                <a href="https://www.instagram.com/sonarmo_music/?hl=fr" target="_blank" rel="noopener noreferrer">
                                    <Image src="/icons/instagram.png" alt="Instagram" width={24} height={24} />
                                </a>
                                <a href="https://www.linkedin.com/company/sonarmo/" target="_blank" rel="noopener noreferrer">
                                    <Image src="/icons/linkedin.png" alt="LinkedIn" width={24} height={24} />
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=61574580608705" target="_blank" rel="noopener noreferrer">
                                    <Image src="/icons/facebook.png" alt="Facebook" width={24} height={24} />
                                </a>
                            </div>
                            <p>Sonarmo Team</p>
                            <Link href="/" className="hover:text-white">À propos de nous</Link>
                            <Link href="/contact" className="hover:text-white">Nous contacter</Link>
                        </div>
                        <div className="flex flex-col items-end text-right gap-2">
                            <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
                            <p className="text-xs">&copy;2025 Sonarmo Team. Tous droits réservés</p>
                            <p className="text-xs">Conditions d&apos;utilisation &amp; Politique de confidentialité</p>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}
