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
        const setupPlayer = async () => {
            if (!accessToken || typeof window === "undefined" || window.Spotify === undefined || playerRef.current) return;

            const newPlayer = new window.Spotify.Player({
                name: "Sonarmo Web Player",
                getOAuthToken: (cb) => cb(accessToken),
                volume: 0.5,
            });

            newPlayer.addListener("ready", ({ device_id }) => {
                setDeviceId(device_id);
            });

            newPlayer.addListener("player_state_changed", (state) => {
                if (!state) return;
                setIsPlaying(!state.paused);
                setPosition(state.position / 1000);
                setDuration(state.duration / 1000);
                setCurrentTrack(state.track_window.current_track);
            });

            newPlayer.connect();
            setPlayer(newPlayer);
            playerRef.current = newPlayer;
        };

        setupPlayer();
    }, [accessToken]);

    useEffect(() => {
        if (!accessToken || player) return;

        const fetchCurrentPlayback = async () => {
            try {
                const res = await fetch("https://api.spotify.com/v1/me/player", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const data = await res.json();
                if (data && data.item) {
                    setCurrentTrack(data.item);
                    setIsPlaying(!data.is_playing);
                    setPosition(data.progress_ms / 1000);
                    setDuration(data.item.duration_ms / 1000);
                    setVolume(data.device.volume_percent / 100);
                }
            } catch (error) {
                console.error("Erreur récupération état Spotify:", error);
            }
        };

        fetchCurrentPlayback();
    }, [accessToken, player]);

    const callWebAPI = async (endpoint, method = "PUT", body = null) => {
        if (!accessToken) return;
        try {
            await fetch(`https://api.spotify.com/v1/me/player/${endpoint}`, {
                method,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: body ? JSON.stringify(body) : null,
            });
        } catch (error) {
            console.error(`Erreur Spotify API - ${endpoint}:`, error);
        }
    };

    const playPause = async () => {
        if (player) {
            player.togglePlay();
        } else {
            const endpoint = isPlaying ? "pause" : "play";
            await callWebAPI(endpoint);
        }
    };

    const nextTrack = async () => {
        if (player) {
            player.nextTrack();
        } else {
            await callWebAPI("next");
        }
    };

    const previousTrack = async () => {
        if (player) {
            player.previousTrack();
        } else {
            await callWebAPI("previous");
        }
    };

    const seek = async (seconds) => {
        if (player) {
            player.seek(seconds * 1000);
        } else {
            await callWebAPI(`seek?position_ms=${seconds * 1000}`);
        }
    };

    const changeVolume = async (val) => {
        setVolume(val);
        if (player) {
            player.setVolume(val);
        } else {
            await callWebAPI(`volume?volume_percent=${Math.round(val * 100)}`);
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
