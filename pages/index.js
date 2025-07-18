import Image from "next/image";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/next";
import AnimatedWave from "/components/builder/AnimatedWave";
import BlurText from "/components/builder/BlurText";
import Link from "next/link";
import Footer from "/components/layout/Footer";
import Header from "/components/layout/Header"; // ✅ Import du composant Header
import { motion } from "framer-motion";
import { Sparkles, Brain, Timer } from "lucide-react"; // 👈 à importer en haut de ton fichier


export default function Home() {
  return (
    <>
      <Head>
        <title>Sonarmo | Ambiance musicale intelligente pour tous</title>
        <meta
          name="description"
          content="Générez votre playlist personnalisée avec Sonarmo, l’outil intelligent pour créer une ambiance sonore unique chez vous ou dans votre établissement."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/sonarmo-experience.png" type="image/png" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Sonarmo | Ambiance musicale intelligente" />
        <meta property="og:description" content="Crée ton ambiance musicale personnalisée grâce à l’intelligence atmosphérique." />
        <meta property="og:image" content="https://www.sonarmo.com/og-sonarmo.jpg" />
        <meta property="og:url" content="https://www.sonarmo.com/" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sonarmo | Ambiance musicale intelligente" />
        <meta name="twitter:description" content="Crée ton ambiance musicale personnalisée grâce à l’intelligence atmosphérique." />
        <meta name="twitter:image" content="https://www.sonarmo.com/og-sonarmo.jpg" />
      </Head>

      <main className="bg-black text-white overflow-x-hidden">
        <Header />

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
      text="Intelligence Atmosphérique"
      animateBy="words"
      direction="top"
      className="w-full"
      highlight={{ Atmosphérique : "text-[#FCE2BA]" }}
      />
    
  </h1>
</div>
          <p className="mx-auto text-gray-400 text-lg mb-12">
            Créez une ambiance musicale sur mesure, que vous soyez un particulier ou un professionnel.
          </p>
          <div className="w-full overflow-hidden relative h-[120px] z-10">
  <AnimatedWave />
</div>
<div className="mt-10">
  <Link
  href="/login"
  className="inline-block bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-8 py-4 rounded-full text-white font-semibold border border-transparent shadow-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(242,133,0,0.5)] hover:-translate-y-1 hover:border-[#F28500]"
>
  Crée ton ambiance
</Link>
</div>

        </section>
        {/* DUAL CTA SECTION */}
        <section className="px-6 py-18 text-center bg-black">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Choisissez votre expérience</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-[#1c1c1c] p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-4 text-[#f58711]">Pour tous</h3>
              <p className="text-gray-400 mb-6">
                Que vous soyez au bord d&apos;une piscine, au travail ou entrain de cuisiner… Une ambiance bien choisie peut tout changer.
                Avec Sonarmo, créez une playlist sur mesure, adaptée à l&apos;instant et à votre humeur.
              </p>
              <Link href="/login" className="inline-block bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-6 py-3 rounded-full text-white font-semibold hover:scale-105 transition-transform">
                Générer ma playlist
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-[#1c1c1c] p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-4 text-[#FF00FF]">Professionnels</h3>
              <p className="text-gray-400 mb-6">
                Un bar qui invite à rester, un café qui respire la douceur, un espace pro qui stimule la concentration…
                Grâce à Sonarmo Pro, offrez à vos clients une ambiance sonore mémorable, pensée pour eux.
              </p>
              <Link href="/experience" className="inline-block bg-gradient-to-r from-[#FF00FF] to-[#F28500] px-6 py-3 rounded-full text-white font-semibold hover:scale-105 transition-transform">
                Découvrir Sonarmo Pro
              </Link>
            </motion.div>
          </div>
        </section>

        {/* IMPACT SECTION AMÉLIORÉE */}
<section className="relative text-center px-10 py-20 overflow-hidden bg-gradient-to-br from-[#1a000b] via-[#0e0b14] to-[#000000]">

  {/* Blobs lumineux pour enrichir le fond */}
  <div className="absolute left-[-100px] top-[-100px] w-[500px] h-[500px] bg-gradient-to-br from-[#FF9400] to-[#FF0BED] rounded-full blur-3xl opacity-10 z-0" />
  <div className="absolute right-[-150px] bottom-[-150px] w-[600px] h-[600px] bg-gradient-to-tr from-[#00FFF0] to-[#2B0036] rounded-full blur-3xl opacity-10 z-0" />
  <div className="absolute left-1/2 top-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-[#FF00FF] to-[#F28500] rounded-full blur-2xl opacity-10 transform -translate-x-1/2 -translate-y-1/2 z-0" />

  {/* Titre & contenus */}
  <p className="text-lg text-[#FCE2BA] uppercase tracking-widest mb-8 relative z-10">
    Pourquoi Sonarmo ?
  </p>

  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.2 }}
    viewport={{ once: true }}
    className="relative z-10"
  >
    <h2 className="text-3xl font-semibold text-white mb-10">Une ambiance qui change tout</h2>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-6xl mx-auto text-gray-300">
      {[
        {
          icon: <Sparkles className="text-white w-10 h-10 mb-4 mx-auto" />,
          value: "100%",
          text: "des playlists sont générées à partir de votre ambiance, votre moment, votre public."
        },
        {
          icon: <Brain className="text-white w-10 h-10 mb-4 mx-auto" />,
          value: "42M",
          text: "de neurones activés quand vous écoutez de la musique que vous aimez."
        },
        {
          icon: <Timer className="text-white w-10 h-10 mb-4 mx-auto" />,
          value: "60 sec",
          text: "pour transformer l’ambiance de votre lieu ou de votre moment."
        }
].map((item, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: index * 0.3 }}
    className="transition-transform duration-300 hover:scale-105"
  >
    {item.icon} {/* 👈 C'était cette ligne qui manquait */}
    <p className="text-5xl font-bold text-white mb-2 drop-shadow-lg hover:drop-shadow-[0_0_12px_rgba(255,133,255,0.8)] transition-all duration-300">
      {item.value}
    </p>
    <p>{item.text}</p>
  </motion.div>
))}
    </div>
  </motion.div>
</section>
<Footer />
        
      </main>
    </>
  );
}
