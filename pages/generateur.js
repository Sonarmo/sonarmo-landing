// pages/generateur.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import CreditBadge from "@/components/builder/CreditBadge";

export default function Generateur() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [spotifyProfile, setSpotifyProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const accessToken = router.query.access_token;
    if (accessToken) {
      setAccessToken(accessToken);
      setIsAuthenticated(true);

      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.email) {
            setSpotifyProfile({
              name: data.display_name,
              email: data.email,
              image: data.images?.[0]?.url || null,
            });
          }
        })
        .catch((err) => {
          console.error("Erreur récupération profil Spotify :", err);
        });
    } else {
      setIsAuthenticated(false);
    }
  }, [router.query.access_token]);

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      router.push("/api/login-user");
      return;
    }

    setIsLoading(true);
    const res = await fetch("/api/generate-playlist-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
      },
      body: JSON.stringify({ prompt })
    });

    if (res.ok) {
      const data = await res.json();
      setPlaylistUrl(data.playlistUrl);
    } else {
      alert("Erreur lors de la génération. Réessaie !");
    }
    setIsLoading(false);
  };

  const handleSpotifyDisconnect = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
    setSpotifyProfile(null);
    router.replace("/generateur");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-60" />
        <div className="absolute w-[300px] h-[300px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-50" />
      </div>

      <header className="flex justify-between items-center px-6 py-4 w-full relative z-10">
        <div className="flex items-center gap-2">
          <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
          <span className="text-white text-lg font-semibold italic">Sonarmo</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm items-center">
          <Link href="/explique-generation" className="hover:text-gray-300">GENERATEUR DE PLAYLIST</Link>
          <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
          <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
          <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
            <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
            SE CONNECTER
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/index-en" className="text-sm text-gray-400 hover:text-white border px-2 py-1 rounded">
              EN
            </Link>
          </div>
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
            className="md:hidden px-6 py-4 bg-[#1c1c1c] shadow-lg flex flex-col gap-4 text-sm z-50 w-full"
          >
            <Link href="/explique-generation" className="hover:text-gray-300">GENERATEUR DE PLAYLIST</Link>
            <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
            <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
            <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
              <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
              SE CONNECTER
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/index-en" className="text-sm text-gray-400 hover:text-white border px-2 py-1 rounded">
                EN
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex flex-col items-center justify-center flex-grow w-full relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Crée ta playlist avec Sonarmo IA</h1>

        {!isAuthenticated && (
          <Link
            href="/api/login-user"
            className="mb-6 bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
          >
            Se connecter à Spotify
          </Link>
        )}

        {spotifyProfile && (
          <div className="mt-4 text-sm text-gray-300 bg-[#1c1c1c] p-4 rounded-xl text-center">
            ✅ Connecté avec <strong>{spotifyProfile.email}</strong><br />
            {spotifyProfile.name && <span>Bienvenue, {spotifyProfile.name} !</span>}<br />
            <button
              onClick={handleSpotifyDisconnect}
              className="mt-4 text-red-500 underline hover:text-red-300"
            >
              Se déconnecter de Spotify
            </button>
          </div>
        )}

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Décris ton ambiance idéale..."
          className="w-full max-w-xl p-4 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 mb-4"
        />

        <motion.button
          onClick={handleGenerate}
          disabled={isLoading || !prompt}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl disabled:opacity-50"
        >
          {isLoading ? "Génération en cours..." : "🎶 Générer ma playlist"}
        </motion.button>

        {playlistUrl && (
          <div className="mt-6">
            <a
              href={playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-orange-400 hover:text-orange-200"
            >
              🎧 Voir ma playlist sur Spotify
            </a>
          </div>
        )}
      </main>
<CreditBadge />
      <footer className="bg-[#121212] text-sm text-gray-400 px-6 py-10 mt-20 w-full relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-col gap-2 mb-6 md:mb-0">
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/sonarmo_music/?hl=fr" target="_blank" rel="noopener noreferrer">
                <Image src="/icons/instagram.png" alt="Instagram" width={24} height={24} className="hover:opacity-70 transition" />
              </a>
              <a href="https://www.linkedin.com/company/sonarmo/" target="_blank" rel="noopener noreferrer">
                <Image src="/icons/linkedin.png" alt="LinkedIn" width={24} height={24} className="hover:opacity-70 transition" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61574580608705" target="_blank" rel="noopener noreferrer">
                <Image src="/icons/facebook.png" alt="Facebook" width={24} height={24} className="hover:opacity-70 transition" />
              </a>
            </div>
            <Link href="/sonarmo-team" className="hover:text-white">Sonarmo Team</Link>
            <Link href="/about" className="hover:text-white">A propos de nous</Link>
            <Link href="/contact" className="hover:text-white">Nous contacter</Link>
          </div>
          <div className="flex flex-col items-end text-right gap-2">
            <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
            <p className="text-xs">©2025 Sonarmo Team. All Rights Reserved</p>
            <p className="text-xs">Terms of Use & Privacy Policy</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
