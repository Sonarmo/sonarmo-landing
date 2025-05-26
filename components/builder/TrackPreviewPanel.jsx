import { useEffect, useState } from "react";

export default function TrackPreviewPanel({ accessToken }) {
  const [nextTracks, setNextTracks] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);

  useEffect(() => {
    if (!accessToken) return;

    const fetchQueue = async () => {
      try {
        const res = await fetch("https://api.spotify.com/v1/me/player/queue", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setNextTracks(data.queue.slice(0, 3));
        }
      } catch (err) {
        console.error("❌ Erreur récupération de la queue :", err);
      }
    };

    const fetchRecent = async () => {
      try {
        const res = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=3", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          const recent = data.items.map(item => item.track);
          setRecentTracks(recent);
        }
      } catch (err) {
        console.error("❌ Erreur récupération des pistes récentes :", err);
      }
    };

    fetchQueue();
    fetchRecent();
  }, [accessToken]);

  return (
    <div className="bg-[#1c1c1c] p-4 rounded-2xl shadow-lg text-white">
      <h3 className="text-lg font-semibold mb-3">🎶 File d’attente</h3>

      <div className="mb-4">
        <p className="text-gray-400 mb-1 text-sm">À venir :</p>
        <ul className="space-y-1 text-sm">
          {nextTracks.map(track => (
            <li key={track.id}>
              {track.name} – {track.artists.map(a => a.name).join(", ")}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-gray-400 mb-1 text-sm">Écoutés récemment :</p>
        <ul className="space-y-1 text-sm">
          {recentTracks.map(track => (
            <li key={track.id}>
              {track.name} – {track.artists.map(a => a.name).join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}