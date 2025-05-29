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

    return (
        <div className="w-full max-w-xl mx-auto bg-[#1c1c1c] rounded-2xl p-6 shadow-lg text-white flex flex-col items-center gap-6">
            {currentTrack && (
                <>
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-xl font-semibold text-white text-center">{currentTrack.name}</h2>
                        <p className="text-sm text-gray-400 text-center">{currentTrack.artist}</p>
                    </div>

                    {currentTrack.image && (
                        <div className="w-48 h-48 relative rounded-lg overflow-hidden mb-4">
                            <Image src={currentTrack.image} alt="Pochette" layout="fill" objectFit="cover" />
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-8 relative w-full">
                        <div className="flex items-center justify-center gap-9">
                            <button
                                onClick={onToggleShuffle}
                                className={`hover:scale-110 transition ${isShuffling ? 'text-[#FF0BED]' : 'text-white'}`}
                                title="Shuffle"
                            >
                                <Shuffle size={24} />
                            </button>

                            <button onClick={onPrevious} className="hover:scale-110 transition">
                                <SkipBack size={28} className="text-white hover:text-[#FF0BED]" />
                            </button>

                            <button onClick={onPlayPause} className="hover:scale-110 transition">
                                {isPlaying ? (
                                    <Pause size={32} className="text-white hover:text-[#FF0BED]" />
                                ) : (
                                    <Play size={32} className="text-white hover:text-[#FF0BED]" />
                                )}
                            </button>

                            <button onClick={onNext} className="hover:scale-110 transition">
                                <SkipForward size={28} className="text-white hover:text-[#FF0BED]" />
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowVolume(!showVolume)}
                                    className="hover:scale-110 transition"
                                    title="Volume"
                                >
                                    <Volume2 size={24} className="text-white hover:text-[#FF0BED]" />
                                </button>

                                <AnimatePresence>
                                    {showVolume && (
                                        <motion.div
                                            initial={{ opacity: 0, scaleY: 0, transformOrigin: "bottom" }}
                                            animate={{ opacity: 1, scaleY: 1 }}
                                            exit={{ opacity: 0, scaleY: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute bottom-full right-0 mb-2 bg-[#1c1c1c] p-3 rounded-xl shadow-lg origin-bottom"
                                        >
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
                                                className="h-24 w-2 appearance-none rounded-lg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF0BED]"
                                                style={{
                                                    writingMode: "vertical-lr",
                                                    transform: "rotate(180deg)",
                                                    background: `linear-gradient(to bottom, #FF0BED ${volume * 100}%, #333 ${volume * 100}%)`
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-[80%] mt-4">
                        <input
                            type="range"
                            min="0"
                            max={duration}
                            value={progress}
                            onChange={(e) => onSeek(Number(e.target.value))}
                            className="w-full h-2 appearance-none rounded-full bg-gradient-to-r from-[#FF0BED] to-[#333] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF0BED] [&::-moz-range-thumb]:bg-[#FF0BED]"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>{formatTime(progress)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}