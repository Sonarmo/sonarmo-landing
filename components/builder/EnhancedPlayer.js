import { useEffect, useState, useRef } from "react";
import React from "react";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";

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
  onToggleShuffle,
  onTrackChange
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

    onTrackChange?.(currentTrack);

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
    <div className="w-full bg-[#1c1c1c] px-2 py-3 shadow-lg text-white flex flex-col sm:flex-row items-center justify-between gap-4 z-50">
      {currentTrack && (
        <>
          <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
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
              <h2 className="text-sm font-medium truncate max-w-[160px]">{currentTrack.name}</h2>
              <p className="text-xs text-gray-400 truncate max-w-[160px]">{currentTrack.artist}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <button onClick={onToggleShuffle} title="Shuffle" className={`transition ${isShuffling ? 'text-[#FF0BED]' : 'text-white'}`}>
              <Shuffle size={20} />
            </button>
            <button onClick={onPrevious} className="hover:text-[#FF0BED]">
              <SkipBack size={22} />
            </button>
            <button onClick={onPlayPause} className="hover:text-[#FF0BED]">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button onClick={onNext} className="hover:text-[#FF0BED]">
              <SkipForward size={22} />
            </button>
          </div>

          <Box className="flex items-center gap-2 w-full sm:w-1/3 px-2">
            <span className="text-xs text-gray-400">{formatTime(progress)}</span>
            <Slider
              value={progress}
              max={duration}
              onChange={(_, val) => setProgress(val)}
              onChangeCommitted={(_, val) => onSeek(val)}
              sx={{
                color: "#F28500",
                height: 6,
                flex: 1,
                '& .MuiSlider-track': {
                  backgroundColor: '#F28500',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#444',
                  opacity: 1,
                },
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                  backgroundColor: '#fff',
                },
              }}
            />
            <span className="text-xs text-gray-400">{formatTime(duration)}</span>
          </Box>

          <div className="relative flex items-center justify-center">
            <button onClick={() => setShowVolume(!showVolume)} title="Volume">
              <Volume2 size={20} />
            </button>
            <AnimatePresence>
              {showVolume && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 bottom-10 bg-[#1c1c1c] p-2 rounded shadow"
                >
                  <Slider
                    value={volume}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(_, val) => onVolumeChange(val)}
                    sx={{
                      color: "#F28500",
                      height: 6,
                      width: 100,
                      '& .MuiSlider-track': {
                        backgroundColor: '#F28500',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: '#444',
                        opacity: 1,
                      },
                      '& .MuiSlider-thumb': {
                        width: 10,
                        height: 10,
                        backgroundColor: '#fff',
                      },
                    }}
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