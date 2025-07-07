import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import AnimatedWave from "/components/builder/AnimatedWave";
import LanguageSwitcher from "/components/builder/LanguageSwitcher";
import BlurText from "/components/builder/BlurText";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Sonarmo | Ambiente musical inteligente para todos</title>
        <meta
          name="description"
          content="Genera tu playlist personalizada con Sonarmo, la herramienta inteligente para crear un ambiente sonoro único en casa o en tu establecimiento."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
      </Head>

      <main className="bg-black text-white overflow-x-hidden">
        <header className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
            <span className="text-white text-lg font-semibold italic">Sonarmo</span>
          </div>

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

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
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
              <Link href="/explique-generation-es" className="hover:text-gray-300">GENERADOR DE PLAYLIST</Link>
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

        <section className="text-center px-4 py-5 bg-black">
          <div className="relative w-full max-w-xs sm:max-w-md h-[140px] sm:h-[225px] mx-auto mb-6">
  <Image
    src="/Logo-app-header.png"
    alt="Sonarmo Logo"
    fill
    className="object-contain"
    priority
  />
</div>
          
         <div className="w-full px-4 text-center">
  <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 max-w-xl mx-auto leading-snug">
   
      <BlurText
                      text="Inteligencia Atmosférica"
                      animateBy="words"
                      direction="top"
                      className="w-full"
                      highlight={{ Atmosférica : "text-[#FCE2BA]" }}
                   />
    
  </h1>
</div>
        
        
          
          <p className="mx-auto text-gray-400 text-lg mb-12">
            Crea un ambiente musical a medida, tanto si eres un particular como un profesional.
          </p>
          <div className="mx-auto relative w-full h-[170px] z-20 mb-5">
  <AnimatedWave />
</div>
<div className="mt-10">
  <Link
  href="/login-es"
  className="inline-block bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-8 py-4 rounded-full text-white font-semibold border border-transparent shadow-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(242,133,0,0.5)] hover:-translate-y-1 hover:border-[#F28500]"
>
  Crea tu ambiente
</Link>
</div>

        </section>
        {/* DUAL CTA SECTION */}
        <section className="px-6 py-18 text-center bg-black">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Elige tu experiencia</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-[#1c1c1c] p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-4 text-[#f58711]">Personal</h3>
              <p className="text-gray-400 mb-6">
                Ya sea que estes en la piscina, trabajando o cocinando... Un ambiente bien elegido puede cambiar todo.
                Con Sonarmo, crea una lista de reproducción personalizada, adaptada al momento y a tu estado de ánimo.
              </p>
              <Link href="/login-es" className="inline-block bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-6 py-3 rounded-full text-white font-semibold hover:scale-105 transition-transform">
                Generar mi playlist
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-[#1c1c1c] p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-4 text-[#FF00FF]">Profesionales</h3>
              <p className="text-gray-400 mb-6">
                Un bar que invita a quedarse, un café que respira dulzura, un espacio profesional que estimula la concentración...
                Gracias a Sonarmo Pro, ofrece a sus clientes un ambiente sonoro memorable, pensado para ellos.
              </p>
              <Link href="/experience-es" className="inline-block bg-gradient-to-r from-[#FF00FF] to-[#F28500] px-6 py-3 rounded-full text-white font-semibold hover:scale-105 transition-transform">
                Descubre Sonarmo Pro
              </Link>
            </motion.div>
          </div>
        </section>

        {/* IMPACT SECTION AMÉLIORÉE */}
        <section className="relative text-center px-10 py-20 overflow-hidden bg-gradient-to-br from-[#2a0a00] via-[#1a0015] to-[#120d0d]">
          <div className="absolute left-0 top-0 w-[600px] h-[600px] bg-gradient-to-br from-[#FF9400] to-[#FF0BED] rounded-full blur-3xl opacity-20 -translate-x-1/3 -translate-y-1/3 z-0" />
          <p className="text-lg text-[#FCE2BA] uppercase tracking-widest mb-8">
            ¿Por qué Sonarmo?
          </p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-3xl font-semibold mb-10">Un ambiente que cambia todo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-6xl mx-auto text-gray-300">
              {[{
                value: "100%",
                text: "de las Playlist generadas son únicas, basadas en tu ambiente."
              }, {
                value: "+9%",
                text: "Dopamina es liberada en el cerebro cuando oímos música que nos gusta"
              }, {
                value: "1 min",
                text: "basta."
              }].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.3 }}
                >
                  <p className="text-5xl font-bold text-white mb-2">{item.value}</p>
                  <p>{item.text}</p>
                </motion.div>
              ))}
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
