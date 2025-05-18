import EnhancedPlayer from "@/components/builder/EnhancedPlayer";
import MiniPlayer from "@/components/builder/MiniPlayer";
import useSpotifyPlayer from "@/hooks/useSpotifyPlayer";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";

export default function MusicPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [accessToken, setAccessToken] = useState(null);
    const [uid, setUid] = useState(null);
    const [promptText, setPromptText] = useState("");
    const [playlistUrl, setPlaylistUrl] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const promptRef = useRef();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                router.push("/login");
            } else {
                setUid(user.uid);
                const docSnap = await getDoc(doc(db, "users", user.uid));
                if (docSnap.exists()) {
                    const token = docSnap.data().spotifyAccessToken;
                    setAccessToken(token);
                }
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
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
                console.error("❌ Erreur récupération playlists Spotify:", err);
            }
        };
        fetchUserPlaylists();
    }, [accessToken]);

    const {
        currentTrack,
        isPlaying,
        playPause,
        nextTrack,
        previousTrack,
        seek,
        changeVolume,
        volume,
        position,
        duration,
        isShuffling,
        toggleShuffle,
        playPlaylist
    } = useSpotifyPlayer(accessToken);

    const generatePlaylistFromPrompt = async () => {
        if (!promptText || promptText.length < 10) return;
        setIsGenerating(true);
        setPlaylistUrl(null);

        try {
            const res = await fetch("/api/generate-playlist-prompt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: promptText }),
            });

            const data = await res.json();
            if (res.ok) {
                setPlaylistUrl(data.url);
            } else {
                console.error("Erreur génération:", data.error);
                alert("Erreur: " + data.error);
            }
        } catch (err) {
            console.error("Erreur fetch:", err);
        }

        setIsGenerating(false);
    };

    if (loading) {
        return <div className="text-white min-h-screen flex items-center justify-center font-poppins">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-[#121212] flex flex-col md:flex-row font-poppins pb-24">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#1c1c1c] text-gray-300 p-6 flex flex-col gap-8 font-poppins">
                <Link href="/dashboard" className="flex items-center gap-3 mb-8">
                    <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={140} height={40} />
                </Link>

                <nav className="flex flex-col gap-6 text-sm font-poppins">
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

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 text-white font-poppins">
                <h1 className="text-3xl font-bold mb-8">Vos Playlists</h1>

                {/* Prompt Input Section */}
                <section className="bg-[#1c1c1c] p-6 rounded-xl shadow-lg mb-10">
                    <h2 className="text-2xl font-semibold mb-4">Intelligence Atmospherique</h2>
                    <textarea
                        ref={promptRef}
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                        rows={4}
                        placeholder="Ex: Ce soir c'est football, met moi une ambiance de stade"
                        className="w-full bg-[#121212] border border-gray-600 text-white p-4 rounded-lg mb-4"
                    />
                    <button
                        onClick={generatePlaylistFromPrompt}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90"
                    >
                        {isGenerating ? "Génération en cours..." : "Générer la playlist"}
                    </button>

                    {playlistUrl && (
                        <div className="mt-6">
                            <p className="text-green-400 mb-2">✅ Playlist générée avec succès !</p>
                            <a
                                href={playlistUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-[#1DB954]"
                            >
                                Lancer la playlist
                            </a>
                        </div>
                    )}
                </section>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {userPlaylists.map((playlist) => (
                        <motion.div
                            key={playlist.id}
                            whileHover={{ scale: 1.05 }}
                            className="bg-[#1c1c1c] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer"
                            onClick={() => playPlaylist(playlist.uri)}
                        >
                            <Image
                                src={playlist.images[0]?.url || "/images/default.jpg"}
                                alt={playlist.name}
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-1">{playlist.name}</h2>
                                <p className="text-gray-400 text-sm truncate">{playlist.description || ""}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* MiniPlayer */}
            <MiniPlayer
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayPause={playPause}
                onNext={nextTrack}
                onPrevious={previousTrack}
                volume={volume}
                onVolumeChange={changeVolume}
                position={position}
                duration={duration}
                onSeek={seek}
                isShuffling={isShuffling}
                onToggleShuffle={toggleShuffle}
            />
        </div>
    );
}
