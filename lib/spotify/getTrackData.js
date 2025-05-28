// lib/spotify/getTrackData.js

export async function getTrackData(trackId, accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    // 1. Récupération des metadata du morceau
    const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, { headers });
    const trackData = await trackRes.json();

    // 2. Récupération des audio features
    const featuresRes = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, { headers });
    const featuresData = await featuresRes.json();

    // 3. Récupération des genres via artist.id
    const artistId = trackData.artists?.[0]?.id;
    let artistGenres = [];
    if (artistId) {
      const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, { headers });
      const artistData = await artistRes.json();
      artistGenres = artistData.genres || [];
    }

    // 4. Structure finale retournée
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
    console.error("Erreur dans getTrackData :", error);
    return null;
  }
}