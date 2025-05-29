// dashboard.js – version corrigée et propre avec EnhancedPlayer

import EnhancedPlayer from "@/components/builder/EnhancedPlayer";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import TrackPreviewPanel from "@/components/builder/TrackPreviewPanel";
import { getIdToken } from "firebase/auth";

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
const extractPlaylistId = (uri) => {
  if (!uri) return null;
  return uri.startsWith("spotify:playlist:")
    ? uri.replace("spotify:playlist:", "")
    : uri;
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
    const [isShuffling, setIsShuffling] = useState(false);
    const justRefreshed = useRef(false);
    const hasPlayedOnce = useRef(false);
    const [playlistAnalysis, setPlaylistAnalysis] = useState(null);

    // 🔶 Démo données énergie (graph temporaire)
    const [energy, setEnergy] = useState(0.65);
    const fakeEnergyData = Array.from({ length: 15 }, (_, i) => ({ name: `T${i + 1}`, energy: Math.random() * 0.5 + 0.4 }));
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

    // 👉 Ici : fonction pour activer ou désactiver le mode shuffle
    const onToggleShuffle = async () => {
        const newShuffle = !isShuffling;
        try {
            await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${newShuffle}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setIsShuffling(newShuffle);
        } catch (err) {
            console.error("Erreur toggle shuffle:", err);
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
            if (data.access_token) {
                console.log("✅ Nouveau access_token reçu :", data.access_token);
                setAccessToken(data.access_token);

                // ✅ Ajoute cette ligne juste ici :
                justRefreshed.current = true;
            } else {
                console.warn("⚠️ Aucun token reçu lors du refresh");
            }
        } catch (err) {
            console.error("❌ Erreur lors du refresh token:", err);
        }
    };



  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (!user) return router.push("/login");

    setLoading(false);

    try {
      // ✅ Rafraîchir le token Firebase et le mettre dans un cookie
      const freshToken = await getIdToken(user, true);
      document.cookie = `token=${freshToken}; path=/`;

      const docSnap = await getDoc(doc(db, "users", user.uid));

      if (!docSnap.exists()) {
        console.warn("📭 Aucun document Firestore trouvé pour cet utilisateur.");
        return;
      }

      const data = docSnap.data();
      const token = data.spotifyAccessToken;

      setAccessToken(token);

      if (data.selectedPlaylistUri) {
        setAmbianceUri(data.selectedPlaylistUri);
        console.log("🎯 Playlist personnalisée :", data.selectedPlaylistUri);
      }

      if (data.ambianceLabel) {
        setAmbiance(data.ambianceLabel);
        console.log("🎵 Label d'ambiance :", data.ambianceLabel);
      }

      if (token && typeof token === "string") {
        console.log("🔐 Vérification du token Spotify :", token.slice(0, 10) + "...");

        const testRes = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await testRes.json();
        console.log("📥 Réponse Spotify /v1/me :", json);

        if (testRes.status === 401 || testRes.status === 403) {
          console.warn("⛔️ Token expiré ou invalide. Rafraîchissement...");
          await refreshAccessToken();
        }
      } else {
        console.warn("⚠️ Aucun token Spotify valide trouvé dans Firestore.");
      }
    } catch (err) {
      console.error("❌ Erreur Firestore ou API Spotify :", err);
    }
  });

  return () => unsubscribe();
}, [router]);

    // 👉 Met à jour l'URI sélectionnée si elle est passée dans l'URL
useEffect(() => {
    if (router.query.uri) {
        const uri = convertToSpotifyUri(router.query.uri);
        setAmbianceUri(uri);
        updateDoc(doc(db, "users", auth.currentUser.uid), {
            selectedPlaylistUri: uri,
        }).catch(console.error);
    }
}, [router.query.uri]);

