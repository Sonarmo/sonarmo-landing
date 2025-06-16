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
                <title>Sonarmo - Experiencia</title>
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
            <main className="bg-black text-white overflow-x-hidden min-h-screen px-0">

                {/* HEADER */}
                <header className="flex justify-between items-center px-6 py-4">
                    <Link href="/index-es" className="flex items-center gap-2">
                        <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
                        <span className="text-white text-lg font-semibold italic">Sonarmo</span>
                    </Link>

                    <nav className="hidden md:flex gap-6 text-sm items-center">
                        <Link href="/explique-generateur-es" className="hover:text-gray-300">PLAYLIST GENERADOR</Link>
                        <Link href="/experience-es" className="hover:text-gray-300">SONARMO PRO</Link>
                        <Link href="/contact-es" className="hover:text-gray-300">CONTÀCTENOS</Link>
                        <Link href="/login-es" className="hover:text-gray-300 flex items-center gap-1">
                            <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
                            CONECTARSE
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
                            <Link href="/generateur-es" className="hover:text-gray-300">PLAYLIST GENERADOR</Link>
                            <Link href="/experience-es" className="hover:text-gray-300">SONARMO PRO</Link>
                            <Link href="/contact-es" className="hover:text-gray-300">CONTÀCTENOS</Link>
                            <Link href="/login-es" className="hover:text-gray-300 flex items-center gap-1">
                                <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
                                CONECTARSE
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
                        <h1 className="text-5xl font-bold mb-6">La experiencia Sonarmo</h1>
                        <p className="text-gray-300 text-lg">
                            Un ambiente musical inteligente, único en cada lugar. La música adecuada, en el momento adecuado, para hacer vibrar tu espacio.
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
                        <h2 className="text-4xl font-bold mb-6">Un ambiente puede cambiar todo. Pero a menudo se pasa por alto.</h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Demasiados lugares dejan que la música gire en el fondo, sin coherencia ni intención.
                            Resultado: un ambiente impersonal, una clientela menos comprometida... y una oportunidad perdida.
                        </p>
                        <p className="text-gray-300 text-lg mt-6">
                            No se trata de poner música al azar. Se trata de sentirla. 
                            Esta playlist no se elige por defecto, se elige porque conecta.
                        </p>
                        <p className="italic text-[#FCE2BA] mt-10">
                            “El ambiente es invisible, pero lo cambia todo.”
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
                            <h2 className="text-4xl font-bold mb-6">Tu firma sonora</h2>
                            <p className="text-gray-300 text-base leading-relaxed mb-6">
                                Sonarmo te ayuda a construir una identidad musical fuerte, alineada con tu imagen, tus valores y tu clienta.
                            </p>
                            <p className="italic text-[#FCE2BA]">
                                “Los clientes pueden no recordar la canción. Pero recordarán cómo se sintieron en tu espacio.”
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
                        <h2 className="text-4xl font-bold mb-10">Lo que Sonarmo cambia para ti</h2>
                        <div className="grid md:grid-cols-2 gap-12 text-left">
                            <div className="flex gap-4 items-start">
                                <Activity className="text-[#F28500] w-20 h-20 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Un ambiente siempre justo</h3>
                                    <p className="text-gray-300">
                                        La IA de Sonarmo se ajusta a la hora, la energía, el clima y los clientes. Evoluciona en tiempo real, sin intervención.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <Target className="text-[#F28500] w-20 h-20 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Menos gestión, más enfoque</h3>
                                    <p className="text-gray-300">
                                        Ya no tienes que elegir ni supervisar la música. Te concentras en lo esencial: tu servicio, tus clientes.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <Fingerprint className="text-[#F28500] w-20 h-20 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Una identidad sonora única</h3>
                                    <p className="text-gray-300">
                                        Sonarmo construye un ambiente fiel a tu lugar, tu marca, tus valores.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <ChartLine className="text-[#F28500] w-20 h-20 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Progresos mensurables</h3>
                                    <p className="text-gray-300">
                                       Analiza el efecto de tu identidad sonora en la asistencia, las reacciones de tus clientes y el tiempo que disfrutan en tu espacio.
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
                            <h2 className="text-3xl font-semibold mb-4">La música adecuada, en el momento adecuado</h2>
                            <p className="text-gray-300 text-base leading-relaxed">
                                Nuestra IA musical ajusta la programación en función de la hora, el tiempo, la clientela y la energía del lugar. Evoluciona en tiempo real para seguir tu ritmo, no al revés.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* SECTION - UNICITÉ (nouvelle version personnalisée) */}
                <motion.section className="py-20 bg-black" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                    <div className="max-w-6xl mx-auto flex flex-col gap-16 px-4">
                        <div className="text-center md:text-left md:flex md:items-center md:gap-12">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-semibold mb-4">Mantén el control. Sonarmo hace el resto.</h2>
                                <p className="text-gray-300 text-base leading-relaxed">
                                    Sonarmo se encarga de la ambientación de tu lugar adaptándose en tiempo real, pero tu sigues teniendo el control de cada detalle.
                                    Desde el dashboard, puedes generar, ajustar o cambiar la ambientación en cualquier momento, con solo un clic.
                                </p>
                            </div>
                            <div className="md:w-1/2 flex justify-center">
                                <Image src="/Mockup mac.png" alt="Dashboard Sonarmo sur Mac" width={500} height={300} />
                            </div>
                        </div>
                        <div className="text-center md:text-left md:flex md:items-center md:gap-12 md:flex-row-reverse">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-semibold mb-4">Siempre en el bolsillo.</h2>
                                <p className="text-gray-300 text-base leading-relaxed">
                                    Accede a Sonarmo desde tu teléfono para cambiar de ambiente en segundos. Una interfaz simple, diseñada para ser utilizada en calquier lugar, en cualquier momento.
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
                        <h2 className="text-3xl font-semibold mb-6">Datos y progreso medible</h2>
                        <p className="text-gray-300 text-base max-w-2xl mx-auto mb-8">
                            Accede a análisis precisos desde tu dashboard para optimizar tus ambientes musicales.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left max-w-4xl mx-auto">
                            <div className="flex gap-4 items-start">
                                <UserPlus className="text-[#F28500] w-15 h-15 mt-5" />
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Poder de atracción</h3>
                                    <p className="text-gray-300">Mide la capacidad de cada ambiente para captar la atención y hacer que tus clientes vuelvan.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <Cross className="text-[#F28500] w-25 h-25 mt-4" />
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Análisis combinando</h3>
                                    <p className="text-gray-300">Compara tus datos de música con los indicadores de ventas para identificar las tendencias que impulsan el negocio y la interacción con el cliente.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <BarChart2 className="text-[#F28500] w-10 h-10 mt-4" />
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Actuaciones musicales</h3>
                                    <p className="text-gray-300">Identifica los títulos y estilos que funcionan mejor.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <Target className="text-[#F28500] w-10 h-10 mt-4" />
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Pruebas y ajustes</h3>
                                    <p className="text-gray-300">Experimenta con diferentes estados de ánimo y mide tu eficacia.</p>
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
                            <h3 className="text-2xl font-semibold text-white mb-2">Conectado a Spotify</h3>
                            <div className="text-white text-5xl font-light">+100</div>
                            <div className="text-gray-300 text-sm">millones de títulos disponibles</div>
                        </div>
                        <div className="text-left max-w-md">
                            <h4 className="text-white font-semibold text-lg mb-2">Toda la música, sin límite</h4>
                            <p className="text-gray-300 text-base leading-relaxed">
                                Conecta tu cuenta de Spotify y accede a todo su catálogo, directamente desde la plataforma Sonarmo.
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
                    <Link href="/contact-es">
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-8 py-4 rounded-full text-white font-semibold shadow-md cursor-pointer"
                        >
                           ¿NOS LLAMAMOS?
                        </motion.button>
                    </Link>

                </motion.section>

                {/* FOOTER */}
                <footer className="bg-[#121212] text-sm text-gray-400 px-6 py-10">
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
              <Link href="/sonarmo-team" className="hover:text-white">Sonarmo Team</Link>
              <Link href="/about-es" className="hover:text-white">Sobre nosotros</Link>
              <Link href="/contact-es" className="hover:text-white">Contáctenos</Link>
            </div>
            <div className="flex flex-col items-end text-right gap-2">
              <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
              <p className="text-xs">©2025 Sonarmo Team. Todos los derechos reservados</p>
              <p className="text-xs">Términos y condiciones de uso y política de privacidad</p>
            </div>
          </div>
        </footer>
            </main>
        </>
    );
}
