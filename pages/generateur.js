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
    "détente", "pluie", "énergique", "matin", "soirée", "bar à vin",
    "cocktail", "chill", "romantique", "intense", "bois", "lounge",
    "calme", "mélancolique", "funk", "jazz", "café", "vinyle",
    "soleil", "tropical", "cosy", "focus", "ambiance chic", "minimal",
    "électro", "classique", "vintage", "underground", "plage", "nocturne"
  ];
  const [showSuggestions, setShowSuggestions] = useState(false);


  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!user.emailVerified) {
          alert("⚠️ Veuillez vérifier votre adresse email avant d'utiliser Sonarmo.");
          await auth.signOut();
          router.push("/login");
          return;
        }

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCredits(data.credits ?? 0);
          if (data.abonnementActif === true) {
            console.log("✅ Abonnement actif détecté");
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
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGenerate = async () => {
    if (!prompt || prompt.length < 10) {
      alert("Merci d'écrire un prompt plus complet avant de générer.");
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
      console.log("🎧 Playlist URL reçue :", data.url);
      setPlaylistUrl(data.url);
    } else {
      alert("Erreur lors de la génération. Réessaie !");
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
        <Link href="/" className="flex items-center gap-2">
  <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
  <span className="text-white text-lg font-semibold italic">Sonarmo</span>
</Link>
        <nav className="hidden md:flex gap-6 text-sm items-center">
          <Link href="/explique-generation" className="hover:text-gray-300">GENERATEUR DE PLAYLIST</Link>
          <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
          <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
          <Link href="/logout" className="hover:text-gray-300 flex items-center gap-1">
            <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
            SE DECONNECTER
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
            <Link href="/explique-generation" className="hover:text-gray-300">GENERATEUR DE PLAYLIST</Link>
            <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
            <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
            <Link href="/logout" className="hover:text-gray-300 flex items-center gap-1">
              <Image src="/favicon.png" alt="Mini Logo" width={20} height={20} />
              SE DECONNECTER
            </Link>
            <LanguageSwitcher />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex flex-col items-center justify-start flex-grow w-full px-4 md:px-0 pt-20 pb-24 relative z-10">
        {credits !== null && <CreditBadge credits={credits} />}

        <h1 className="text-4xl font-bold mb-15 text-center text-white">
          Crée ta playlist avec Sonarmo IA
        </h1>

      <div className="mb-9 max-w-xl text-gray-400 bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 text-left shadow-md">
  <h2 className="text-white font-semibold mb-4 text-base">Comment ça marche</h2>
  <div className="space-y-4">
    <div className="flex items-start gap-4">
      <span className="text-white text-xl font-bold w-6 flex-shrink-0">1.</span>
      <div className="text-white leading-relaxed">
        <p className="mb-2">Décris une ambiance musicale. Par exemple :</p>
        <ul className="list-disc pl-6 space-y-1 text-white">
          <li><em>Une soirée dégustation de vins rouges entre amis de 30 ans</em></li>
          <li><em>Un dimanche de fin d’été en terrasse avec une ambiance acoustique élégante</em></li>
          <li><em>Une table en bois, des bougies et un fond de jazz confidentiel</em></li>
        </ul>
      </div>
    </div>
    <div className="flex items-start gap-4">
      <span className="text-white text-xl font-bold w-6 flex-shrink-0">2.</span>
      <p className="text-white leading-relaxed">
        Clique sur <strong>“Générer”</strong> et découvre ta playlist personnalisée en quelques secondes.
      </p>
    </div>
  </div>
</div>
        <div className="w-full max-w-xl">
          <label htmlFor="prompt" className="text-white font-medium mb-2 block">
            Décris ton ambiance
          </label>

<div className="mb-4 flex flex-wrap gap-2">
  <button
    onClick={() => setShowSuggestions(!showSuggestions)}
    className="bg-[#1f1f1f] border border-gray-700 hover:border-orange-500 text-white text-sm px-3 py-1 rounded-full transition-all hover:scale-105"
  >
    💡 Besoin d&apos;inspiration ?
  </button>

  {showSuggestions && suggestions.map((mot, i) => (
    <button
      key={i}
      onClick={() => setPrompt(prev => {
        const mots = prev.split(' ').filter(Boolean);
        return mots.includes(mot)
          ? mots.filter(m => m !== mot).join(' ') // suppression si déjà présent
          : [...mots, mot].join(' '); // ajout si absent
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
            placeholder="Ex : J’ai envie de danser, mais tranquille. Une vibe groovy et détendue."
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
                  <span>Génération en cours...</span>
                </div>
              ) : (
                "Générer ma playlist"
              )}
            </motion.button>


    {playlistUrl && (
  <div className="mt-10 text-center bg-[#1c1c1c] p-6 rounded-xl shadow-xl border border-green-500 animate-fade-in">
    <div className="flex items-center justify-center gap-2 mb-3">
      <Image src="/icons/spotify.png" alt="Spotify" width={24} height={24} />
      <p className="text-green-400 font-semibold text-lg">Playlist créée avec succès</p>
    </div>
    <a
      href={playlistUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mt-2 px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white font-semibold hover:scale-105 transition"
    >
      Écouter sur Spotify
    </a>
  </div>
)}

    {/* Onde confinée au bouton */}
    <div className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 animate-slide-right" />
  </div>
</div>

  
    <div className="mt-10 flex flex-col items-center animate-fade-in text-center max-w-sm">
      <p className="text-sm text-pink-300 mb-6">
        Plus assez de crédits pour générer de nouvelles playlists ?<br />
        Recharge ton compte pour continuer l&apos;expérience Sonarmo.
      </p>
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300 group-hover:scale-105 animate-pulse"></div>
        <button
          onClick={() => router.push("/achat-credits")}
          className="relative inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-black border border-pink-500 rounded-xl transition duration-300 hover:scale-105 hover:border-orange-500"
        >
          Recharge ton compte
        </button>
      </div>
    </div>
  

  {promptHistory.length > 0 && (
    <div className="mt-14 w-full max-w-xl">
      <h2 className="text-xl font-semibold mb-4 text-white">Historique de tes playlists</h2>
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
              Voir sur Spotify
            </a>
          </li>
        ))}
      </ul>
    </div>
  )}

  {promptHistory.length === 0 && (
    <div className="mt-20 text-center text-gray-400">
      <p>Tu n’as pas encore généré de playlist.<br /> Lance-toi et découvre la magie sonore de Sonarmo !</p>
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
        <Link href="/about" className="hover:text-white">À propos de nous</Link>
        <Link href="/contact" className="hover:text-white">Nous contacter</Link>
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
      <Link href="/cgu" className="text-sm hover:underline">Conditions d&apos;utilisation &amp; Politique de confidentialité</Link>
      <Link href="/mentions-legales" className="text-sm hover:underline">Mentions légales</Link>
      <Link href="/conditions-vente" className="text-sm hover:underline">Conditions de vente</Link>
    </div>

  </div>
</footer>
    </div>
  );
}