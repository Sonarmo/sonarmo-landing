import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import EnhancedPlayer from "/components/builder/EnhancedPlayer";
import { usePlayer } from "../lib/contexts/PlayerContext";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentTracks, setRecentTracks] = useState([]);

  const {
    player,
    deviceId,
    currentTrack,
    isPlaying,
    volume,
    duration,
    position,
    isShuffling,
    setVolume,
  } = usePlayer();

  const handlePlayPause = async () => {
    if (!player) return;
    const state = await player.getCurrentState();
    if (!state) return;
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
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_SPOTIFY_ACCESS_TOKEN}` },
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
