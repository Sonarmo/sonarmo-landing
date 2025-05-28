export function aggregateAudioStats(tracks) {
  if (!tracks || tracks.length === 0) return null;

  const total = tracks.length;

  // Moyennes des valeurs numériques
  const sum = {
    energy: 0,
    valence: 0,
    danceability: 0,
    tempo: 0,
    instrumentalness: 0,
    acousticness: 0,
    liveness: 0,
  };

  const genresMap = {};

  for (const track of tracks) {
    sum.energy += track.energy || 0;
    sum.valence += track.valence || 0;
    sum.danceability += track.danceability || 0;
    sum.tempo += track.tempo || 0;
    sum.instrumentalness += track.instrumentalness || 0;
    sum.acousticness += track.acousticness || 0;
    sum.liveness += track.liveness || 0;

    if (Array.isArray(track.genres)) {
      for (const genre of track.genres) {
        genresMap[genre] = (genresMap[genre] || 0) + 1;
      }
    }
  }

  // Top genres triés
  const topGenres = Object.entries(genresMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre, count]) => ({ genre, count }));

  // Résultat final
  return {
    totalTracks: total,
    averageEnergy: sum.energy / total,
    averageValence: sum.valence / total,
    averageDanceability: sum.danceability / total,
    averageTempo: sum.tempo / total,
    averageInstrumentalness: sum.instrumentalness / total,
    averageAcousticness: sum.acousticness / total,
    averageLiveness: sum.liveness / total,
    topGenres,
  };
}