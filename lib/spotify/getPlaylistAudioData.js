import { getTrackData } from "@/lib/spotify/getTrackData";

export async function getPlaylistAudioData(playlistId, accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    console.log("🎧 Récupération des morceaux de la playlist :", playlistId);

    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=20`, { headers });
    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Erreur Spotify (playlist):", data);
      return [];
    }

    const trackItems = data.items || [];
    const results = [];

    for (const item of trackItems) {
      const trackId = item.track?.id;

      if (trackId) {
        try {
          const enriched = await getTrackData(trackId, accessToken);
          if (enriched) results.push(enriched);
        } catch (trackErr) {
          console.warn("⚠️ Erreur sur la piste", trackId, trackErr.message);
        }
      }
    }

    console.log(`✅ ${results.length} morceaux enrichis sur ${trackItems.length}`);
    return results;

  } catch (error) {
    console.error("💥 Erreur dans getPlaylistAudioData :", error);
    return [];
  }
}