import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnhancedPlayer({
  player,
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  volume,
  onVolumeChange,
  position,
  duration,
  onSeek,
  isShuffling,
  onToggleShuffle
}) {
  const [progress, setProgress] = useState(position);
  const [showVolume, setShowVolume] = useState(false);
  const sessionIdRef = useRef(Date.now().toString());

  useEffect(() => {
    setProgress(position);
  }, [position]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && duration > 0) {
        setProgress((prev) => Math.min(prev + 1000, duration));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  useEffect(() => {
    if (!currentTrack?.id) return;
    const trackId = currentTrack.id;
    const sessionId = sessionIdRef.current;

    const alreadySent = window.sessionStorage.getItem(`analyzed-${trackId}`);
    if (alreadySent) return;

    window.sessionStorage.setItem(`analyzed-${trackId}`, "true");

    fetch("/api/analyse-track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId, sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📊 Track analysé :", data);
      })
      .catch((err) => {
        console.error("❌ Erreur analyse auto :", err);
      });
  }, [currentTrack?.id]);

  const formatTime = (ms) => {
    if (!ms) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#1c1c1c] border-t border-gray-700 px-4 py-2 flex items-center justify-between z-50">
      <div className="flex items-center gap-4">
        {currentTrack.image && (
          <div className="w-12 h-12 relative rounded overflow-hidden">
            <Image src={currentTrack.image} alt="Pochette" layout="fill" objectFit="cover" />
          </div>
        )}
        <div className="text-sm">
          <p className="font-semibold text-white truncate max-w-[150px]">{currentTrack.name}</p>
          <p className="text-gray-400 text-xs truncate max-w-[150px]">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={onToggleShuffle}
          className={`hover:scale-110 transition ${isShuffling ? 'text-[#FF0BED]' : 'text-white'}`}
        >
          <Shuffle size={18} />
        </button>

        <button onClick={onPrevious}>
          <SkipBack size={20} className="text-white hover:text-[#FF0BED]" />
        </button>

        <button onClick={onPlayPause} className="p-2 bg-white rounded-full">
          {isPlaying ? (
            <Pause size={20} className="text-black" />
          ) : (
            <Play size={20} className="text-black" />
          )}
        </button>

        <button onClick={onNext}>
          <SkipForward size={20} className="text-white hover:text-[#FF0BED]" />
        </button>
      </div>

      <div className="relative flex items-center gap-2">
        <Volume2 size={20} className="text-white" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => {
            const newVolume = parseFloat(e.target.value);
            if (!isNaN(newVolume)) {
              onVolumeChange(newVolume);
            }
          }}
          className="w-24 h-1 appearance-none rounded-full bg-gradient-to-r from-[#FF0BED] to-[#333] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF0BED]"
        />
      </div>
    </div>
  );
}
