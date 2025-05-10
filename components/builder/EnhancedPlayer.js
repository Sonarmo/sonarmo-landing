import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

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

    useEffect(() => {
        setProgress(position);
    }, [position]);

    const formatTime = (ms) => {
        if (!ms) return "0:00";
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-[#1c1c1c] rounded-2xl p-6 shadow-lg text-white flex flex-col items-center gap-6">
            {currentTrack && (
                <>
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-xl font-semibold text-white text-center">{currentTrack.name}</h2>
                        <p className="text-sm text-gray-400 text-center">{currentTrack.artist}</p>
                    </div>

                    {currentTrack.image && (
                        <div className="w-48 h-48 relative rounded-lg overflow-hidden">
                            <Image src={currentTrack.image} alt="Pochette" layout="fill" objectFit="cover" />
                        </div>
                    )}
                </>
            )}

            <div className="flex items-center justify-between w-full mt-4 gap-6">
                <button onClick={onPrevious} className="hover:scale-110 transition">
                    <SkipBack size={28} className="text-white hover:text-[#F28500]" />
                </button>

                <button onClick={onPlayPause} className="hover:scale-110 transition">
                    {player?._options?.getCurrentState?.().paused ? (
                        <Play size={32} className="text-white hover:text-[#F28500]" />
                    ) : (
                        <Pause size={32} className="text-white hover:text-[#F28500]" />
                    )}
                </button>

                <button onClick={onNext} className="hover:scale-110 transition">
                    <SkipForward size={28} className="text-white hover:text-[#F28500]" />
                </button>
            </div>

            <div className="w-full mt-4">
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={progress}
                    onChange={(e) => onSeek(Number(e.target.value))}
                    className="w-full accent-[#F28500] h-2 rounded-lg bg-[#333]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div className="w-full mt-4">
                <label htmlFor="volume" className="block text-sm mb-1 text-gray-400">Volume</label>
                <input
                    id="volume"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => onVolumeChange(Number(e.target.value))}
                    className="w-full accent-[#F28500] h-2 rounded-lg bg-[#333]"
                />
            </div>
        </div>
    );
}
