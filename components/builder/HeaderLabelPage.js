'use client'; // supprime cette ligne si tu es en pages router (pas app router)

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function HeaderLabelPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white text-black shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
            <span className="text-black text-lg font-semibold italic">Sonarmo</span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6 text-sm items-center">
          <Link href="/explique-generation" className="hover:text-gray-600">GÉNÉRATEUR DE PLAYLIST</Link>
          <Link href="/experience" className="hover:text-gray-600">SONARMO PRO</Link>
          <Link href="/contact" className="hover:text-gray-600">CONTACTEZ-NOUS</Link>
          <Link href="/blog" className="hover:text-gray-600">BLOG</Link>
          <Link href="/login" className="hover:text-gray-600 flex items-center gap-1">
            <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
            SE CONNECTER
          </Link>
        
        </nav>

        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
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

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden px-6 py-4 bg-white text-black shadow-lg flex flex-col gap-4 text-sm z-50"
          >
            <Link href="/explique-generation" className="hover:text-gray-600">GÉNÉRATEUR DE PLAYLIST</Link>
            <Link href="/experience" className="hover:text-gray-600">SONARMO PRO</Link>
            <Link href="/contact" className="hover:text-gray-600">CONTACTEZ-NOUS</Link>
            <Link href="/blog" className="hover:text-gray-600">BLOG</Link>
            <Link href="/login" className="hover:text-gray-600 flex items-center gap-1">
              <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
              SE CONNECTER
            </Link>
       
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}