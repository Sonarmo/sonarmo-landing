import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Image from "next/image";
import { Play, Pause } from "lucide-react";

export default function SpotifyPlayer() {
    const router = useRouter();
    const [player, setPlayer] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) return router.push("/login");

            const docSnap = await getDoc(doc(db, "users", user.uid));
            if (docSnap.exists()) {
                const data = docSnap.data();
                setAccessToken(data.spotifyAccessToken || null);
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
                volume,
            });

            newPlayer.addListener("ready", ({ device_id }) => {
                console.log("✅ Player prêt avec ID :", device_id);
                setDeviceId(device_id);
            });

            newPlayer.addListener("player_state_changed", (state) => {
                if (!state) return;
                setIsPlaying(!state.paused);
                setPosition(state.position);
                setDuration(state.duration);
                if (state.track_window?.current_track) {
                    const track = state.track_window.current_track;
                    setCurrentTrack({
                        name: track.name,
                        artist: track.artists.map(a => a.name).join(", "),
                        image: track.album.images[0]?.url,
                    });
                }
            });

            newPlayer.connect();
            setPlayer(newPlayer);
        };
    }, [accessToken, player]);

    const handlePlayPause = async () => {
        if (!player) return;
        player.togglePlay();
    };

    const handleVolumeChange = (value) => {
        const v = parseFloat(value);
        setVolume(v);
        player?.setVolume(v);
    };

    const handleSeek = (value) => {
        const ms = Number(value);
        setPosition(ms);
        player?.seek(ms);
    };

    const formatTime = (ms) => {
        if (!ms) return "0:00";
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <main className="bg-[#121212] text-white font-[Poppins] min-h-screen p-10">
            <h1 className="text-3xl font-bold mb-6">🎛️ Lecteur Personnel Spotify</h1>

            {currentTrack && (
                <div className="bg-[#1c1c1c] rounded-2xl p-6 shadow-lg max-w-xl mx-auto flex flex-col items-center gap-6">
                    <div className="w-48 h-48 relative rounded-lg overflow-hidden">
                        <Image
                            src={currentTrack.image}
                            alt="Pochette"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">{currentTrack.name}</h2>
                        <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={handlePlayPause}
                            className="hover:scale-105 transition text-white"
                        >
                            {isPlaying ? <Pause size={36} /> : <Play size={36} />}
                        </button>
                    </div>

                    <div className="w-full">
                        <input
                            type="range"
                            min="0"
                            max={duration}
                            value={position}
                            onChange={(e) => handleSeek(e.target.value)}
                            className="w-full accent-[#F28500] h-2 rounded-lg bg-[#333]"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>{formatTime(position)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <label htmlFor="volume" className="block text-sm mb-1 text-gray-400">Volume</label>
                        <input
                            id="volume"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => handleVolumeChange(e.target.value)}
                            className="w-full accent-[#F28500] h-2 rounded-lg bg-[#333]"
                        />
                    </div>
                </div>
            )}

            {!currentTrack && (
                <p className="text-gray-400 text-center mt-10">Aucune lecture en cours</p>
            )}
        </main>
    );
}
