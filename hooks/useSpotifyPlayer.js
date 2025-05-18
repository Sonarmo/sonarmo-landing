import { useState, useEffect, useRef } from "react";

export default function useSpotifyPlayer(accessToken) {
    const [player, setPlayer] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [isShuffling, setIsShuffling] = useState(false);

    const playerRef = useRef(null);

    useEffect(() => {
        if (!accessToken || window.Spotify === undefined || playerRef.current) return;

        const player = new window.Spotify.Player({
            name: "Sonarmo Web Player",
            getOAuthToken: (cb) => cb(accessToken),
            volume: 0.5,
        });

        player.addListener("ready", ({ device_id }) => {
            setDeviceId(device_id);
        });

        player.addListener("player_state_changed", (state) => {
            if (!state) return;
            setIsPlaying(!state.paused);
            setPosition(state.position / 1000);
            setDuration(state.duration / 1000);
            setCurrentTrack(state.track_window.current_track);
        });

        player.connect();
        setPlayer(player);
        playerRef.current = player;
    }, [accessToken]);

    const playPause = () => {
        if (!player) return;
        player.togglePlay();
    };

    const nextTrack = () => {
        if (player) player.nextTrack();
    };

    const previousTrack = () => {
        if (player) player.previousTrack();
    };

    const seek = (seconds) => {
        if (player) player.seek(seconds * 1000);
    };

    const changeVolume = (val) => {
        if (player) {
            player.setVolume(val);
            setVolume(val);
        }
    };

    const toggleShuffle = async () => {
        if (!accessToken) return;
        try {
            const newShuffle = !isShuffling;
            await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${newShuffle}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setIsShuffling(newShuffle);
        } catch (error) {
            console.error("Erreur shuffle:", error);
        }
    };

    return {
        player,
        deviceId,
        isPlaying,
        currentTrack,
        position,
        duration,
        volume,
        playPause,
        nextTrack,
        previousTrack,
        seek,
        changeVolume,
        isShuffling,
        toggleShuffle,
    };
}
