import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import EnhancedPlayer from "/components/builder/EnhancedPlayer";
import { auth, db } from "/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const playlistUri = "spotify:playlist:37i9dQZF1DX4WYpdgoIcn6"; // Playlist par défaut

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [player, setPlayer] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const hasPlayedOnce = useRef(false);
  const [recentTracks, setRecentTracks] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAccessToken(data.spotifyAccessToken);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!accessToken || player) return;

    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new window.Spotify.Player({
        name: "Sonarmo Player",
        getOAuthToken: cb => cb(accessToken),
        volume: 0.5,
      });

      newPlayer.addListener("ready", async ({ device_id }) => {
        console.log("\u2705 Spotify Player prêt avec device ID :", device_id);
        setDeviceId(device_id);
        setPlayer(newPlayer);

        try {
          await fetch("https://api.spotify.com/v1/me/player", {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ device_ids: [device_id], play: false }),
          });

          // Lecture automatique de la playlist
          if (!hasPlayedOnce.current) {
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                context_uri: playlistUri,
                offset: { position: 0 },
                position_ms: 0
              }),
            });
            hasPlayedOnce.current = true;
          }
        } catch (error) {
          console.error("\u274c Erreur lors de la lecture initiale :", error);
        }
      });

      newPlayer.addListener("player_state_changed", (state) => {
        if (!state) return;
        const track = state.track_window.current_track;
        setCurrentTrack({
          id: track.id,
          name: track.name,
          artist: track.artists.map((a) => a.name).join(", "),
          image: track.album.images[0]?.url,
        });
        setIsPlaying(!state.paused);
        setDuration(state.duration);
        setPosition(state.position);
      });

      newPlayer.connect();
    };

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
  }, [accessToken, player]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!player) return;
      const state = await player.getCurrentState();
      if (state) {
        setPosition(state.position);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [player]);

  const handlePlayPause = async () => {
    if (!player) return;
    const state = await player.getCurrentState();
    if (!state) {
      console.warn("\u26d4 Aucun état de lecture Spotify");
      return;
    }
    state.paused ? await player.resume() : await player.pause();
  };

  const handleNext = () => player?.nextTrack();
  const handlePrevious = () => player?.previousTrack();
  const handleVolumeChange = (val) => {
    setVolume(val);
    player?.setVolume(val);
  };
  const handleSeek = (val) => player?.seek(val);
  const handleShuffle = () => {
    fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${!isShuffling}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then(() => setIsShuffling(!isShuffling));
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-50 md:hidden text-white"
      >
        <Menu size={28} />
      </button>

      <aside
        className={`fixed md:static z-40 w-64 max-w-[16rem] h-full bg-black text-gray-300 p-6 flex flex-col gap-8 transition-transform duration-300 transform ${
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

      <main className="flex-1 p-6 pb-32">
        {React.cloneElement(children, { currentTrack, recentTracks })}
      </main>

      <div className="fixed bottom-0 left-0 w-full z-50 bg-black border-t border-gray-700">
        <EnhancedPlayer
          player={player}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          duration={duration}
          position={position}
          onSeek={handleSeek}
          isShuffling={isShuffling}
          onToggleShuffle={handleShuffle}
          onTrackChange={(track) => {
          setCurrentTrack(track);
          setRecentTracks((prev) => {
            if (!track || prev.some((t) => t.id === track.id)) return prev;
            return [track, ...prev.slice(0, 9)];
    });
  }}
        />
      </div>
    </div>
  );
}

function SidebarLink({ href, icon, label, pathname }) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 hover:text-white ${active ? "text-white" : ""}`}
    >
      <Image src={icon} alt={label} width={24} height={24} /> {label}
    </Link>
  );
}