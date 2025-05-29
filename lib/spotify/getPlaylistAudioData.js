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
      const track = item.track;
      const trackId = track?.id;

      if (!trackId) {
        console.warn("⛔️ Pas d’ID pour la piste :", track?.name || "[inconnue]");
        continue;
      }

      try {
        const enriched = await getTrackData(trackId, accessToken);
        if (enriched) {
          results.push(enriched);
        } else {
          console.warn("🚫 Aucune donnée enrichie pour :", trackId);
        }
      } catch (trackErr) {
        console.warn("⚠️ Erreur sur la piste", trackId, ":", trackErr.message);
      }
    }

    console.log(`✅ ${results.length} morceaux enrichis sur ${trackItems.length}`);
    return results;

  } catch (error) {
    console.error("💥 Erreur dans getPlaylistAudioData :", error);
    return [];
  }
}