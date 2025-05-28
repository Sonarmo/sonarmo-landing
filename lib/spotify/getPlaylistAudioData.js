import { getTrackData } from "@/lib/spotify/getTrackData.js";

export async function getPlaylistAudioData(playlistId, accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    // 1. Récupérer tous les morceaux de la playlist
    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`, { headers });
    const data = await res.json();

    const trackItems = data.items || [];
    const results = [];

    for (const item of trackItems) {
      const trackId = item.track?.id;
      if (trackId) {
        const enriched = await getTrackData(trackId, accessToken);
        if (enriched) results.push(enriched);
      }
    }

    return results;
  } catch (error) {
    console.error("Erreur dans getPlaylistAudioData :", error);
    return [];
  }
}