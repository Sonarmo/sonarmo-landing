// EnhancedPlayer.js — version corrigée et centralisée pour dashboard.js

import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import Image from "next/image";

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
    const formatTime = (ms) => {
        if (!ms) return "0:00";
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    if (!player || !currentTrack) {
        return <p className="text-gray-400 text-center mt-10">Chargement du lecteur...</p>;
    }

    return (
        <div className="bg-[#1c1c1c] rounded-2xl p-6 shadow-lg max-w-xl mx-auto flex flex-col items-center gap-6">
            <div className="w-48 h-48 relative rounded-lg overflow-hidden">
                <Image
                    src={currentTrack.image}
                    alt="Pochette"
                    layout="fill"
                    objectFit="cover"
                />
            </div>

            <div className="text-center">
                <h2 className="text-xl font-semibold">{currentTrack.name}</h2>
                <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
            </div>

            {/* Contrôles */}
            <div className="flex items-center gap-6">
                <button onClick={onPrevious} className="hover:scale-110 transition">
                    <SkipBack size={24} />
                </button>
                <button onClick={onPlayPause} className="hover:scale-110 transition">
                    {player._options && player._options.volume > 0 ? <Pause size={36} /> : <Play size={36} />}
                </button>
                <button onClick={onNext} className="hover:scale-110 transition">
                    <SkipForward size={24} />
                </button>
            </div>

            {/* Barre de progression */}
            <div className="w-full">
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={position}
                    onChange={(e) => onSeek(Number(e.target.value))}
                    className="w-full accent-[#F28500] h-2 rounded-lg bg-[#333]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatTime(position)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Volume */}
            <div className="w-full">
                <label htmlFor="volume" className="block text-sm mb-1 text-gray-400">
                    Volume : {(volume * 100).toFixed(0)}%
                </label>
                <input
                    id="volume"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#333] rounded-lg accent-[#F28500]"
                    style={{
                        background: `linear-gradient(to right, #F28500 ${volume * 100}%, #333 ${volume * 100}%)`,
                    }}
                />
            </div>
        </div>
    );
}
