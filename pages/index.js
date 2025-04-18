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
      <main className="bg-[#121212] text-white font-[Poppins]">
        {/* HEADER */}
        <header className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <Image src="/logo-sonarmo-officiel.png" alt="Logo" width={32} height={32} />
            <span className="text-white text-lg font-semibold">Sonarmo</span>
          </div>
          <nav className="flex gap-6 text-sm items-center">
            <a href="#services" className="hover:text-gray-300">NOTRE SERVICE</a>
            <a href="#contact" className="hover:text-gray-300">CONTACTEZ-NOUS</a>
            <a href="#login" className="hover:text-gray-300 flex items-center gap-1">
              <Image src="/logo-sonarmo-officiel.png" alt="Mini Logo" width={14} height={14} />
              SE CONNECTER
            </a>
          </nav>
        </header>

        {/* HERO SECTION */}
        <section className="relative text-center px-4 py-20 overflow-hidden">
          <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-gradient-to-br from-[#F28500] to-[#FF00FF] rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3 z-0" />

          <div className="relative z-10 flex flex-col items-center">
            <Image
              src="/logo-sonarmo-officiel.png"
              alt="Sonarmo Logo"
              width={80}
              height={80}
              className="mb-6"
            />
            <h1 className="text-5xl font-semibold mb-4">
              <span className="text-white">Intelligence </span>
              <span className="text-[#FCE2BA]">Atmosphérique</span>
            </h1>
            <p className="max-w-xl text-gray-400 text-base sm:text-lg mb-8">
              Chaque lieu à une histoire, une identité unique. Sonarmo crée une ambiance sonore personnalisée, pensée spécialement pour refléter l&apos;âme de votre espace et offrir une expérience immersive incomparable.
            </p>
            <button className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-6 py-3 rounded-full text-white font-semibold shadow-md">
              Découvrir
            </button>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="relative text-center px-4 py-20 overflow-hidden">
          <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-gradient-to-br from-[#F28500] to-[#FF00FF] rounded-full blur-3xl opacity-30 -translate-x-1/3 z-0" />

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl font-semibold mb-4">Nous contacter</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Une question, une idée, ou juste envie d&apos;en parler ? Faites-nous signe, on adore discuter !
            </p>
            <button className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-6 py-3 rounded-full text-white font-semibold shadow-md">
              ON S&apos;APPELLE ?
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#121212] text-sm text-gray-400 border-t border-gray-700 px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex flex-col gap-2 mb-6 md:mb-0">
              <div className="flex items-center gap-4">
                <Image src="/icons/instagram.svg" alt="Instagram" width={20} height={20} />
                <Image src="/icons/linkedin.svg" alt="LinkedIn" width={20} height={20} />
                <Image src="/icons/facebook.svg" alt="Facebook" width={20} height={20} />
              </div>
              <p>Sonarmo Team</p>
              <a href="#" className="hover:text-white">A propos de nous</a>
              <a href="#" className="hover:text-white">Nous contacter</a>
            </div>
            <div className="flex flex-col items-end text-right gap-2">
              <Image src="/logo-sonarmo-officiel.png" alt="Sonarmo Logo" width={100} height={30} />
              <p className="text-xs">&copy;2025 Sonarmo Team. All Rights Reserved</p>
              <p className="text-xs">Terms of Use &amp; Privacy Policy</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}