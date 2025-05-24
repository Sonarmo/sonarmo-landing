import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function MiniPlayer({
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
}) {
    const pathname = usePathname();
    const [progress, setProgress] = useState(position || 0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isPlaying && duration) {
                setProgress((prev) => (prev + 1 > duration ? duration : prev + 1));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isPlaying, duration]);

    useEffect(() => {
        setProgress(position);
    }, [position]);

    if (pathname === "/dashboard") return null;

    const formatTime = (sec) => {
        const min = Math.floor(sec / 60);
        const seconds = Math.floor(sec % 60);
        return `${min}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <div className="fixed bottom-0 w-full bg-[#121212] text-white border-t border-[#2a2a2a] z-50 px-4 py-2 flex items-center justify-between">
            {/* Left: Track Info */}
            <div className="flex items-center gap-4 w-1/3 min-w-[200px]">
                {currentTrack?.album?.images?.[0]?.url && (
                    <Image
                        src={currentTrack.album.images[0].url}
                        alt={currentTrack.name}
                        width={48}
                        height={48}
                        className="rounded-sm"
                    />
                )}
                <div className="truncate">
                    <p className="text-sm font-medium truncate">{currentTrack?.name || "Aucune piste"}</p>
                    <p className="text-xs text-gray-400 truncate">{currentTrack?.artists?.map((a) => a.name).join(", ")}</p>
                </div>
            </div>

            {/* Center: Controls */}
            <div className="flex flex-col items-center justify-center w-1/3">
                <div className="flex items-center gap-4">
                    <button onClick={onToggleShuffle}>
                        <Shuffle className={`w-5 h-5 ${isShuffling ? "text-[#FF00FF]" : "text-gray-400"}`} />
                    </button>
                    <button onClick={onPrevious}>
                        <SkipBack className="w-5 h-5 text-white" />
                    </button>
                    <button
                        onClick={onPlayPause}
                        className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center"
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button onClick={onNext}>
                        <SkipForward className="w-5 h-5 text-white" />
                    </button>
                </div>
                {/* Progress Bar */}
                <div className="flex items-center gap-2 mt-1 text-xs w-full max-w-sm">
                    <span>{formatTime(progress)}</span>
                    <input
                        type="range"
                        value={progress}
                        min={0}
                        max={duration || 100}
                        onChange={(e) => onSeek && onSeek(Number(e.target.value))}
                        className="w-full accent-[#FF00FF]"
                    />
                    <span>{formatTime(duration || 0)}</span>
                </div>
            </div>

            {/* Right: Volume */}
            <div className="flex items-center gap-2 w-1/3 justify-end">
                <Volume2 className="w-4 h-4 text-white" />
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => onVolumeChange && onVolumeChange(Number(e.target.value))}
                    className="accent-[#FF00FF] w-24"
                />
            </div>
        </div>
    );
}
