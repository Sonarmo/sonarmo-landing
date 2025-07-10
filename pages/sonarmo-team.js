import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Heart, Waves, Users } from "lucide-react";
import Footer from "/components/layout/Footer";

export default function Team() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="overflow-x-hidden bg-black text-white font-[Poppins]">
      <Head>
        <title>Sonarmo - L&apos;équipe</title>
        <meta name="description" content="Découvrez l’équipe derrière Sonarmo, le projet qui marie IA, musique et émotion pour transformer les lieux publics en expériences sensorielles." />
        <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
      </Head>

      <main className="min-h-screen px-6 md:px-20 relative">
        <header className="relative z-10 flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
            <span className="text-white text-lg font-semibold italic">Sonarmo</span>
          </Link>

          <nav className="relative z-10 hidden md:flex gap-6 text-sm items-center">
            <Link href="/explique-generation" className="hover:text-gray-300">GENERATEUR DE PLAYLIST</Link>
            <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
            <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
            <Link href="/blog" className="hover:text-gray-300">BLOG</Link>
            <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
              <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
              SE CONNECTER
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
              className="relative z-20 md:hidden px-6 py-4 bg-[#1c1c1c] shadow-lg flex flex-col gap-4 text-sm"
            >
              <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
              <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
              <Link href="/blog" className="hover:text-gray-300">BLOG</Link>
              <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
                <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
                SE CONNECTER
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-4xl mx-auto text-center mb-12 mt-20 relative z-10">
          <h1 className="text-4xl font-bold mb-4">L&apos;équipe Sonarmo</h1>
          <p className="text-gray-400">
            Derrière Sonarmo, il y a des personnes passionnées de musique, de technologie et de sensations. Voici qui nous sommes.
          </p>
        </div>

        <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
  className="max-w-4xl mx-auto bg-[#1a1a1a] rounded-2xl p-6 md:flex md:items-center shadow-md relative z-10"
>
  <div className="md:w-1/3 mb-6 md:mb-0">
    <Image
      src="/images/arthur-fromont.png"
      alt="Arthur Fromont"
      width={300}
      height={300}
      className="rounded-xl"
    />
  </div>

  <div className="md:w-2/3 md:pl-8 text-left space-y-4">
    <h2 className="text-2xl font-semibold">Arthur Fromont</h2>
    <p className="text-sm text-gray-400">Fondateur & Créateur d&apos;éxperience sonore</p>

    <p className="text-gray-300 leading-relaxed">
      DJ et passionné de musique depuis mon plus jeune âge, j’ai toujours été fasciné par l’impact des sons sur nos émotions.
    </p>
    <p className="text-gray-300 leading-relaxed">
      Après un parcours mêlant création musicale, voyages et projets tech, j’ai imaginé Sonarmo comme un pont entre
      l’intelligence artificielle et l’intelligence émotionnelle.
    </p>
    <p className="text-gray-300 leading-relaxed">
      Pour que chaque lieu puisse vibrer à sa propre fréquence.
    </p>


    <div className="flex justify-center mt-2">
      <a
        href="https://www.linkedin.com/in/arthur-fromont-895ba8a9/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-white transition"
        aria-label="LinkedIn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="mx-auto"
        >
          <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.5h5v15H0v-15zM7.5 8.5h4.78v2.02h.07c.66-1.25 2.28-2.58 4.7-2.58 5.03 0 5.95 3.32 5.95 7.63v8.93h-5v-7.91c0-1.89-.03-4.32-2.63-4.32-2.64 0-3.05 2.06-3.05 4.18v8.05h-5V8.5z" />
        </svg>
      </a>
    </div>
  </div>
</motion.div>

<div className="max-w-4xl mx-auto mt-8 relative z-10">
  <p className="text-3xl font-semibold mb-10 text-center">Mon univers musical :</p>
  <div className="flex justify-center">
    <div className="rounded-xl overflow-hidden w-[70%]">
      <iframe
        style={{ borderRadius: '12px' }}
        src="https://open.spotify.com/embed/playlist/2ttG6ckTlmoNLYDsnFztN6?utm_source=generator"
        width="100%"
        height="352"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  </div>
</div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mt-20 relative z-10"
        >
          <h2 className="text-3xl font-semibold mb-10 text-center">Nos valeurs</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-[#1f1f1f] border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition text-center">
              <Heart className="mx-auto mb-4 text-white" size={32} />
              <h4 className="text-white text-lg font-semibold mb-2">Émotion au cœur</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                La musique est un langage émotionnel avant tout. Elle touche, apaise, élève, rassemble.
              </p>
            </div>
            <div className="bg-[#1f1f1f] border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition text-center">
              <Waves className="mx-auto mb-4 text-white" size={32} />
              <h4 className="text-white text-lg font-semibold mb-2">Écologie sonore</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Un monde moins bruyant, plus harmonieux. Où chaque son a sa place et respecte l’espace.
              </p>
            </div>
            <div className="bg-[#1f1f1f] border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition text-center">
              <Users className="mx-auto mb-4 text-white" size={32} />
              <h4 className="text-white text-lg font-semibold mb-2">Harmonie humaine</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Au-delà de la musique d’ambiance, nous cherchons l’harmonie entre les gens, les lieux et les émotions.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto mt-12 text-center relative z-10">
          <p className="text-gray-400">
            Envie de contribuer à notre mission ? Nous serons bientôt à la recherche de profils créatifs, sensibles et curieux. Restez connecté.
          </p>
          <Link href="/" className="text-sm text-gray-400 underline hover:text-white mt-8 inline-block">
            ← Retour à l&apos;accueil
          </Link>
        </div>

        <div className="absolute inset-0 z-0">
          <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-0" />
          <div className="absolute w-[600px] h-[600px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-20" />
        </div>
      </main>
      <Footer />
    </div>
  );
}