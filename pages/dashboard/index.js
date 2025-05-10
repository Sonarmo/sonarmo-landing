// dashboard.js avec sidebar + lecteur Spotify amélioré + refresh automatique du token + sélection de playlists utilisateur

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
    const [isPlaying, setIsPlaying] = useState(false);

    const [accessToken, setAccessToken] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [player, setPlayer] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [userPlaylists, setUserPlaylists] = useState([]);

    const handleAmbianceChange = (e) => {
        setShowAmbiance(false);
        setTimeout(() => {
            setAmbiance(e.target.value);
            setShowAmbiance(true);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }, 300);
    };

    const refreshAccessToken = async () => {
        try {
            const res = await fetch("/api/refresh-spotify-token");
            const data = await res.json();
            if (data.access_token) {
                console.log("🔁 Nouveau token Spotify récupéré");
                setAccessToken(data.access_token);
            }
        } catch (err) {
            console.error("❌ Erreur lors du refresh token:", err);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) return router.push("/login");
            setLoading(false);

            const docSnap = await getDoc(doc(db, "users", user.uid));
            if (docSnap.exists()) {
                const token = docSnap.data().spotifyAccessToken;
                setAccessToken(token);

                // Test rapide du token
                const testRes = await fetch("https://api.spotify.com/v1/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (testRes.status === 401) {
                    console.warn("🔁 Token expiré à la connexion, on le refresh");
                    await refreshAccessToken();
                }
            }

        });
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        if (!accessToken || player) return;

        const scriptId = "spotify-sdk";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            document.body.appendChild(script);
        } else if (window.Spotify) {
            // Si le SDK est déjà chargé
            window.onSpotifyWebPlaybackSDKReady();
        }

        window.onSpotifyWebPlaybackSDKReady = () => {
            const newPlayer = new window.Spotify.Player({
                name: "Sonarmo Player",
                getOAuthToken: cb => cb(accessToken),
                volume: 0.5,
            });

            newPlayer.addListener("ready", async ({ device_id }) => {
                console.log("✅ Player prêt :", device_id);
                setDeviceId(device_id);

                // 🔁 Transfert de la lecture vers le Web Playback SDK
                await fetch("https://api.spotify.com/v1/me/player", {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        device_ids: [device_id],
                        play: false // ne lance pas automatiquement
                    })
                });
            });


            newPlayer.addListener("initialization_error", ({ message }) => console.error("❌ Init error:", message));
            newPlayer.addListener("authentication_error", async ({ message }) => {
                console.error("❌ Auth error:", message);
                await refreshAccessToken();
            });
            newPlayer.addListener("account_error", ({ message }) => console.error("❌ Account error:", message));
            newPlayer.addListener("playback_error", ({ message }) => console.error("❌ Playback error:", message));

            newPlayer.connect();
            setPlayer(newPlayer);
        };
    }, [accessToken, player]);


    const fetchUserPlaylists = async () => {
        if (!accessToken) return;
        try {
            const res = await fetch("https://api.spotify.com/v1/me/playlists", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await res.json();
            setUserPlaylists(data.items || []);
        } catch (err) {
            console.error("❌ Erreur récupération des playlists utilisateur:", err);
        }
    };

    useEffect(() => {
        if (accessToken) {
            fetchUserPlaylists();
        }
    }, [accessToken]);

    const handlePlay = async () => {
        if (!deviceId || !accessToken) return;
        setIsPlaying(true);

        let uri = "";
        if (ambiance.startsWith("spotify:playlist:")) {
            uri = ambiance;
        } else {
            uri = playlistUrls[ambiance]
                .replace("https://open.spotify.com/playlist/", "spotify:playlist:")
                .replace("/embed", "");
        }

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

        setIsPlaying(false);

        if (res.status === 204) {
            console.log("▶️ Lecture lancée !");
        } else if (res.status === 401) {
            console.warn("🔐 Token expiré, tentative de refresh...");
            await refreshAccessToken();
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

            console.log("🔍 Résultat res.status :", res.status);

            // 💡 on essaye de lire le contenu brut (même s’il n’est pas JSON)
            const text = await res.text();
            console.log("🧾 Réponse brute Spotify :", text);

            // 🧪 on tente de parser en JSON seulement si possible
            try {
                const data = JSON.parse(text);
                console.log("✅ Réponse JSON :", data);
                if (data && data.item) {
                    setCurrentTrack({
                        name: data.item.name,
                        artist: data.item.artists.map(a => a.name).join(", "),
                        image: data.item.album.images[0]?.url,
                    });
                }
            } catch (err) {
                console.warn("⚠️ Réponse Spotify n’est pas du JSON :", err);
            }


            if (res.status === 204) {
                setCurrentTrack(null);
                return;
            }

            if (res.status === 401) {
                console.warn("🔐 Token expiré pendant fetchCurrentTrack, refresh...");
                await refreshAccessToken();
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
                                disabled={isPlaying}
                                className="bg-green-500 hover:bg-green-600 transition px-5 py-2 rounded-lg font-semibold text-white shadow"
                            >
                                {isPlaying ? "Chargement..." : `▶️ Lancer l'ambiance "${ambiance}"`}
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
        </div>
    );
}