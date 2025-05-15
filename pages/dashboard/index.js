// dashboard.js – version corrigée et propre avec EnhancedPlayer

import EnhancedPlayer from "@/components/builder/EnhancedPlayer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const playlistUrls = {
    "Lounge Chill 🌙": "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6",
    "Apéro Festif 🍹": "https://open.spotify.com/playlist/37i9dQZF1DWZwtERXCS82H",
    "Night Club 🔥": "https://open.spotify.com/playlist/37i9dQZF1DX4dyzvuaRJ0n",
    "Café Cosy ☕": "https://open.spotify.com/playlist/37i9dQZF1DX6VdMW310YC7"
};

const convertToSpotifyUri = (url) => {
    if (!url.includes("spotify.com/playlist/")) return url;
    const id = url.split("/playlist/")[1].split("?")[0];
    return `spotify:playlist:${id}`;
};

export default function Dashboard() {
    const router = useRouter();
    const pathname = usePathname();

    const [loading, setLoading] = useState(true);
    const [ambiance, setAmbiance] = useState("Lounge Chill 🌙");
    const [ambianceUri, setAmbianceUri] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [player, setPlayer] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [volume, setVolume] = useState(0.5);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showAmbiance, setShowAmbiance] = useState(true);

    const onPlayPause = () => player?.togglePlay();
    const onNext = () => player?.nextTrack();
    const onPrevious = () => player?.previousTrack();
    const onVolumeChange = (v) => {
        const parsed = Math.min(1, Math.max(0, parseFloat(v)));
        setVolume(parsed);
        if (player && !isNaN(parsed)) {
            player.setVolume(parsed).catch((err) =>
                console.error("Erreur setVolume:", err)
            );
        }
    };

    const onSeek = (value) => {
        if (player) {
            player.seek(value).catch(console.error);
            setPosition(value);
        }
    };

    const handleAmbianceChange = (e) => {
        setShowAmbiance(false);
        setTimeout(() => {
            setAmbiance(e.target.value);
            setAmbianceUri(null);
            setShowAmbiance(true);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }, 300);
    };

    const refreshAccessToken = async () => {
        try {
            const res = await fetch("/api/refresh-spotify-token");
            const data = await res.json();
            if (data.access_token) setAccessToken(data.access_token);
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
                const data = docSnap.data();
                setAccessToken(data.spotifyAccessToken);
                if (data.selectedPlaylistUri) setAmbianceUri(data.selectedPlaylistUri);
                const testRes = await fetch("https://api.spotify.com/v1/me", {
                    headers: { Authorization: `Bearer ${data.spotifyAccessToken}` },
                });
                if (testRes.status === 401) await refreshAccessToken();
            }
        });
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        if (router.query.uri) {
            const uri = convertToSpotifyUri(router.query.uri);
            setAmbianceUri(uri);
            updateDoc(doc(db, "users", auth.currentUser.uid), {
                selectedPlaylistUri: uri,
            }).catch(console.error);
        }
    }, [router.query.uri]);

    // dashboard.js – version corrigée avec SDK chargé de façon fiable et gestion d'erreur renforcée

    useEffect(() => {
        if (!accessToken || player) return;
        const scriptId = "spotify-sdk";
        const existingScript = document.getElementById(scriptId);

        // On définit le handler global AVANT de charger le SDK
        window.onSpotifyWebPlaybackSDKReady = () => {
            const newPlayer = new window.Spotify.Player({
                name: "Sonarmo Player",
                getOAuthToken: cb => cb(accessToken),
                volume: 0.5,
            });

            document.body.addEventListener("click", () => {
                newPlayer.activateElement().catch(console.error);
            }, { once: true });

            newPlayer.addListener("ready", ({ device_id }) => {
                console.log("✅ Player prêt avec ID :", device_id);
                setDeviceId(device_id);
                setPlayer(newPlayer);
            });

            newPlayer.addListener("player_state_changed", (state) => {
                if (!state) return;
                setIsPlaying(!state.paused);
                setPosition(state.position);
                setDuration(state.duration);
                if (state.track_window?.current_track) {
                    setCurrentTrack({
                        name: state.track_window.current_track.name,
                        artist: state.track_window.current_track.artists.map(a => a.name).join(", "),
                        image: state.track_window.current_track.album.images[0]?.url,
                    });
                }
            });

            newPlayer.addListener("initialization_error", ({ message }) => console.error(message));
            newPlayer.addListener("authentication_error", async ({ message }) => {
                console.error(message);
                await refreshAccessToken();
            });
            newPlayer.addListener("account_error", ({ message }) => console.error(message));
            newPlayer.addListener("playback_error", ({ message }) => console.error(message));

            newPlayer.connect();
        };

        if (!existingScript) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            document.body.appendChild(script);
        } else if (window.Spotify) {
            window.onSpotifyWebPlaybackSDKReady();
        }
    }, [accessToken, player]);

    // ⏯ Relancer automatiquement si ambiance change (ou selectedPlaylistUri mis à jour)
    useEffect(() => {
        if (accessToken && deviceId && player) {
            const play = async () => {
                const uri = ambianceUri || convertToSpotifyUri(playlistUrls[ambiance]);

                // 🔄 Mettre à jour Firestore avec la nouvelle ambiance sélectionnée
                try {
                    const user = auth.currentUser;
                    if (user) {
                        await updateDoc(doc(db, "users", user.uid), {
                            selectedPlaylistUri: uri,
                        });
                    }
                } catch (error) {
                    console.error("❌ Erreur mise à jour Firestore ambiance:", error);
                }

                try {
                    const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ context_uri: uri, offset: { position: 0 }, position_ms: 0 }),
                    });

                    if (!res.ok) {
                        const err = await res.json();
                        console.error("Erreur lecture Spotify:", err);
                    }
                } catch (err) {
                    console.error("Erreur lors de l'appel /play Spotify:", err);
                }
            };
            play();
        }
    }, [accessToken, deviceId, ambiance, player]);

    // 🔊 Appliquer le volume dès qu'il change
    useEffect(() => {
        if (player && typeof volume === "number" && volume >= 0 && volume <= 1) {
            player.setVolume(volume).catch((err) =>
                console.error("Erreur lors du réglage du volume :", err)
            );
        }
    }, [volume, player]);

    // ⏱️ Mise à jour position/track régulière
    useEffect(() => {
        const interval = setInterval(() => {
            if (player) {
                player.getCurrentState().then((state) => {
                    if (state) {
                        setPosition(state.position);
                        setDuration(state.duration);
                    }
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [player]);

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
                            {Object.keys(playlistUrls).map((key) => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                    </div>
                </section>

                {player && (
                    <EnhancedPlayer
                        player={player}
                        currentTrack={currentTrack}
                        onPlayPause={onPlayPause}
                        onNext={onNext}
                        onPrevious={onPrevious}
                        volume={volume}
                        onVolumeChange={onVolumeChange}
                        position={position}
                        duration={duration}
                        onSeek={onSeek}
                    />
                )}
            </main>

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
