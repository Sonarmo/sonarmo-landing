import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

export default function EnhancedPlayer({
    player,
    currentTrack,
    onPlayPause,
    onNext,
    onPrevious,
    volume,
    onVolumeChange,
    position,
    duration,
    onSeek
}) {
    const [progress, setProgress] = useState(position);
    const [isPaused, setIsPaused] = useState(true);
    const [showVolume, setShowVolume] = useState(false);

    useEffect(() => {
        setProgress(position);
    }, [position]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused && duration > 0) {
                setProgress((prev) => Math.min(prev + 1000, duration));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isPaused, duration]);

    useEffect(() => {
        const updateState = async () => {
            if (player && player.getCurrentState) {
                const state = await player.getCurrentState();
                if (state) {
                    setIsPaused(state.paused);
                }
            }
        };
        updateState();
    }, [player, position]);

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

                    <div className="flex items-center justify-center gap-6 relative w-full">
                        <div className="absolute right-4">
                            <button onClick={() => setShowVolume(!showVolume)} className="hover:scale-110 transition">
                                <Volume2 size={24} className="text-white hover:text-[#FF0BED]" />
                            </button>
                            {showVolume && (
                                <div className="absolute bottom-12 right-0 bg-[#1c1c1c] p-2 rounded-lg shadow-md">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volume}
                                        onChange={(e) => onVolumeChange(Number(e.target.value))}
                                        className="h-32 w-2 appearance-none bg-gradient-to-t from-[#FF0BED] to-[#333] rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF0BED] [&::-moz-range-thumb]:bg-[#FF0BED]"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-6">
                            <button onClick={onPrevious} className="hover:scale-110 transition">
                                <SkipBack size={28} className="text-white hover:text-[#FF0BED]" />
                            </button>

                            <button onClick={onPlayPause} className="hover:scale-110 transition">
                                {isPaused ? (
                                    <Play size={32} className="text-white hover:text-[#FF0BED]" />
                                ) : (
                                    <Pause size={32} className="text-white hover:text-[#FF0BED]" />
                                )}
                            </button>

                            <button onClick={onNext} className="hover:scale-110 transition">
                                <SkipForward size={28} className="text-white hover:text-[#FF0BED]" />
                            </button>
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
