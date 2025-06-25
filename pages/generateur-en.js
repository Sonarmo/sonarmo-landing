import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import CreditBadge from "/components/builder/CreditBadge";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { app } from '/lib/firebase'
import LanguageSwitcher from "/components/builder/LanguageSwitcher";

export default function Generateur() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [spotifyProfile, setSpotifyProfile] = useState(null);
  const [promptHistory, setPromptHistory] = useState([]);
  const router = useRouter();
  const [credits, setCredits] = useState(null);

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

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const res = await fetch("/api/refresh-spotify-token");
        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.access_token);
          console.log("🔄 Token Spotify rafraîchi automatiquement");
        } else {
          console.warn("⚠️ Échec du rafraîchissement du token Spotify");
        }
      } catch (err) {
        console.error("❌ Erreur lors du rafraîchissement du token :", err);
      }
    };

    if (isAuthenticated) {
      refreshToken();
      const interval = setInterval(refreshToken, 55 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

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
  body: JSON.stringify({
    prompt,
    lang: "en" // 👈 indique que ce prompt est en anglais
  })
});

    if (res.ok) {
      const data = await res.json();
      console.log("🎧 Playlist URL reçue :", data.url);
      setPlaylistUrl(data.url);
    } else {
      alert("Something went wrong during generation. Try again!");
    }
    setIsLoading(false);
  };

  const handleSpotifyDisconnect = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
    setSpotifyProfile(null);
    router.replace("/generateur-en");
  };

  return (
<div className="min-h-screen bg-black text-white flex flex-col items-stretch p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
        <div className="absolute w-[400px] h-[400px] bg-[#FF00FF] rounded-full blur-[100px] top-[14%] right-1/2 opacity-50" />
        <div className="absolute w-[600px] h-[600px] bg-[#FF9400] rounded-full blur-[100px] top-[45%] right-[25%] opacity-10" />
      </div>

      <header className="flex justify-between items-center px-6 py-4 w-full relative z-10">
        <Link href="/index-en" passHref>
  <a className="flex items-center gap-2">
    <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
    <span className="text-white text-lg font-semibold italic">Sonarmo</span>
  </a>
</Link>
        <nav className="hidden md:flex gap-6 text-sm items-center">
          <Link href="/explique-generation-en" className="hover:text-gray-300">PLAYLIST GENERATOR</Link>
          <Link href="/experience-en" className="hover:text-gray-300">SONARMO PRO</Link>
          <Link href="/contact-en" className="hover:text-gray-300">CONTACT US</Link>
          <Link href="/logout" className="hover:text-gray-300 flex items-center gap-1">
            <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
            LOGOUT
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
              LOGOUT
            </Link>
            <LanguageSwitcher />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex flex-col items-center justify-start flex-grow w-full px-4 md:px-0 pt-20 pb-24 relative z-10">
  {credits !== null && <CreditBadge credits={credits} />}

  <h1 className="text-4xl font-bold mb-8 text-center text-white">Create your playlist with Sonarmo AI</h1>
  <div className="mb-8 max-w-xl text-gray-400 bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 text-left shadow-md">
  <h2 className="text-white font-semibold mb-4 text-base">How it works</h2>
  <div className="space-y-4">
    <div className="flex items-start gap-4">
      <span className="text-white text-xl font-bold w-6 flex-shrink-0">1.</span>
      <p className="text-white leading-relaxed">
        Connect your <strong>Spotify</strong> account to allow the playlist to be created directly on your profile.
      </p>
    </div>
    <div className="flex items-start gap-4">
      <span className="text-white text-xl font-bold w-6 flex-shrink-0">2.</span>
      <p className="text-white leading-relaxed">
        Describe a mood or vibe (e.g., <em>Chill jazz for a cozy dinner with friends</em>).
      </p>
    </div>
    <div className="flex items-start gap-4">
      <span className="text-white text-xl font-bold w-6 flex-shrink-0">3.</span>
      <p className="text-white leading-relaxed">
        Click <strong>“Generate”</strong> and enjoy your custom playlist within seconds.
      </p>
    </div>
    <Link href="/achat-credits-en" className="block mt-6">
  <div className="bg-[#292929] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white text-center hover:border-pink-500 hover:text-pink-300 transition duration-200">
    Enjoy <strong>2 free playlist </strong>generations to get started!
  </div>
</Link>
  </div>
</div>

  {!isAuthenticated && (
    <Link
      href="/api/login-user"
      className="mb-10 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl text-white font-semibold"
    >
      Connect to Spotify
    </Link>
  )}

  {spotifyProfile && (
    <div className="mb-8 text-sm text-gray-300 bg-[#1c1c1c] p-4 rounded-xl text-center max-w-md">
      Connected with <strong>{spotifyProfile.email}</strong><br />
      {spotifyProfile.name && <span>Welcome, {spotifyProfile.name} !</span>}<br />
      <button
        onClick={handleSpotifyDisconnect}
        className="mt-3 text-red-500 underline hover:text-red-300"
      >
        Disconnect from Spotify
      </button>
    </div>
  )}

  <div className="w-full max-w-xl">
  <label htmlFor="prompt" className="text-white font-medium mb-2 block">
    Describe your atmosphere
  </label>

  <textarea
    id="prompt"
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
    placeholder="Ex : I feel like dancing, but calm. A groovy and relaxed vibe."
    className="w-full h-32 p-4 rounded-xl bg-[#1c1c1c] text-white border border-gray-700 mb-6 resize-none placeholder:text-gray-500"
  />

  {/* 🌟 Effet de survol lumineux sur le bouton */}
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
      <p className="text-green-400 font-semibold text-lg">Your playlist has been successfully created</p>
    </div>
    <a
      href={playlistUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mt-2 px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white font-semibold hover:scale-105 transition"
    >
      Open in Spotify
    </a>
  </div>
)}

    {/* Onde confinée au bouton */}
    <div className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 animate-slide-right" />
  </div>
