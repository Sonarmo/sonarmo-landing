import { createContext, useContext, useEffect, useRef, useState } from "react";

export const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);

  const hasPlayedOnce = useRef(false);

  // 👇 Affiche le token pour debug
  useEffect(() => {
    if (accessToken) {
      console.log("🎧 AccessToken reçu :", accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken || player) return;

    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new window.Spotify.Player({
        name: "Sonarmo Player",
        getOAuthToken: cb => cb(accessToken),
        volume: 0.5,
      });

      newPlayer.addListener("ready", async ({ device_id }) => {
        console.log("✅ Spotify Player prêt avec device :", device_id);
        setDeviceId(device_id);
        setPlayer(newPlayer);

        try {
          await fetch("https://api.spotify.com/v1/me/player", {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ device_ids: [device_id], play: false }),
          });
        } catch (error) {
          console.error("❌ Erreur lors de l'assignation du device :", error);
        }
      });

      newPlayer.addListener("player_state_changed", (state) => {
        if (!state || !state.track_window?.current_track) return;

        const track = state.track_window.current_track;
        setCurrentTrack({
          id: track.id,
          name: track.name,
          artist: track.artists.map((a) => a.name).join(", "),
          image: track.album.images[0]?.url,
        });
        setIsPlaying(!state.paused);
        setDuration(state.duration);
        setPosition(state.position);
      });

      newPlayer.connect();
    };

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
  }, [accessToken, player]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!player) return;
      const state = await player.getCurrentState();
      if (state) {
        setPosition(state.position);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [player]);

  // 👇 Fonction pour lancer une lecture manuelle
  async function startPlayback() {
    if (!deviceId || !accessToken) {
      console.warn("⛔️ Pas de deviceId ou d'accessToken pour démarrer la lecture");
      return;
    }

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context_uri: "spotify:playlist:37i9dQZF1DX4WYpdgoIcn6", // playlist test
          offset: { position: 0 },
          position_ms: 0
        }),
      });
      console.log("▶️ Lecture lancée !");
    } catch (error) {
      console.error("❌ Erreur lecture manuelle :", error);
    }
  }

  return (
    <PlayerContext.Provider value={{
      player,
      deviceId,
      currentTrack,
      isPlaying,
      volume,
      duration,
      position,
      isShuffling,
      setVolume,
      setAccessToken,
      startPlayback
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}