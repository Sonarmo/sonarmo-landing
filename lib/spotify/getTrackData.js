// lib/spotify/getTrackData.js

export async function getTrackData(trackId, accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    // 1. Récupération des metadata du morceau
    const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, { headers });
    const trackData = await trackRes.json();

    if (!trackRes.ok) {
      console.error(`❌ Erreur Spotify (track ${trackId}) :`, trackData);
      return null;
    }

    // 2. Récupération des audio features
    console.log("🔍 Appel audio features pour", trackId);
    const featuresRes = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, { headers });

    if (!featuresRes.ok) {
      const errorText = await featuresRes.text();
      console.error(`❌ Audio features API failed for ${trackId} - ${featuresRes.status}:`, errorText);

      // Gestion spécifique du 403
      if (featuresRes.status === 403) {
        throw new Error(`❌ Token invalide ou expiré (403) lors de l'accès aux audio features`);
      }

      return null;
    }

    const featuresData = await featuresRes.json();

    // 3. Récupération des genres via artist.id
    const artistId = trackData.artists?.[0]?.id;
    let artistGenres = [];

    if (artistId) {
      const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, { headers });
      const artistData = await artistRes.json();

      if (artistRes.ok) {
        artistGenres = artistData.genres || [];
      } else {
        console.warn(`⚠️ Erreur récupération des genres pour artist ${artistId} :`, artistData);
      }
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
    console.error("❌ Erreur dans getTrackData :", error.message || error);
    return null;
  }
}