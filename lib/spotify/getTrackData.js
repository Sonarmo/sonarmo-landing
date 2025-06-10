export async function getTrackData(trackId, accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  console.log("🎧 Analyse en cours pour le morceau :", trackId);

  try {
    // 1. Metadata
    const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, { headers });
    const trackData = await trackRes.json();

    if (!trackRes.ok) {
      console.error(`❌ Erreur Spotify /tracks/ (${trackRes.status}) :`, trackData);
      return null;
    }

    // 2. Audio features
    const featuresRes = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, { headers });
    const featuresData = await featuresRes.json();

    if (!featuresRes.ok) {
      console.error(`❌ Erreur Spotify /audio-features/ (${featuresRes.status}) :`, featuresData);

      if (featuresRes.status === 403 || featuresRes.status === 401) {
        throw new Error(`Token Spotify invalide ou expiré (${featuresRes.status})`);
      }

      return null;
    }

    // 3. Genres
    const artistId = trackData.artists?.[0]?.id;
    let artistGenres = [];

    if (artistId) {
      const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, { headers });
      const artistData = await artistRes.json();

      if (artistRes.ok) {
        artistGenres = artistData.genres || [];
      } else {
        console.warn(`⚠️ Erreur /artists/ (${artistRes.status}) pour ${artistId} :`, artistData);
      }
    }

    return {
      id: trackData.id,
      name: trackData.name,
      artist: trackData.artists?.[0]?.name || '',
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
    console.error("❌ Erreur dans getTrackData :", error.message || error);
    return null;
  }
}