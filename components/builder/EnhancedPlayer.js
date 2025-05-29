import { useEffect, useState, useRef } from "react";
import React from "react";
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
      body: JSON.stringify({ trackId, sessionId })
    })
      .then((res) => res.json())
      .then((data) => console.log("📊 Track analysé :", data))
      .catch((err) => console.error("❌ Erreur analyse auto :", err));
  }, [currentTrack?.id]);

  const formatTime = (ms) => {
    if (!ms) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="w-full bg-[#1c1c1c] px-4 py-2 shadow-lg text-white flex items-center justify-between gap-4 z-50">
      {currentTrack && (
        <>
          <div className="flex items-center gap-4 min-w-0">
            {currentTrack.image && (
              <Image
                src={currentTrack.image}
                alt="Pochette"
                width={48}
                height={48}
                className="rounded-md"
              />
            )}
            <div className="overflow-hidden">
              <h2 className="text-sm font-medium truncate">{currentTrack.name}</h2>
              <p className="text-xs text-gray-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => {
              console.log("▶️ Play/Pause button clicked");
              onToggleShuffle?.();
            }} title="Shuffle" className={`transition ${isShuffling ? 'text-[#FF0BED]' : 'text-white'}`}>
              <Shuffle size={20} />
            </button>
            <button onClick={() => {
              console.log("⏮️ Previous button clicked");
              onPrevious?.();
            }} className="hover:text-[#FF0BED]">
              <SkipBack size={22} />
            </button>
            <button onClick={() => {
              console.log("⏯️ Play/Pause clicked");
              onPlayPause?.();
            }} className="hover:text-[#FF0BED]">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button onClick={() => {
              console.log("⏭️ Next button clicked");
              onNext?.();
            }} className="hover:text-[#FF0BED]">
              <SkipForward size={22} />
            </button>
          </div>

          <div className="flex items-center gap-2 w-1/3">
            <span className="text-xs text-gray-400">{formatTime(progress)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={progress}
              onChange={(e) => {
                const value = Number(e.target.value);
                console.log("⏩ Seek to", value);
                onSeek?.(value);
                setProgress(value);
              }}
              className="flex-1 h-1 rounded-full appearance-none bg-[#333] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:bg-[#FF0BED] [&::-webkit-slider-thumb]:rounded-full"
            />
            <span className="text-xs text-gray-400">{formatTime(duration)}</span>
          </div>

          <div className="relative">
            <button onClick={() => {
              console.log("🔊 Volume toggle");
              setShowVolume(!showVolume);
            }} title="Volume">
              <Volume2 size={20} />
            </button>
            <AnimatePresence>
              {showVolume && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 bottom-8 bg-[#1c1c1c] p-2 rounded shadow"
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      console.log("🔈 Volume set to", val);
                      onVolumeChange?.(val);
                    }}
                    className="h-1 w-24 bg-[#333] rounded appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:bg-[#FF0BED] [&::-webkit-slider-thumb]:rounded-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}