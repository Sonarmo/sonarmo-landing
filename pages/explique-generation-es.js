import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Zap, Target, Link as LinkIcon, Brain } from "lucide-react";
import LanguageSwitcher from "/components/builder/LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";

export default function ExplicationGeneration() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>¿Cómo funciona? - Sonarmo</title>
        <meta name="description" content="Descubre cómo Sonarmo genera tu playlist perfecta en segundos." />
        <link rel="icon" href="/sonarmo-experience.png" />
      </Head>

      <main className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
        {/* Fondo luminoso */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-60" />
          <div className="absolute w-[300px] h-[300px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-50" />
        </div>

        {/* Encabezado */}
        <header className="flex justify-between items-center px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
            <span className="text-white text-lg font-semibold italic">Sonarmo</span>
          </Link>

          <nav className="hidden md:flex gap-6 text-sm items-center">
            <Link href="/explique-generation-es" className="hover:text-gray-300">PLAYLIST GENERADOR</Link>
            <Link href="/experience-es" className="hover:text-gray-300">SONARMO PRO</Link>
            <Link href="/contact-es" className="hover:text-gray-300">CONTÁCTENOS</Link>
            <Link href="/login-es" className="hover:text-gray-300 flex items-center gap-1">
              <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
              CONECTARSE
            </Link>
            <LanguageSwitcher />
          </nav>

          {/* Menú móvil */}
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
              className="md:hidden px-6 py-4 bg-black shadow-lg flex flex-col gap-4 text-sm z-[60] pointer-events-auto"
            >
              <Link href="/explique-generation-es" className="hover:text-gray-300">PLAYLIST GENERADOR</Link>
              <Link href="/experience-es" className="hover:text-gray-300">SONARMO PRO</Link>
              <Link href="/contact-es" className="hover:text-gray-300">CONTÁCTENOS</Link>
              <Link href="/login-es" className="hover:text-gray-300 flex items-center gap-1">
                <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
                CONECTARSE
              </Link>
              <LanguageSwitcher />
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENU PRINCIPAL */}
        
        <section className="flex-grow flex flex-col items-center justify-center px-4 py-15 relative z-10 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-white">Generador de </span>
            <span className="text-[#FCE2BA]">Atmósfera</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Cada playlist Sonarmo se construye con nuestra Inteligencia Atmosférica capaz de leer tu ambiente, tus necesidades, y transformar el momento en una experiencia sonora memorable.
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
    <span><strong>Inmediato :</strong> Tu lista de reproducción lista en menos de 5 segundos.</span>
  </li>
  <li className="flex items-center gap-5">
    <Target className="text-pink-400 mt-1" size={40} />
    <span><strong>Personalizado :</strong> Cada música se selecciona de acuerdo a tu descripción.</span>
  </li>
  <li className="flex items-center gap-5">
    <LinkIcon className="text-purple-400 mt-1" size={40} />
    <span><strong>Spotify integrado :</strong> Escucha, edita y comparte libremente.</span>
  </li>
  <li className="flex items-center gap-5">
    <Brain className="text-blue-400 mt-1" size={40} />
    <span><strong>IA escalable :</strong> Aprende a través de tu ambiente.</span>
  </li>
</ul>

            <div className="mt-10 text-center">
              <Link href="/login-es">
                <button className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-8 py-3 rounded-full text-white font-semibold text-lg hover:scale-105 transition">
                  Generar mi playlist ahora
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        <footer className="bg-black text-sm text-gray-400 px-6 py-10 mt-20 w-full relative z-10">
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-y-8 w-full">

    {/* Bloc gauche + logo FT (sur une ligne en desktop, stack en mobile) */}
    <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6 items-center text-center sm:text-left">

      {/* Réseaux + Liens */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-center sm:justify-start gap-4">
          <a href="https://www.instagram.com/sonarmo_ia/?hl=fr" target="_blank" rel="noopener noreferrer">
            <Image src="/icons/instagram.png" alt="Instagram" width={24} height={24} className="hover:opacity-70 transition" />
          </a>
          <a href="https://www.linkedin.com/company/sonarmo/" target="_blank" rel="noopener noreferrer">
            <Image src="/icons/linkedin.png" alt="LinkedIn" width={24} height={24} className="hover:opacity-70 transition" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61574580608705" target="_blank" rel="noopener noreferrer">
            <Image src="/icons/facebook.png" alt="Facebook" width={24} height={24} className="hover:opacity-70 transition" />
          </a>
        </div>
        <Link href="/sonarmo-team" className="hover:text-white">Equipo Sonarmo</Link>
        <Link href="/about" className="hover:text-white">Sobre nosotros</Link>
        <Link href="/contact-es" className="hover:text-white">Contáctenos</Link>
      </div>

      {/* Logo French Tech Est */}
      <div className="mt-4 sm:mt-0 sm:ml-3 flex justify-center sm:justify-start">
        <Image
          src="/icons/Logo_FT.png"
          alt="Logo French Tech Est"
          width={80}
          height={80}
          className="opacity-90"
        />
      </div>

    </div>

    {/* Bloc droit : Logo Sonarmo + Mentions */}
    <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2">
      <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
      <p className="text-xs">Sonarmo™</p>
      <Link href="/cgu" className="text-sm hover:underline">Condiciones de uso y política de privacidad</Link>
      <Link href="/mentions-legales" className="text-sm hover:underline">Términos y Condiciones</Link>
      <Link href="/conditions-vente" className="text-sm hover:underline">Política de privacidad</Link>
    </div>
  </div>
</footer>
      </main>
    </>
  );
}