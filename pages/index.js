import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl flex flex-col items-center">
        {/* Logo fade-in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <Image
            src="/logo-sonarmo-officiel.png"
            alt="Logo Sonarmo"
            width={200}
            height={200}
            className="w-auto h-auto"
          />
        </motion.div>

        {/* Vague animée */}
        <motion.svg
          width="100%"
          height="80"
          viewBox="0 0 300 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mt-8"
        >
          <motion.path
            d="M0 40 C 50 0, 100 80, 150 40 S 250 80, 300 40"
            stroke="url(#gradient)"
            strokeWidth="4"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1.5 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F28500" />
              <stop offset="1" stopColor="#FF00FF" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Coming Soon */}
        {showText && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="mt-6 text-white text-xl sm:text-2xl md:text-3xl tracking-wide text-center"
          >
            Coming Soon
          </motion.p>
        )}
      </div>
    </main>
  );
}
