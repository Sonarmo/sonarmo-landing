import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Zap, Target, Link as LinkIcon, Brain } from "lucide-react";

export default function ExplicationGeneration() {
  return (
    <>
      <Head>
        <title>How does it work? - Sonarmo</title>
        <meta name="description" content="Discover how Sonarmo generates your perfect playlist in seconds." />
        <link rel="icon" href="/sonarmo-experience.png" />
      </Head>

      <main className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">

        {/* Fond lumineux */}
        <div className="absolute inset-0 z-0">
          <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-60" />
          <div className="absolute w-[300px] h-[300px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-50" />
        </div>

        {/* HEADER */}
        <header className="flex justify-between items-center px-6 py-4 relative z-10">
          <Link href="/index-en" className="flex items-center gap-2">
            <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
            <span className="text-white text-lg font-semibold italic">Sonarmo</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm items-center">
            <Link href="/explique-generation-en" className="hover:text-gray-300">PLAYLIST GENERATOR</Link>
            <Link href="/experience-en" className="hover:text-gray-300">SONARMO PRO</Link>
            <Link href="/contact-en" className="hover:text-gray-300">CONTACT US</Link>
            <Link href="/login-en" className="hover:text-gray-300 flex items-center gap-1">
              <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
              LOGIN
            </Link>
          </nav>
        </header>

        {/* CONTENU PRINCIPAL */}
        
        <section className="flex-grow flex flex-col items-center justify-center px-4 py-15 relative z-10 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#FCE2BA]">Atmospheric </span>
            <span className="text-white">Generator</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Each Sonarmo playlist is built with our Atmospheric Intelligence capable of reading your atmosphere, your needs, and transforming the instant into a memorable sound experience.
          </motion.p>

          <motion.div
            className="bg-[#1c1c1c] p-6 md:p-10 rounded-xl shadow-lg max-w-3xl w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <ul className="text-left text-gray-300 space-y-6 mb-10">
  <li className="flex items-center gap-5">
    <Zap className="text-orange-400 mt-1" size={40} />
    <span><strong>Instant :</strong> Your playlist is ready in less than 5 seconds.</span>
  </li>
  <li className="flex items-center gap-5">
    <Target className="text-pink-400 mt-1" size={40} />
    <span><strong>Customized :</strong> Each track is selected according to your description.</span>
  </li>
  <li className="flex items-center gap-5">
    <LinkIcon className="text-purple-400 mt-1" size={40} />
    <span><strong>Spotify integrated :</strong> Listen, edit and share freely.</span>
  </li>
  <li className="flex items-center gap-5">
    <Brain className="text-blue-400 mt-1" size={40} />
    <span><strong>Evolving AI :</strong> She learns over the course of your atmospheres.</span>
  </li>
</ul>

            <div className="mt-10 text-center">
              <Link href="/login">
                <button className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-8 py-3 rounded-full text-white font-semibold text-lg hover:scale-105 transition">
                  ✨ Generate my playlist now
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="bg-black text-sm text-gray-400 border-t border-gray-700 px-6 py-10 w-full relative z-10">
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
              <Link href="/sonarmo-team" className="hover:text-white">Sonarmo Team</Link>
              <Link href="/about-en" className="hover:text-white">About us</Link>
              <Link href="/contact-en" className="hover:text-white">Contact us</Link>
            </div>
            <div className="flex flex-col items-end text-right gap-2">
              <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
              <p className="text-xs">2025 Sonarmo Team. All right reserved</p>
              <p className="text-xs">Conditions of use & Privacy policy</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}