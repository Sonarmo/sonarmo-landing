import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";

const playlistUrls = {
    "Lounge Chill 🌙": "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6",
    "Apéro Festif 🍹": "https://open.spotify.com/playlist/37i9dQZF1DWZwtERXCS82H",
    "Night Club 🔥": "https://open.spotify.com/playlist/37i9dQZF1DX4dyzvuaRJ0n",
    "Café Cosy ☕": "https://open.spotify.com/playlist/37i9dQZF1DX6VdMW310YC7"
};

export default function Dashboard() {
    const router = useRouter();
    const pathname = usePathname();

    const [loading, setLoading] = useState(true);
    const [ambiance, setAmbiance] = useState("Lounge Chill 🌙");
    const [showAmbiance, setShowAmbiance] = useState(true);
    const [showToast, setShowToast] = useState(false);

    const [accessToken, setAccessToken] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [player, setPlayer] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);

    const handleAmbianceChange = (e) => {
        setShowAmbiance(false);
        setTimeout(() => {
            setAmbiance(e.target.value);
            setShowAmbiance(true);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }, 300);
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) return router.push("/login");
            setLoading(false);

            const docSnap = await getDoc(doc(db, "users", user.uid));
            if (docSnap.exists()) {
                setAccessToken(docSnap.data().spotifyAccessToken);
            }
        });
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        if (!accessToken || player) return;

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const newPlayer = new window.Spotify.Player({
                name: "Sonarmo Player",
                getOAuthToken: cb => cb(accessToken),
                volume: 0.5,
            });

            newPlayer.addListener("ready", ({ device_id }) => {
                console.log("✅ Player prêt :", device_id);
                setDeviceId(device_id);
            });

            newPlayer.connect();
            setPlayer(newPlayer);
        };
    }, [accessToken, player]);

    const handlePlay = async () => {
        if (!deviceId || !accessToken) return;

        const uri = playlistUrls[ambiance]
            .replace("https://open.spotify.com/playlist/", "spotify:playlist:")
            .replace("/embed", "");

        const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                context_uri: uri,
                offset: { position: 0 },
                position_ms: 0,
            }),
        });

        if (res.status === 204) {
            console.log("▶️ Lecture lancée !");
        } else {
            console.error("❌ Erreur lecture :", await res.json());
        }
    };

    const fetchCurrentTrack = async () => {
        if (!accessToken) return;

        try {
            const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (res.status === 204) {
                setCurrentTrack(null);
                return;
            }

            const data = await res.json();
            if (data && data.item) {
                setCurrentTrack({
                    name: data.item.name,
                    artist: data.item.artists.map(a => a.name).join(", "),
                    image: data.item.album.images[0]?.url,
                });
            }
        } catch (err) {
            console.error("❌ Erreur lecture en cours :", err);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchCurrentTrack();
        }, 5000);
        return () => clearInterval(interval);
    }, [accessToken]);
    if (loading) {
        return <div className="text-white min-h-screen flex items-center justify-center">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-[#121212] flex flex-col md:flex-row font-[Poppins]">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#1c1c1c] text-gray-300 p-6 flex flex-col gap-8">
                <Link href="/dashboard" className="flex items-center gap-3 mb-8">
                    <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={140} height={40} />
                </Link>

                <nav className="flex flex-col gap-6 text-sm">
                    <Link href="/dashboard" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard" ? "text-white" : ""}`}>
                        <Image src="/icons/home.png" alt="Home" width={24} height={24} />
                        Dashboard
                    </Link>
                    <Link href="/dashboard/music" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard/music" ? "text-white" : ""}`}>
                        <Image src="/icons/music.png" alt="Music" width={24} height={24} />
                        Musique
                    </Link>
                    <Link href="/dashboard/analytics" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard/analytics" ? "text-white" : ""}`}>
                        <Image src="/icons/analytics.png" alt="Analytics" width={24} height={24} />
                        Analyses
                    </Link>
                    <Link href="/dashboard/settings" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard/settings" ? "text-white" : ""}`}>
                        <Image src="/icons/settings.png" alt="Settings" width={24} height={24} />
                        Réglages
                    </Link>
                    <Link href="/dashboard/profile" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard/profile" ? "text-white" : ""}`}>
                        <Image src="/icons/profile.png" alt="Profile" width={24} height={24} />
                        Profil
                    </Link>
                    <Link href="/logout" className="flex items-center gap-4 hover:text-white mt-8">
                        <Image src="/icons/logout.png" alt="Logout" width={24} height={24} />
                        Déconnexion
                    </Link>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 md:p-10 text-white">
                <h1 className="text-3xl font-bold mb-6">Bienvenue sur ton Dashboard 🎶</h1>

                {/* Ambiance */}
                <section className="bg-[#1c1c1c] rounded-xl p-6 md:p-8 shadow-lg mb-10">
                    <h2 className="text-2xl font-semibold mb-6">Ambiance actuelle</h2>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left min-h-[60px]">
                            <AnimatePresence mode="wait">
                                {showAmbiance && (
                                    <motion.div
                                        key={ambiance}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <p className="text-lg font-light">{ambiance}</p>
                                        <p className="text-gray-400 text-sm">Adaptée à l&apos;heure actuelle</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <select
                            value={ambiance}
                            onChange={handleAmbianceChange}
                            className="bg-[#121212] border border-gray-600 rounded-full px-6 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#F28500]"
                        >
                            {Object.keys(playlistUrls).map(key => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                    </div>
                </section>

                {/* Player */}
                <section className="bg-[#1c1c1c] rounded-xl p-6 md:p-8 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Lecteur Spotify connecté 🎧</h2>

                    {!deviceId ? (
                        <p className="text-gray-400">Chargement du lecteur Spotify...</p>
                    ) : (
                        <div className="flex flex-col gap-6">
                                <button
                                    onClick={handlePlay}
                                    className="bg-green-500 hover:bg-green-600 transition px-5 py-2 rounded-lg font-semibold text-white shadow"
                                >
                                    ▶️ Lancer l&apos;ambiance &quot;{ambiance}&quot;

                                </button>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => player?.togglePlay()}
                                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white"
                                >
                                    ⏯️ Lecture / Pause
                                </button>
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    defaultValue={0.5}
                                    onChange={(e) => player?.setVolume(parseFloat(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            {/* Now Playing */}
                            {currentTrack && (
                                <div className="flex items-center gap-4 bg-[#2a2a2a] p-4 rounded-lg animate-wave">
                                    {currentTrack.image && (
                                        <Image
                                            src={currentTrack.image}
                                            alt="Pochette"
                                            width={64}
                                            height={64}
                                            className="rounded-md"
                                        />
                                    )}
                                    <div>
                                        <p className="text-white font-medium">{currentTrack.name}</p>
                                        <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
                                    </div>
                                    <div className="flex ml-auto gap-[3px] h-10 items-end">
                                        <div className="bg-green-500 w-1 animate-wave-bar [animation-delay:.1s]"></div>
                                        <div className="bg-green-500 w-1 animate-wave-bar [animation-delay:.2s]"></div>
                                        <div className="bg-green-500 w-1 animate-wave-bar [animation-delay:.3s]"></div>
                                        <div className="bg-green-500 w-1 animate-wave-bar [animation-delay:.4s]"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                <p className="mt-10">Commence à explorer l&apos;univers de ton ambiance musicale personnalisée.</p>
            </main>

            {/* Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.5 }}
                        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1DB954] text-white px-6 py-3 rounded-full shadow-lg"
                    >
                        Ambiance changée avec succès ✔️
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
        @keyframes waveBar {
          0% { height: 20%; }
          50% { height: 100%; }
          100% { height: 20%; }
        }
        .animate-wave-bar {
          animation: waveBar 1s infinite ease-in-out;
        }
      `}</style>
        </div>
    );
}
