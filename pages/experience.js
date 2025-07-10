// Page améliorée de l'expérience Sonarmo avec visuels dynamiques, animations et contenu optimisé

import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BarChart2, MessageSquare, Repeat, Target, Activity, Fingerprint, ChartLine, Cross, UserPlus } from "lucide-react";
import Footer from "/components/layout/Footer";
import Header from "/components/layout/Header";

export default function Experience() {
    

    return (
        <>
        <Header />
            <Head>
                <title>Sonarmo - Sonarmo Pro</title>
                <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
            </Head>
            <main className="bg-black text-white overflow-x-hidden min-h-screen px-0">

                

                {/* SECTION - HERO */}
                <section className="relative py-22 bg-black text-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute w-[200px] h-[200px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-40" />
                        <div className="absolute w-[200px] h-[200px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-20" />
                    </div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h1 className="text-5xl font-bold mb-6">Sonarmo Pro</h1>
                        <p className="text-gray-300 text-lg">
                            Une ambiance musicale intelligente, unique à chaque lieu. La bonne musique, au bon moment, pour faire vibrer votre espace.
                        </p>
                    </div>
                
                    <motion.img
                        src="/sonarmo-experience.png"
                        alt="Logo Sonarmo"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="mx-auto mt-10 w-50 h-auto drop-shadow-[0_0_15px_rgba(255,0,255,0.4)]"
                    />


                </section>

                <motion.section
                    className="relative py-20 bg-black text-center px-4 overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    {/* Background effects */}
                    <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-0 left-1/3 opacity-10 z-0" />
                    <div className="absolute w-[300px] h-[300px] bg-[#FF00FF] rounded-full blur-[100px] bottom-20 right-1/4 opacity-20 z-0" />

                    {/* Content */}
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold mb-6">Une ambiance peut tout changer. Mais elle est souvent négligée.</h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Trop de lieux laissent la musique tourner en fond, sans cohérence ni intention.
                            Résultat : une atmosphère impersonnelle, une clientèle moins engagée… et une opportunité manquée.
                        </p>
                        <p className="text-gray-300 text-lg mt-6">
                            Parce qu&apos;une bonne ambiance ne se choisit pas sur une playlist par défaut.
                            Elle se crée, s&apos;adapte, vit avec votre lieu.
                        </p>
                        <p className="italic text-[#FCE2BA] mt-10">
                            “L&apos;ambiance est invisible, mais elle change tout.”
                        </p>
                    </div>
                </motion.section>



                {/* SECTION - SIGNATURE SONORE */}
                <motion.section className="relative py-20 bg-black" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                    <div className="absolute inset-0 z-0">
                        <div className="absolute w-[300px] h-[300px] bg-[#FF00FF] rounded-full blur-[100px] opacity-15 top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="relative z-10 max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2 md:pl-8 text-center md:text-left">
                            <h2 className="text-4xl font-bold mb-6">Votre signature sonore</h2>
                            <p className="text-gray-300 text-base leading-relaxed mb-6">
                                Sonarmo vous aide à construire une identité musicale forte, alignée avec votre image, vos valeurs et votre clientèle.
                            </p>
                            <p className="italic text-[#FCE2BA]">
                                “Les clients ne se souviendront peut-être pas de la chanson. Mais ils se souviendront de comment ils se sont sentis chez vous.”
                            </p>
                        </div>
                        <div className="md:w-1/2 md:pr-8 flex justify-end">
                            <Image src="/forme-signature.png" alt="Signature sonore visuelle" width={400} height={400} className="shadow-none" />
                        </div>
                    </div>
                </motion.section>

                <motion.section
                    className="py-20 text-center bg-black px-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                >
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold mb-10">Ce que Sonarmo change pour vous</h2>
                        <div className="grid md:grid-cols-2 gap-12 text-left">
                            <div className="flex gap-4 items-start">
                                <Activity className="text-[#F28500] w-20 h-20 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Une ambiance toujours juste</h3>
                                    <p className="text-gray-300">
                                        L&apos;IA de Sonarmo s&apos;ajuste à l&apos;heure, l&apos;énergie, la météo et la clientèle. Elle évolue en temps réel, sans intervention.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <Target className="text-[#F28500] w-20 h-20 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Moins de gestion, plus de focus</h3>
                                    <p className="text-gray-300">
                                        Plus besoin de choisir ou surveiller la musique. Vous vous concentrez sur l&apos;essentiel : votre service, vos clients.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <Fingerprint className="text-[#F28500] w-20 h-20 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Une identité sonore unique</h3>
                                    <p className="text-gray-300">
                                        Sonarmo construit une ambiance fidèle à votre lieu, votre marque, vos valeurs.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <ChartLine className="text-[#F28500] w-20 h-20 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Des résultats mesurables</h3>
                                    <p className="text-gray-300">
                                        Suivez l&apos;impact de vos choix sonores sur la fréquentation, les retours clients et la fidélisation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>


                {/* SECTION - TEMPS RÉEL */}
                <motion.section className="py-5 bg-black" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 px-4">
                        <div className="md:w-1/2 flex justify-center">
                            <Image src="/logoia.png" alt="Logo IA" width={500} height={300} />
                        </div>
                        <div className="md:w-1/2 text-center md:text-left">
                            <h2 className="text-3xl font-semibold mb-4">La bonne musique, au bon moment</h2>
                            <p className="text-gray-300 text-base leading-relaxed">
                                Notre IA musicale ajuste la programmation selon l&apos;heure, la météo, la clientèle et l’énergie du lieu. Elle évolue en temps réel pour suivre votre rythme, et non l’inverse.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* SECTION - UNICITÉ (nouvelle version personnalisée) */}
                <motion.section className="py-20 bg-black" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                    <div className="max-w-6xl mx-auto flex flex-col gap-16 px-4">
                        <div className="text-center md:text-left md:flex md:items-center md:gap-12">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-semibold mb-4">Vous gardez le contrôle. Sonarmo fait le reste.</h2>
                                <p className="text-gray-300 text-base leading-relaxed">
                                    Sonarmo prend en charge l&apos;ambiance de votre lieu en s&apos;adaptant en temps réel, mais vous restez maître de chaque détail.
                                    Depuis le dashboard, vous pouvez générer, ajuster ou changer l&apos;ambiance à tout moment, en un clic.
                                </p>
                            </div>
                            <div className="md:w-1/2 flex justify-center">
                                <Image src="/Mockup mac.png" alt="Dashboard Sonarmo sur Mac" width={500} height={300} />
                            </div>
                        </div>
                        <div className="text-center md:text-left md:flex md:items-center md:gap-12 md:flex-row-reverse">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-semibold mb-4">Toujours dans votre poche.</h2>
                                <p className="text-gray-300 text-base leading-relaxed">
                                    Accédez à Sonarmo depuis votre téléphone pour changer d&apos;ambiance en quelques secondes. Une interface simple, conçue pour être utilisée sur le terrain, au moment où ça compte.
                                </p>
                            </div>
                            <div className="md:w-1/2 flex justify-center">
                                <Image src="/iphone.png" alt="Contrôle Sonarmo sur iPhone" width={150} height={300} />
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* SECTION - DONNÉES */}
                <motion.section className="py-20 bg-black" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                    <div className="max-w-5xl mx-auto px-4 text-center">
                        <h2 className="text-3xl font-semibold mb-6">Données & impact mesurable</h2>
                        <p className="text-gray-300 text-base max-w-2xl mx-auto mb-8">
                            Accédez à des analyses précises depuis votre dashboard pour optimiser vos ambiances musicales.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left max-w-4xl mx-auto">
                            <div className="flex gap-4 items-start">
                                <UserPlus className="text-[#F28500] w-15 h-15 mt-5" />
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Puissance d&apos;attraction</h3>
                                    <p className="text-gray-300">Mesurez la capacité de chaque ambiance à capter l&apos;attention et à faire revenir vos clients.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <Cross className="text-[#F28500] w-25 h-25 mt-4" />
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Analyses croisées</h3>
                                    <p className="text-gray-300">Croisez vos données musicales avec vos indicateurs de vente pour révéler les ambiances qui favorisent le chiffre d&apos;affaires et l&apos;engagement client.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <BarChart2 className="text-[#F28500] w-10 h-10 mt-4" />
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Performances musicales</h3>
                                    <p className="text-gray-300">Identifiez les titres et styles qui fonctionnent le mieux.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <Target className="text-[#F28500] w-10 h-10 mt-4" />
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Tests & ajustements</h3>
                                    <p className="text-gray-300">Expérimentez différents moods et mesurez leur efficacité.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>


                {/* SECTION - CATALOGUE */}
                <motion.section
                    className="relative min-h-[400px] md:min-h-[500px] flex items-center overflow-hidden py-20 bg-black"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="absolute left-1/4 top-1/2 w-[200px] h-[200px] bg-[#2FD668] rounded-full blur-3xl opacity-80 -translate-x-1/2 -translate-y-1/2 z-0"
                        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -20, 0] }}
                        transition={{ duration: 0, repeat: Infinity, ease: "easeInOut" }}
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
                                Connectez votre compte Spotify et accédez à l&apos;intégralité de son catalogue, directement depuis la plateforme Sonarmo.
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
            </main>
            <Footer />
        </>
    );
}
