// Page améliorée de l'expérience Sonarmo avec visuels dynamiques, animations et contenu optimisé

import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BarChart2, MessageSquare, Repeat, Target, Activity, Fingerprint, ChartLine, Cross, UserPlus } from "lucide-react";

export default function Experience() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <Head>
                <title>Sonarmo Experience</title>
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
                    rel="stylesheet"
                />
                <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
            </Head>
            <main className="bg-black text-white font-[Poppins] min-h-screen px-0">

                {/* HEADER */}
                <header className="flex justify-between items-center px-6 py-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
                        <span className="text-white text-lg font-semibold italic">Sonarmo</span>
                    </Link>
               


                    <nav className="hidden md:flex gap-6 text-sm items-center">
                        <Link href="/experience-en" className="hover:text-gray-300">SONARMO EXPERIENCE</Link>
                        <Link href="/contact-en" className="hover:text-gray-300">CONTACT US</Link>
                        <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
                            <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
                            LOGIN
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
                            className="md:hidden px-6 py-4 bg-black shadow-lg flex flex-col gap-4 text-sm z-50"
                        >
                            <Link href="/experience-en" className="hover:text-gray-300">SONARMO EXPERIENCE</Link>
                            <Link href="/contact-en" className="hover:text-gray-300">CONTACT US</Link>
                            <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
                                <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
                                LOGIN
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* SECTION - HERO */}
                <section className="relative py-22 bg-black text-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute w-[200px] h-[200px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-40" />
                        <div className="absolute w-[200px] h-[200px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-20" />
                    </div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h1 className="text-5xl font-bold mb-6">Sonarmo Experience</h1>
                        <p className="text-gray-300 text-lg">
                            An intelligent musical atmosphere, unique to each place. The right music at the right time to make your space vibrate.
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
                        <h2 className="text-4xl font-bold mb-6">An atmosphere can change everything. But it is often overlooked.</h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Too many places let the music run in the background, without coherence or intention.
                            Result: an impersonal atmosphere, a less engaged clientele... and a missed opportunity.
                        </p>
                        <p className="text-gray-300 text-lg mt-6">
                            Because a good mood is not chosen from a default playlist.
                            It is created, adapts, lives with your place.
                        </p>
                        <p className="italic text-[#FCE2BA] mt-10">
                            “The atmosphere is invisible, but it changes everything.”
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
                            <h2 className="text-4xl font-bold mb-6">Your signature sound</h2>
                            <p className="text-gray-300 text-base leading-relaxed mb-6">
                                Sonarmo helps you build a strong musical identity, aligned with your image, values and customers.
                            </p>
                            <p className="italic text-[#FCE2BA]">
                                “Customers may not remember the song, but they will remember how they felt at home.”
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
                        <h2 className="text-4xl font-bold mb-10">What Sonarmo changes for you</h2>
                        <div className="grid md:grid-cols-2 gap-12 text-left">
                            <div className="flex gap-4 items-start">
                                <Activity className="text-[#F28500] w-20 h-20 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">An atmosphere always just</h3>
                                    <p className="text-gray-300">
                                        Sonarmo&apos;s AI is adjusted to time, energy, weather and customers. It evolves in real time, without any intervention.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <Target className="text-[#F28500] w-20 h-20 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Less management, more focus</h3>
                                    <p className="text-gray-300">
                                        No need to choose or monitor music. You focus on the essential : your service, your customers.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <Fingerprint className="text-[#F28500] w-20 h-20 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">A unique sound identity</h3>
                                    <p className="text-gray-300">
                                        Sonarmo builds an atmosphere that is true to your place, your brand and your values.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <ChartLine className="text-[#F28500] w-20 h-20 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Measurable outcomes</h3>
                                    <p className="text-gray-300">
                                        Track the impact of your sound choices on attendance, customer feedback and loyalty.
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
                            <h2 className="text-3xl font-semibold mb-4">The right music at the right time</h2>
                            <p className="text-gray-300 text-base leading-relaxed">
                                Our musical AI adjusts the programming according to time, weather, customers and energy of the place. It evolves in real time to keep pace with you, not the other way around.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* SECTION - UNICITÉ (nouvelle version personnalisée) */}
                <motion.section className="py-20 bg-black" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                    <div className="max-w-6xl mx-auto flex flex-col gap-16 px-4">
                        <div className="text-center md:text-left md:flex md:items-center md:gap-12">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-semibold mb-4">You’re in control. Sonarmo does the rest.</h2>
                                <p className="text-gray-300 text-base leading-relaxed">
                                    Sonarmo takes care of the ambience of your place in real time, but you stay in control of every detail.
                                    From the dashboard, you can generate, adjust or change the mood at any time with a click.
                                </p>
                            </div>
                            <div className="md:w-1/2 flex justify-center">
                                <Image src="/Mockup mac.png" alt="Dashboard Sonarmo sur Mac" width={500} height={300} />
                            </div>
                        </div>
                        <div className="text-center md:text-left md:flex md:items-center md:gap-12 md:flex-row-reverse">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-semibold mb-4">Always in your pocket.</h2>
                                <p className="text-gray-300 text-base leading-relaxed">
                                    Access Sonarmo from your phone to change your mood in seconds. A simple interface, designed to be used in the field when it matters.
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
                        <h2 className="text-3xl font-semibold mb-6">Data & measurable impact</h2>
                        <p className="text-gray-300 text-base max-w-2xl mx-auto mb-8">
                            Access precise analyses from your dashboard to optimize your musical atmospheres.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left max-w-4xl mx-auto">
                            <div className="flex gap-4 items-start">
                                <UserPlus className="text-[#F28500] w-15 h-15 mt-5" />
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Power of attraction</h3>
                                    <p className="text-gray-300">Measure the ability of each atmosphere to capture attention and make your customers come back.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <Cross className="text-[#F28500] w-25 h-25 mt-4" />
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Cross-analysis</h3>
                                    <p className="text-gray-300">Cross-reference your music data with your sales metrics to reveal the moods that drive business and customer engagement.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <BarChart2 className="text-[#F28500] w-10 h-10 mt-4" />
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Music performances</h3>
                                    <p className="text-gray-300">Identify the titles and styles that work best.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <Target className="text-[#F28500] w-10 h-10 mt-4" />
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Tests & ajustements</h3>
                                    <p className="text-gray-300">Experiment with different moods and measure their effectiveness.</p>
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
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto px-4">
                        <div className="text-left">
                            <h3 className="text-2xl font-semibold text-white mb-2">Connected to Spotify</h3>
                            <div className="text-white text-5xl font-light">+100</div>
                            <div className="text-gray-300 text-sm">millions of titles available</div>
                        </div>
                        <div className="text-left max-w-md">
                            <h4 className="text-white font-semibold text-lg mb-2">All the music, no limit</h4>
                            <p className="text-gray-300 text-base leading-relaxed">
                                Connect your Spotify account and access its entire catalog, directly from the Sonarmo platform. Zero friction, 100% fluid.
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
                            LET&apos;S TALK ?
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
                            <Link href="/" className="hover:text-white">About us</Link>
                            <Link href="/contact-en" className="hover:text-white">Contact us</Link>
                        </div>
                        <div className="flex flex-col items-end text-right gap-2">
                            <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
                            <p className="text-xs">&copy;2025 Sonarmo Team. All rights reserved</p>
                            <p className="text-xs">Terms of Use & Privacy Policy</p>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}