// 👉 Analyse automatique de la playlist dès que l’URI et le token sont prêts
useEffect(() => {
    if (!ambianceUri || !accessToken) return;

    const extractPlaylistId = (uri) => {
        const match = uri.match(/spotify:playlist:(.+)/);
        return match ? match[1] : null;
    };

    const fetchAnalysis = async () => {
        const playlistId = extractPlaylistId(ambianceUri);

        if (!playlistId) {
            console.warn("⚠️ Aucun playlistId trouvé à analyser.");
            return;
        }

        try {
            const res = await fetch("/api/analyse-playlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ playlistId }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Erreur inconnue");

            console.log("🧠 Résultats de l'analyse :", data);
            setPlaylistAnalysis(data);
        } catch (err) {
            console.error("❌ Erreur analyse playlist :", err.message);
        }
    };

    fetchAnalysis();
}, [ambianceUri, accessToken]);

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
                    const track = state.track_window.current_track;
                    setCurrentTrack({
                        id: track.id,
                        name: track.name,
                        artist: track.artists.map(a => a.name).join(", "),
                        image: track.album.images[0]?.url,
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
    // À placer dans Dashboard() — après avoir déclaré : const hasPlayedOnce = useRef(false);

    useEffect(() => {
        if (accessToken && deviceId && player && !hasPlayedOnce.current) {
            const play = async () => {
                const uri = ambianceUri || convertToSpotifyUri(playlistUrls[ambiance]);

                try {
                    const user = auth.currentUser;
                    if (user) {
                        await updateDoc(doc(db, "users", user.uid), {
                            selectedPlaylistUri: uri,
                        });
                    }

                    await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${isShuffling}`, {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

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
                    } else {
                        hasPlayedOnce.current = true; // ✅ Ne joue qu’une seule fois
                    }

                } catch (err) {
                    console.error("Erreur lors de l'appel /play Spotify:", err);
                }
            };

            play();
        }
    }, [accessToken, deviceId, player]); // ✅ ambiance retiré ici pour éviter les relances


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

    useEffect(() => {
        if (!currentTrack?.id || !accessToken) return;

        // ⚠️ Si on vient de faire un refresh, on ignore ce tour
        if (justRefreshed.current) {
            console.log("⏸️ On saute ce fetch juste après un refresh.");
            justRefreshed.current = false; // réinitialise
            return;
        }

        const fetchAudioFeatures = async () => {
            console.log("🌟 [DEBUG] currentTrack:", currentTrack);
            console.log("🔑 [DEBUG] accessToken:", accessToken);

            try {
                const res = await fetch(`https://api.spotify.com/v1/audio-features/${currentTrack.id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (res.status === 401 || res.status === 403) {
                    console.warn("⛔️ Token refusé. Rafraîchissement nécessaire.");
                    await refreshAccessToken(); // va déclencher le prochain tour
                    return;
                }

                const data = await res.json();

                if (data && data.energy !== undefined) {
                    console.log("🎧 Audio features for", currentTrack.name);
                    console.log("➡️ Energy:", data.energy);
                    console.log("➡️ Tempo:", data.tempo);
                    console.log("➡️ Valence:", data.valence);
                } else {
                    console.warn("❓ Aucun audio feature trouvé pour ce morceau.");
                }
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des audio features:", error);
            }
        };

        fetchAudioFeatures();
    }, [currentTrack?.id, accessToken]);

{playlistAnalysis && (
  <div className="bg-[#1c1c1c] text-white p-4 rounded-xl mb-8">
    <h3 className="text-xl font-semibold mb-2">Analyse Playlist</h3>
    <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
      <li><strong>Énergie moyenne :</strong> 
        {playlistAnalysis.average_energy !== undefined
          ? `${(playlistAnalysis.average_energy * 100).toFixed(1)}%`
          : "Données non disponibles"}
      </li>
      <li><strong>Tempo moyen :</strong> 
        {playlistAnalysis.average_tempo !== undefined
          ? `${playlistAnalysis.average_tempo.toFixed(0)} BPM`
          : "Données non disponibles"}
      </li>
      <li><strong>Valence moyenne :</strong> 
        {playlistAnalysis.average_valence !== undefined
          ? `${(playlistAnalysis.average_valence * 100).toFixed(1)}%`
          : "Données non disponibles"}
      </li>
      <li><strong>Nombre de morceaux :</strong> 
        {playlistAnalysis.total_tracks || 0}
      </li>
    </ul>
  </div>
)}



    return (
        <div className="min-h-screen bg-black flex flex-col md:flex-row">
            

            {/* Main content */}
            <main className="flex-1 p-6 md:p-10 text-white">
                <h1 className="text-3xl font-semibold mb-6">Bienvenue sur ton Dashboard</h1>

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
                    <div className="grid md:grid-cols-2 gap-6 items-start">
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
                            isShuffling={isShuffling}
                            onToggleShuffle={onToggleShuffle}
                        />
                        <TrackPreviewPanel accessToken={accessToken} />

                        <div className="bg-[#1c1c1c] p-4 rounded-2xl shadow-lg">
                            <h3 className="text-lg font-semibold mb-2">Énergie musicale</h3>
                            <ResponsiveContainer width="100%" height={150}>
                                <LineChart data={fakeEnergyData}>
                                    <XAxis dataKey="name" stroke="#888" />
                                    <YAxis domain={[0, 1]} stroke="#888" />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="energy" stroke="#F28500" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                            <Box mt={4}>
                                <Slider
                                    value={energy}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    onChange={(e, val) => setEnergy(val)}
                                    sx={{
                                        color: "#F28500",
                                    }}
                                />
                                <p className="text-sm text-center mt-2 text-gray-400">Énergie cible : {(energy * 100).toFixed(0)}%</p>
                            </Box>
                        </div>
                    </div>
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