</div>

  
    <div className="mt-10 flex flex-col items-center animate-fade-in text-center max-w-sm">
      <p className="text-sm text-pink-300 mb-6">
        Not enough credits left to generate a new playlist?<br />
        Recharge your account to continue the Sonarmo experience.
      </p>
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300 group-hover:scale-105 animate-pulse"></div>
        <button
          onClick={() => router.push("/achat-credits-en")}
          className="relative inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-black border border-pink-500 rounded-xl transition duration-300 hover:scale-105 hover:border-orange-500"
        >
          Recharge your account
        </button>
      </div>
    </div>


  {promptHistory.length > 0 && (
    <div className="mt-14 w-full max-w-xl">
      <h2 className="text-xl font-semibold mb-4 text-white">History of your playlists</h2>
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
              Open in Spotify
            </a>
          </li>
        ))}
      </ul>
    </div>
  )}

  {promptHistory.length === 0 && (
    <div className="mt-20 text-center text-gray-400">
      <p>You haven&apos;t generated a playlist yet.<br /> Go ahead and discover the sound magic of Sonarmo!</p>
    </div>
  )}
</main>

      <footer className="bg-black text-sm text-gray-400 px-6 py-10 w-full mt-20 relative z-10">
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-y-8 w-full">

    {/* Bloc gauche + logo FT (responsive alignement) */}
    <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6 items-center text-center sm:text-left">

      {/* Réseaux + Liens */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-center sm:justify-start gap-4">
          <a href="https://www.instagram.com/sonarmo_ia/?hl=fr" target="_blank" rel="noopener noreferrer">
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
        <Link href="/about-en" className="hover:text-white">About us</Link>
        <Link href="/contact-en" className="hover:text-white">Contact us</Link>
      </div>

      {/* Logo French Tech Est */}
      <div className="mt-4 sm:mt-0 sm:ml-3 flex justify-center sm:justify-start">
        <Image
          src="/icons/Logo_FT.png"
          alt="French Tech Est Logo"
          width={80}
          height={80}
          className="opacity-90"
        />
      </div>

    </div>

    {/* Bloc droit : Logo Sonarmo + Mentions */}
    <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2">
      <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
      <p className="text-xs">Sonarmo™</p>
      <p className="text-xs hover:underline">Terms &amp; Conditions of Use &amp; Privacy Policy</p>
    </div>
  </div>
</footer>
    </div>
  );
}