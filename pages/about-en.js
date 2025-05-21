// pages/about.js

import Head from "next/head";
import { Music, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function About() {
        const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <Head>
                    <title>About</title>
                    <link
                      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
                      rel="stylesheet"
                    />
                    <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
            </Head>
            <main className="bg-black text-white font-[Poppins]">
              {/* HEADER */}
                      <header className="flex justify-between items-center px-6 py-4">
                    <Link href="/index-en" className="flex items-center gap-2">
                        <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
                        <span className="text-white text-lg font-semibold italic">Sonarmo</span>
                    </Link>
                
                      
              
              
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
                            <Link href="/experience-en" className="hover:text-gray-300">SONARMO EXPERIENCE</Link>
                            <Link href="/contact-en" className="hover:text-gray-300">CONTACT US</Link>
                            <Link href="/login-en" className="hover:text-gray-300 flex items-center gap-1">
                              <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
                              LOGIN
                            </Link>
                        
                          </motion.div>
                        )}
                      </AnimatePresence>  
                </main>
             <main className="min-h-screen bg-black text-white font-[Poppins] px-6 md:px-20 py-16">
                <div className="absolute inset-0 z-0">
                    <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-0" />
                    <div className="absolute w-[600px] h-[600px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-20" />
                </div>
                <div className="relative z-6 flex flex-col items-center w-full max-w-md px-4"></div>
                <div className="flex justify-center items-center relative mb-10 mx-center">
                        <Image
                        src="/sonarmo-experience.png"
                        alt="Sonarmo Logo"
                        width={150}
                        height={83}
                        className="object-contain"
                        priority
                    />

                                    </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto"
                >
                    <h1 className="text-3xl md:text-5xl font-semibold mb-8">About Sonarmo</h1>

                    <p className="text-lg md:text-xl mb-8 leading-relaxed text-gray-300">
                        At <strong>Sonarmo</strong>, we believe that music is not just a background—
                        it is a vector of emotions, a powerful tool to create atmospheres, influence behaviors
                        and enrich experiences.
                    </p>

                    <div className="flex items-center gap-3 mb-2">
                        <Music className="text-white" />
                        <h2 className="text-xl md:text-2xl font-semibold">Our mission</h2>
                    </div>
                    <p className="text-lg md:text-xl mb-10 leading-relaxed text-gray-300">
                        Allow public places (bars, cafes, hotels, workspaces, retirement homes...) d&apos;offer
                        an intelligent musical atmosphere, adapted to each moment, thanks to a technology mixing AI,
                        sound psychology and artistic sensitivity.
                    </p>

                    <div className="flex items-center gap-3 mb-2">
                        <Globe className="text-white" />
                        <h2 className="text-xl md:text-2xl font-semibold">Our vision</h2>
                    </div>
                    <p className="text-lg md:text-xl mb-10 leading-relaxed text-gray-300">
                        Build a world where every space becomes a sensory experience,
                        where music plays an active role in the well-being of people and the influence of places.
                    </p>

                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="text-white" />
                        <h2 className="text-xl md:text-2xl font-semibold">Our origin</h2>
                    </div>
                    <p className="text-lg md:text-xl mb-10 leading-relaxed text-gray-300">
                        Sonarmo was born from a passion : that of sound art and its impact on our emotions, our energy, our memories.
                        We use technology to create unique and memorable atmospheres.
                    </p>

                    <p className="text-xl md:text-3xl italic mt-10 text-center text-white">
                        Welcome to the universe of Atmospheric Intelligence.
                    </p>
                </motion.div>
            </main>
            {/* FOOTER */}
            <footer className="bg-black text-sm text-gray-400 border-t border-gray-700 px-6 py-10 w-full">
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
                        <Link href="/" className="hover:text-white">About us</Link>
                        <Link href="/contact" className="hover:text-white">Contact us</Link>
                    </div>
                    <div className="flex flex-col items-end text-right gap-2">
                        <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
                        <p className="text-xs">&copy;2025 Sonarmo Team. All right reserved</p>
                        <p className="text-xs">Terms of Use &amp; Privacy Policy</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
