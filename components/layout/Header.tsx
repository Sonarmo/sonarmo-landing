"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import LanguageSwitcher from "../builder/LanguageSwitcher"; // ajuste le chemin si besoin

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black text-white">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo + Titre */}
        <Link href="/" className="flex items-center gap-2">
  <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
  <span className="text-white text-lg font-semibold italic">Sonarmo</span>
</Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex gap-6 text-sm items-center z-[9999]">
          <Link href="/explique-generation" className="hover:text-gray-300">GÉNÉRATEUR DE PLAYLIST</Link>
          <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
          <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
          <Link href="/blog" className="hover:text-gray-300">BLOG</Link>
          <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
            <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
            SE CONNECTER
          </Link>
          <LanguageSwitcher />
        </nav>

        {/* Menu Burger */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden px-6 py-4 bg-[#1c1c1c] shadow-lg flex flex-col gap-4 text-sm z-[9999]"
          >
            <Link href="/explique-generation" className="hover:text-gray-300">GÉNÉRATEUR DE PLAYLIST</Link>
            <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
            <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
            <Link href="/blog" className="hover:text-gray-300">BLOG</Link>
            <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
              <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
              SE CONNECTER
            </Link>
            <LanguageSwitcher />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}