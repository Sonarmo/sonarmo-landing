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
                <title>L’expérience Sonarmo</title>
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

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-6 text-sm items-center">
                        <Link href="/experience" className="hover:text-gray-300">L’EXPÉRIENCE SONARMO</Link>
                        <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
                        <Link href="#login" className="hover:text-gray-300 flex items-center gap-1">
                            <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
                            SE CONNECTER
                        </Link>
                    </nav>

                    {/* Mobile Nav Toggle */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </header>

                {/* Mobile Nav Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="md:hidden px-6 py-4 bg-[#1c1c1c] shadow-lg flex flex-col gap-4 text-sm z-50"
                        >
                            <Link href="/experience" className="hover:text-gray-300">L’EXPÉRIENCE SONARMO</Link>
                            <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
                            <Link href="#login" className="hover:text-gray-300 flex items-center gap-1">
                                <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
                                SE CONNECTER
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* SECTION - LE CONCEPT */}
                <section className="py-16">
                    <h2 className="text-3xl font-semibold text-center mb-12">Le concept</h2>
                    <div className="space-y-10 max-w-5xl mx-auto">
                        <div className="flex items-center gap-6">
                            <Image src="/icons/AI.png" alt="AI" width={92} height={92} />
                            <p className="text-gray-300">Ambiance propulsée par IA : sélection musicale en fonction du lieu, de l’heure, du type de clientèle…</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <Image src="/icons/cible.png" alt="Cible" width={92} height={92} />
                            <p className="text-gray-300">Identité sonore sur mesure : la musique reflète la personnalité du lieu et son univers.</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <Image src="/icons/pouce.png" alt="Pouce" width={92} height={92} />
                            <p className="text-gray-300">Facile à utiliser : Contrôles complet depuis un tableau de bord simple et intuitif.</p>
                        </div>
                    </div>
                </section>

                {/* SECTION - PERSONNALISATION */}
                <section className="py-16 text-center">
                    <h2 className="text-3xl font-semibold mb-4">Personnalisation en temps réel</h2>
                    <p className="text-gray-400 max-w-xl mx-auto mb-8">
                        Ajustez l’énergie musicale, le volume et l’ambiance selon l’instant. L’interface mobile vous permet de créer ou régénérer une playlist à tout moment.
                    </p>
                    <div className="flex justify-center">
                        <Image src="/iphone.png" alt="Contrôle mobile" width={300} height={600} />
                    </div>
                </section>

                {/* SECTION - SUIVI */}
                <section className="py-16 text-center">
                    <h2 className="text-3xl font-semibold mb-4">Suivi et optimisation</h2>
                    <p className="text-gray-400 max-w-xl mx-auto mb-8">
                        Analysez l’impact de votre ambiance sonore avec des données claires. Repérez les moments où la musique attire le plus l’attention et booste l’expérience client.
                    </p>
                    <div className="flex justify-center">
                        <Image src="/Mockup mac.png" alt="Dashboard Sonarmo" width={800} height={500} />
                    </div>
                </section>

                {/* SECTION - CATALOGUE */}
                <section className="relative py-16 overflow-hidden">
                    <div className="absolute left-0 top-0 w-[300px] h-[300px] bg-[#1DB954] rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 z-0" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto px-4">
                        <div className="text-left">
                            <h3 className="text-2xl font-semibold text-white mb-2">Spotify friendly</h3>
                            <div className="text-white text-5xl font-light">+ 100</div>
                            <div className="text-gray-300 text-sm">millions de titres accessibles</div>
                        </div>
                        <div className="text-left max-w-md">
                            <h4 className="text-white font-semibold text-lg mb-2">Accédez à toute la musique de Spotify</h4>
                            <p className="text-gray-400">
                                Connectez votre compte en un clic et profitez de l’intégralité du catalogue Spotify, directement intégré à la plateforme Sonarmo.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 text-center">
                    <Link href="/contact">
                        <button className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-8 py-4 rounded-full text-white font-semibold shadow-md">
                            ON S&apos;APPELLE ?
                        </button>
                    </Link>
                </section>

                {/* FOOTER */}
                <footer className="bg-[#121212] text-sm text-gray-400 border-t border-gray-700 px-6 py-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex flex-col gap-2 mb-6 md:mb-0">
                            <div className="flex items-center gap-4">
                                <a href="https://www.instagram.com/sonarmo_music/?hl=fr" target="_blank" rel="noopener noreferrer">
                                    <Image src="/icons/instagram.png" alt="Instagram" width={24} height={24} className="hover:opacity-70 transition" />
                                </a>
                                <a href="https://www.linkedin.com/company/sonarmo/" target="_blank" rel="noopener noreferrer">
                                    <Image src="/icons/linkedin.png" alt="LinkedIn" width={24} height={24} className="hover:opacity-70 transition" />
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=61574580608705" target="_blank" rel="noopener noreferrer">
                                    <Image src="/icons/facebook.png" alt="Facebook" width={24} height={24} className="hover:opacity-70 transition" />
                                </a>
                            </div>
                            <p>Sonarmo Team</p>
                            <Link href="/" className="hover:text-white">A propos de nous</Link>
                            <Link href="/contact" className="hover:text-white">Nous contacter</Link>
                        </div>
                        <div className="flex flex-col items-end text-right gap-2">
                            <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
                            <p className="text-xs">&copy;2025 Sonarmo Team. All Rights Reserved</p>
                            <p className="text-xs">Terms of Use &amp; Privacy Policy</p>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}
