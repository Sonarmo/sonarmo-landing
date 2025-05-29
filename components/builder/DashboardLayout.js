// components/builder/DashboardLayout.js
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import EnhancedPlayer from "/components/builder/EnhancedPlayer";
import { auth, db } from "/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [player, setPlayer] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);

  // Auth + récupération token
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (!docSnap.exists()) return;

      const data = docSnap.data();
      if (data.spotifyAccessToken) setAccessToken(data.spotifyAccessToken);
    });

    return () => unsubscribe();
  }, []);

  // Chargement SDK + initialisation du lecteur
  useEffect(() => {
    if (!accessToken || player) return;

    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new window.Spotify.Player({
        name: "Sonarmo Player",
        getOAuthToken: (cb) => cb(accessToken),
        volume: volume,
      });

      newPlayer.addListener("ready", ({ device_id }) => {
        console.log("✅ Lecteur prêt avec device_id :", device_id);
        setPlayer(newPlayer);
      });

      newPlayer.addListener("player_state_changed", (state) => {
        if (!state) return;

        const track = state.track_window.current_track;
        setCurrentTrack({
          id: track.id,
          name: track.name,
          artist: track.artists.map((a) => a.name).join(", "),
          image: track.album.images[0]?.url || null,
        });

        setIsPlaying(!state.paused);
        setDuration(state.duration);
        setPosition(state.position);
      });

      newPlayer.connect();
    };

    // Charger le SDK si pas déjà chargé
    const scriptTag = document.getElementById("spotify-sdk");
    if (!scriptTag) {
      const script = document.createElement("script");
      script.id = "spotify-sdk";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [accessToken, player]);

  // Fonctions de contrôle
  const onPlayPause = () => player?.togglePlay();
  const onNext = () => player?.nextTrack();
  const onPrevious = () => player?.previousTrack();
  const onVolumeChange = (v) => {
    setVolume(v);
    player?.setVolume(v);
  };
  const onSeek = (pos) => {
    setPosition(pos);
    player?.seek(pos);
  };
  const onToggleShuffle = () => setIsShuffling((prev) => !prev); // Optionnel selon API Spotify

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Bouton menu mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-50 md:hidden text-white"
      >
        <Menu size={28} />
      </button>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static z-40 w-64 bg-black text-gray-300 p-6 flex flex-col gap-8 transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Link href="/dashboard" className="flex items-center gap-3 mb-8">
          <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={140} height={40} />
        </Link>

        <nav className="flex flex-col gap-6 text-sm">
          <SidebarLink href="/dashboard" icon="/icons/home.png" label="Dashboard" pathname={pathname} />
          <SidebarLink href="/dashboard/music" icon="/icons/music.png" label="Musique" pathname={pathname} />
          <SidebarLink href="/dashboard/analytics" icon="/icons/analytics.png" label="Analyses" pathname={pathname} />
          <SidebarLink href="/dashboard/settings" icon="/icons/settings.png" label="Réglages" pathname={pathname} />
          <SidebarLink href="/dashboard/profile" icon="/icons/profile.png" label="Profil" pathname={pathname} />
          <Link href="/logout" className="flex items-center gap-4 hover:text-white mt-8">
            <Image src="/icons/logout.png" alt="Logout" width={24} height={24} />
            Déconnexion
          </Link>
        </nav>
      </aside>

      {/* CONTENU */}
      <main className="flex-1 p-6 pb-40">
        {children}
      </main>

      {/* PLAYER GLOBAL */}
      <div className="fixed bottom-0 left-0 w-full z-30 bg-black border-t border-gray-800">
        <EnhancedPlayer
          player={player}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
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
      </div>
    </div>
  );
}

function SidebarLink({ href, icon, label, pathname }) {
  const active = pathname === href;
  return (
    <Link href={href} className={`flex items-center gap-4 hover:text-white ${active ? "text-white" : ""}`}>
      <Image src={icon} alt={label} width={24} height={24} />
      {label}
    </Link>
  );
}