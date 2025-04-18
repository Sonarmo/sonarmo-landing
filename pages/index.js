import Image from "next/image";
import { motion } from "framer-motion";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="relative bg-[#121212] text-white font-[Poppins] min-h-screen overflow-hidden">
        {/* Light glow background */}
        <div className="absolute right-0 top-1/2 w-[400px] h-[400px] bg-gradient-to-br from-[#F28500] via-transparent to-[#FF00FF] rounded-full blur-3xl opacity-30 transform translate-y-[-50%] translate-x-[30%] z-0" />

        {/* Header */}
        <header className="relative z-10 w-full flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <Image src="/logo-sonarmo-officiel.png" alt="Logo" width={40} height={40} />
            <span className="text-lg font-semibold">Sonarmo</span>
          </div>
          <nav className="flex gap-6 items-center text-sm">
            <a href="#services" className="hover:text-gray-300">Nos services</a>
            <a href="#contact" className="hover:text-gray-300">Contactez-nous</a>
            <a href="#login" className="hover:text-gray-300 flex items-center gap-1">
              <Image src="/logo-sonarmo-officiel.png" alt="Mini Logo" width={16} height={16} />
              Se connecter
            </a>
          </nav>
        </header>

        {/* Hero Section */}
        <motion.section
          className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <Image
            src="/logo-sonarmo-officiel.png"
            alt="Sonarmo Logo"
            width={160}
            height={160}
            className="mb-8"
          />
          <h1 className="text-4xl sm:text-5xl font-light mb-6 bg-gradient-to-r from-white to-[#FFD1F9] bg-clip-text text-transparent">
            Intelligence Atmosphérique
          </h1>
          <p className="max-w-xl text-base sm:text-lg text-gray-300 mb-8">
            Chaque lieu à une histoire, une identité unique. Sonarmo crée une ambiance sonore personnalisée, pensée spécialement pour refléter l&apos;âme de votre espace et offrir une expérience immersive incomparable.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 rounded-full text-white font-medium text-sm bg-gradient-to-r from-[#F28500] to-[#FF00FF] transition shadow-md shadow-[#F28500]/30"
          >
            Découvrez Sonarmo
          </motion.button>
        </motion.section>
      </main>
    </>
  );
}
