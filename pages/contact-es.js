import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "/components/builder/LanguageSwitcher";

export default function Contact() {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <Head>
                <title>Sonarmo - Contacte</title>
                <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
            </Head>
            <main className="bg-black text-white min-h-screen relative overflow-x-hidden">
                {/* HEADER */}
                <header className="flex justify-between items-center px-6 py-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
                        <span className="text-white text-lg font-semibold italic">Sonarmo</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-6 text-sm items-center">
                        <Link href="/explique-generation-es" className="hover:text-gray-300">PLAYLIST GENERADOR</Link>
                        <Link href="/experience-es" className="hover:text-gray-300">SONARMO PRO</Link>
                        <Link href="/contact-es" className="hover:text-gray-300">CONTÁCTENOS</Link>
                        <Link href="/login-es" className="hover:text-gray-300 flex items-center gap-1">
                            <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
                            CONECTARSE
                        </Link>
                        <LanguageSwitcher />
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
                            className="md:hidden px-6 py-4 bg-black shadow-lg flex flex-col gap-4 text-sm z-50 relative"
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

                {/* CONTACT FORM ONLY */}
                <section className="relative px-4 py-8 flex justify-center min-h-screen">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-60" />
                        <div className="absolute w-[300px] h-[300px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-50" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center w-full max-w-md">
                        <div className="relative w-[350px] h-[194px] mb-0">
                            <Image
                                src="/Logo-app-header.png"
                                alt="Sonarmo Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <form
                            action="https://formspree.io/f/mrbpndbq"
                            method="POST"
                            onSubmit={() => setFormSubmitted(true)}
                            className="flex flex-col gap-4 w-full text-left"
                        >
                            <input type="hidden" name="_captcha" value="false" />
                            <label className="text-sm">Nombre
                                <input type="text" name="Nom" required className="w-full px-4 py-2 rounded bg-white/90 text-black mt-1" /></label>
                            <label className="text-sm">Apellido
                                <input type="text" name="Prénom" required className="w-full px-4 py-2 rounded bg-white/90 text-black mt-1" /></label>
                            <label className="text-sm">Email
                                <input type="email" name="email" required className="w-full px-4 py-2 rounded bg-white/90 text-black mt-1" /></label>
                            <label className="text-sm">Mensaje
                                <textarea name="message" rows="4" required className="w-full px-4 py-2 rounded bg-white/90 text-black mt-1"></textarea></label>
                            <button type="submit" className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-6 py-2 rounded text-white font-semibold">Enviar</button>
                            {formSubmitted && (
                                <p className="text-green-400 mt-4">Gracias por ponerse en contacto con nosotros, le responderemos lo antes posible.</p>
                            )}
                        </form>
                    </div>
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
