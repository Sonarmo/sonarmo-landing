// 🎧 PAGE MODIFIÉE : Playlist créée sur le compte Spotify de Sonarmo, plus besoin de connexion utilisateur

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import CreditBadge from "/components/builder/CreditBadge";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { app } from '/lib/firebase';
import LanguageSwitcher from "/components/builder/LanguageSwitcher";

export default function Generateur() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState(null);
  const [promptHistory, setPromptHistory] = useState([]);
  const router = useRouter();
  const [credits, setCredits] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const suggestions = [
  "relaxed", "rainy", "energetic", "morning", "evening", "wine bar",
  "cocktail", "chill", "romantic", "intense", "wood", "lounge",
  "calm", "melancholic", "funk", "jazz", "coffee", "vinyl",
  "sunny", "tropical", "cozy", "focus", "elegant vibe", "minimal",
  "electronic", "classical", "vintage", "underground", "beach", "nighttime"
];

const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!user.emailVerified) {
          alert("⚠️ Please verify your email address before using Sonarmo.");
          await auth.signOut();
          router.push("/login-en");
          return;
        }

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCredits(data.credits ?? 0);
          if (data.abonnementActif === true) {
            console.log("✅ Active subscription detected");
            setCredits("illimité");
          }
        }

        const promptRef = collection(db, "promptHistory");
        const q = query(promptRef, where("uid", "==", user.uid), orderBy("createdAt", "desc"), limit(5));
        const snapshot = await getDocs(q);
        const history = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date()
          };
        });
        setPromptHistory(history);
      } else {
        router.push("/login-en");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGenerate = async () => {
    if (!prompt || prompt.length < 10) {
      alert("Please write a more complete prompt before generating.");
      return;
    }

    setIsLoading(true);
    const res = await fetch("/api/generate-playlist-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    if (res.ok) {
      const data = await res.json();
      console.log("🎧 Playlist URL received:", data.url);
      setPlaylistUrl(data.url);
    } else {
      alert("Error generating the playlist. Try again!");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-stretch p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
        <div className="absolute w-[400px] h-[400px] bg-[#FF00FF] rounded-full blur-[100px] top-[14%] right-1/2 opacity-50" />
        <div className="absolute w-[600px] h-[600px] bg-[#FF9400] rounded-full blur-[100px] top-[45%] right-[25%] opacity-10" />
      </div>

      <header className="flex justify-between items-center px-6 py-4 w-full relative z-10">
        <Link href="/index-en" className="flex items-center gap-2">
  <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
  <span className="text-white text-lg font-semibold italic">Sonarmo</span>
</Link>
        <nav className="hidden md:flex gap-6 text-sm items-center">
          <Link href="/explique-generation-en" className="hover:text-gray-300">PLAYLIST GENERATOR</Link>
          <Link href="/experience-en" className="hover:text-gray-300">SONARMO PRO</Link>
          <Link href="/contact-en" className="hover:text-gray-300">CONTACT US</Link>
          <Link href="/logout" className="hover:text-gray-300 flex items-center gap-1">
            <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
            LOG OUT
          </Link>
          <LanguageSwitcher />
          
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
            <Link href="/explique-generation-en" className="hover:text-gray-300">PLAYLIST GENERATOR</Link>
            <Link href="/experience-en" className="hover:text-gray-300">SONARMO PRO</Link>
            <Link href="/contact-en" className="hover:text-gray-300">CONTACT US</Link>
            <Link href="/logout" className="hover:text-gray-300 flex items-center gap-1">
              <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
              LOG OUT
            </Link>
            <LanguageSwitcher />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex flex-col items-center justify-start flex-grow w-full px-4 md:px-0 pt-20 pb-24 relative z-10">
        {credits !== null && <CreditBadge credits={credits} />}

        <h1 className="text-4xl font-bold mb-15 text-center text-white">
          Create your playlist with Sonarmo AI
        </h1>

        <div className="mb-9 max-w-xl text-gray-400 bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 text-left shadow-md">
  <h2 className="text-white font-semibold mb-4 text-base">How it works</h2>
  <div className="space-y-4">
    <div className="flex items-start gap-4">
      <span className="text-white text-xl font-bold w-6 flex-shrink-0">1.</span>
      <div className="text-white leading-relaxed">
        <p className="mb-2">Describe a musical atmosphere. For example:</p>
        <ul className="list-disc pl-6 space-y-1 text-white">
          <li><em>A wine tasting night with thirty-something friends</em></li>
          <li><em>A late-summer Sunday on a terrace with elegant acoustic tunes</em></li>
          <li><em>A wooden table, candlelight, and intimate jazz in the background</em></li>
        </ul>
      </div>
    </div>
    <div className="flex items-start gap-4">
      <span className="text-white text-xl font-bold w-6 flex-shrink-0">2.</span>
      <p className="text-white leading-relaxed">
        Click on <strong>“Generate”</strong> and discover your personalized playlist in just a few seconds.
      </p>
    </div>
  </div>
</div>

        <div className="w-full max-w-xl">
          <label htmlFor="prompt" className="text-white font-medium mb-2 block">
            Describe your vibe
          </label>

<div className="mb-4 flex flex-wrap gap-2">
  <button
    onClick={() => setShowSuggestions(!showSuggestions)}
    className="bg-[#1f1f1f] border border-gray-700 hover:border-orange-500 text-white text-sm px-3 py-1 rounded-full transition-all hover:scale-105"
  >
    💡 Need some inspiration?
  </button>

  {showSuggestions && suggestions.map((mot, i) => (
    <button
      key={i}
      onClick={() => setPrompt(prev => {
        const mots = prev.split(' ').filter(Boolean);
        return mots.includes(mot)
          ? mots.filter(m => m !== mot).join(' ') // remove if already present
          : [...mots, mot].join(' '); // add if not present
      })}
      className={`bg-[#1f1f1f] border border-gray-700 hover:border-orange-500 text-white text-sm px-3 py-1 rounded-full transition-all hover:scale-105 \${prompt.includes(mot) ? 'bg-orange-600 text-black' : ''}`}
    >
      #{mot}
    </button>
  ))}
</div>


          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: I feel like dancing, but chill. A groovy, relaxed vibe."
            className="w-full h-32 p-4 rounded-xl bg-[#1c1c1c] text-white border border-gray-700 mb-6 resize-none placeholder:text-gray-500"
          />
          <div className="relative group">
            <motion.button
              onClick={handleGenerate}
              disabled={isLoading || !prompt}
              whileTap={{ scale: 0.97 }}
              className="w-full relative z-10 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 overflow-hidden flex justify-center items-center"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="loader ease-linear rounded-full border-4 border-t-4 border-white border-t-transparent h-5 w-5 animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                "Generate my playlist"
              )}
            </motion.button>


    {playlistUrl && (
  <div className="mt-10 text-center bg-[#1c1c1c] p-6 rounded-xl shadow-xl border border-green-500 animate-fade-in">
    <div className="flex items-center justify-center gap-2 mb-3">
      <Image src="/icons/spotify.png" alt="Spotify" width={24} height={24} />
      <p className="text-green-400 font-semibold text-lg">Playlist successfully created</p>
    </div>
    <a
      href={playlistUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mt-2 px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white font-semibold hover:scale-105 transition"
    >
      Listen on Spotify
    </a>
  </div>
)}

    {/* Onde confinée au bouton */}
    <div className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 animate-slide-right" />
  </div>
</div>

  
    <div className="mt-10 flex flex-col items-center animate-fade-in text-center max-w-sm">
      <p className="text-sm text-pink-300 mb-6">
        Not enough credits to generate new playlists?<br />
        Top up your account to keep the Sonarmo experience going.
      </p>
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300 group-hover:scale-105 animate-pulse"></div>
        <button
          onClick={() => router.push("/achat-credits-en")}
          className="relative inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-black border border-pink-500 rounded-xl transition duration-300 hover:scale-105 hover:border-orange-500"
        >
          Top up your account
        </button>
      </div>
    </div>
  

  {promptHistory.length > 0 && (
    <div className="mt-14 w-full max-w-xl">
      <h2 className="text-xl font-semibold mb-4 text-white">Your playlist history</h2>
      <ul className="space-y-4">
        {promptHistory.map((item, idx) => (
          <li key={idx} className="bg-[#1c1c1c] border border-gray-700 p-4 rounded-xl">
            <p className="text-sm text-gray-300 mb-1">{item.playlistName}</p>
            <p className="text-xs text-gray-500">
              {new Date(item.createdAt?.seconds ? item.createdAt.seconds * 1000 : item.createdAt).toLocaleString()}
            </p>
            <a
              href={item.playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 underline hover:text-orange-200 text-sm"
            >
              View on Spotify
            </a>
          </li>
        ))}
      </ul>
    </div>
  )}

  {promptHistory.length === 0 && (
    <div className="mt-20 text-center text-gray-400">
      <p>You haven’t generated a playlist yet.<br /> Start now and discover the sound magic of Sonarmo!</p>
    </div>
  )}
</main>

<footer className="relative z-10 bg-black text-sm text-gray-400 px-6 py-10">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-y-8 w-full">

    {/* Bloc gauche + logo FT (stacké proprement en mobile) */}
    <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6 items-center text-center sm:text-left">

      {/* Réseaux + Liens */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-center sm:justify-start gap-4">
          <a href="https://www.instagram.com/sonarmo_ia/?hl=fr" target="_blank" rel="noopener noreferrer">
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
        <Link href="/about-en" className="hover:text-white">About us</Link>
        <Link href="/contact-en" className="hover:text-white">Contact us</Link>
      </div>

      {/* Logo French Tech (centré sur mobile) */}
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

    {/* Bloc droit = logo Sonarmo + mentions légales */}
    <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2">
      <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
      <p className="text-xs">Sonarmo™</p>
      <Link href="/cgu" className="text-sm hover:underline">Terms of Use & Privacy Policy</Link>
      <Link href="/mentions-legales" className="text-sm hover:underline">Legal Notice</Link>
      <Link href="/conditions-vente" className="text-sm hover:underline">Terms of Sale</Link>
    </div>

  </div>
</footer>
    </div>
  );
}