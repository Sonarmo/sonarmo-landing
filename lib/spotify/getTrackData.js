export async function getTrackData(trackId, accessToken) {
  const headers = { Authorization: `Bearer ${accessToken}` };

  try {
    // 🎵 1. Track info
    const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, { headers });
    if (!trackRes.ok) throw new Error(`Track API failed for ${trackId}`);
    const trackData = await trackRes.json();

    // 🎧 2. Audio features
    const featuresRes = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, { headers });
    if (!featuresRes.ok) throw new Error(`Audio features API failed for ${trackId}`);
    const featuresData = await featuresRes.json();

    // 🎤 3. Artist genres
    const artistId = trackData.artists?.[0]?.id;
    let artistGenres = [];
    if (artistId) {
      const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, { headers });
      if (artistRes.ok) {
        const artistData = await artistRes.json();
        artistGenres = artistData.genres || [];
      } else {
        console.warn(`⚠️ Artist genres fetch failed for ${artistId}`);
      }
    }

    // 🎁 4. Output
    return {
      id: trackData.id,
      name: trackData.name,
      artist: trackData.artists?.map(a => a.name).join(", ") || '',
      album: trackData.album?.name || '',
      image: trackData.album?.images?.[0]?.url || '',
      release_date: trackData.album?.release_date || '',
      popularity: trackData.popularity || 0,
      preview_url: trackData.preview_url || '',
      external_url: trackData.external_urls?.spotify || '',
      genres: artistGenres,
      energy: featuresData.energy,
      valence: featuresData.valence,
      danceability: featuresData.danceability,
      tempo: featuresData.tempo,
      loudness: featuresData.loudness,
      speechiness: featuresData.speechiness,
      instrumentalness: featuresData.instrumentalness,
      acousticness: featuresData.acousticness,
      liveness: featuresData.liveness,
      key: featuresData.key,
      mode: featuresData.mode,
    };
  } catch (error) {
    console.error("❌ Erreur dans getTrackData :", error.message);
    return null;
  }
}