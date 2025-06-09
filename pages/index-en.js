import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
const [isMenuOpen, setIsMenuOpen] = useState(false);

return (
<>

        <Head>
            <title>Sonarmo</title>
            <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
            {/* Google Analytics */}
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-PTGDLQ7W2N"></script>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-PTGDLQ7W2N');
      `,
                }}
            />
        </Head>
        <main className="bg-black text-white overflow-x-hidden">
        {/* HEADER */}
        <header className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-2">
                    <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
                <span className="text-white text-lg font-semibold italic">Sonarmo</span>
            </div>
               


            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-6 text-sm items-center">
                <Link href="/experience-en" className="hover:text-gray-300">SONARMO EXPERIENCE</Link>
                <Link href="/contact-en" className="hover:text-gray-300">CONTACT US</Link>
                <Link href="/login-en" className="hover:text-gray-300 flex items-center gap-1">
                        <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
                LOGIN
                </Link>
                
            </nav>

            {/* Mobile Nav Toggle */}
            <div className="md:hidden">
                <button onClick={()=> setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    )}
                </button>
            </div>
        </header>

        {/* Mobile Nav Menu */}
        <AnimatePresence>
            {isMenuOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="md:hidden px-6 py-4 bg-[#1c1c1c] shadow-lg flex flex-col gap-4 text-sm z-50">
                <Link href="/experience-en" className="hover:text-gray-300">SONARMO EXPERIENCE</Link>
                <Link href="/contact-en" className="hover:text-gray-300">CONTACT US</Link>
                <Link href="/login-en" className="hover:text-gray-300 flex items-center gap-1">
                <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
                LOGIN
                </Link>
            </motion.div>
            )}
        </AnimatePresence>

        {/* HERO SECTION */}
        <section className="relative text-center px-4 py-0">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}
                className="relative z-10 flex flex-col items-center">
                <div className="relative w-[500px] h-[225px] mb-1">
                    <Image src="/Logo-app-header.png" alt="Sonarmo Logo" fill className="object-contain" priority />
                </div>
                <h1 className="text-5xl font-semibold mb-4">
                    <span className="text-[#FCE2BA]">Atmospheric </span>
                    <span className="text-white">Intelligence </span>
                </h1>
                <p className="max-w-xl text-gray-400 text-base sm:text-lg mb-8">
                        Each place has a story, a unique identity. Sonarmo creates a personalized sound environment,
                        specially designed to reflect the soul of your space and offer an immersive experience
                        incomparable.
                </p>
                <Link href="/experience-en" legacyBehavior><a
                    className="inline-block bg-gradient-to-r from-[#FF9400] to-[#FF0BED] px-6 py-3 rounded-full text-white font-semibold shadow-md transform transition-transform duration-300 hover:scale-105 active:scale-95">
                    Discover
                </a>
                </Link>
                <div className="h-24" />
            </motion.div>
        </section>

        {/* IMPACT SECTION */}
        <section
            className="relative text-center px-6 py-20 overflow-hidden bg-gradient-to-br from-[#2a0a00] via-[#1a0015] to-[#120d0d]">
            <div
                className="absolute left-0 top-0 w-[600px] h-[600px] bg-gradient-to-br from-[#FF9400] to-[#FF0BED] rounded-full blur-3xl opacity-20 -translate-x-1/3 -translate-y-1/3 z-0 " />
            <p className="text-lg text-[#FCE2BA] uppercase tracking-widest mb-4">
                    Music is not a background sound... it&apos;s a lever of ambience
            </p>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2
                }} viewport={{ once: true }} className="relative z-10">
                    <h2 className="text-3xl font-semibold mb-10">The impact of music on the customer experience
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-6xl mx-auto text-gray-300">
                    {[{
                    value: "+15%",
                    text: "of turnover in bars and restaurants with a well-calibrated musical atmosphere.*"
                    }, {
                    value: "+21%",
                    text: "time spent by guests in a venue with consistent ambient music.**"
                    }, {
                    value: "96%",
                    text: "of customers say that music influences their perception of a place.***"
                    }].map((item, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.3 }}>
                        <p className="text-5xl font-bold text-white mb-2">{item.value}</p>
                        <p>{item.text}</p>
                    </motion.div>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-10">* Source : HUI Research / ** Soundtrack Your Brand / *** IFOP
                    & Sacem</p>
            </motion.div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="relative text-center px-4 py-20 overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-4xl font-semibold mb-4">Contact Us</h2>
                <p className="text-gray-400 mb-8 max-w-md">
                    A question, an idea, or just want to talk about it ? Let us know, we love talking !
                </p>
                <Link href="/contact-en" legacyBehavior><a
                    className="inline-block bg-gradient-to-r from-[#FF9400] to-[#FF0BED] px-6 py-3 rounded-full text-white font-semibold shadow-md transform transition-transform duration-300 hover:scale-105 active:scale-95">
                    Let&apos;s talk ?
                </a>
                </Link>
            </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#121212] text-sm text-gray-400 px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex flex-col gap-2 mb-6 md:mb-0">
                    <div className="flex items-center gap-4">
                        <a href="https://www.instagram.com/sonarmo_music/?hl=fr" target="_blank"
                            rel="noopener noreferrer">
                            <Image src="/icons/instagram.png" alt="Instagram" width={24} height={24}
                                className="hover:opacity-70 transition" />
                        </a>
                        <a href="https://www.linkedin.com/company/sonarmo/" target="_blank" rel="noopener noreferrer">
                            <Image src="/icons/linkedin.png" alt="LinkedIn" width={24} height={24}
                                className="hover:opacity-70 transition" />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61574580608705" target="_blank"
                            rel="noopener noreferrer">
                            <Image src="/icons/facebook.png" alt="Facebook" width={24} height={24}
                                className="hover:opacity-70 transition" />
                        </a>
                    </div>
                    <Link href="/sonarmo-team" className="hover:text-white">Sonarmo Team</Link>
                    <Link href="/about-en" className="hover:text-white">About us</Link>
                    <Link href="/contact-en" className="hover:text-white">Contact us</Link>
                </div>
                <div className="flex flex-col items-end text-right gap-2">
                    <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
                    <p className="text-xs">©2025 Sonarmo Team. All Rights Reserved</p>
                    <p className="text-xs">Terms of Use & Privacy Policy</p>
                </div>
            </div>
        </footer>
    </main>
</>
);
}