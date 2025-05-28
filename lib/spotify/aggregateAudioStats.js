export function aggregateAudioStats(tracks) {
  if (!Array.isArray(tracks) || tracks.length === 0) return null;

  const total = tracks.length;
  const fields = [
    "energy",
    "valence",
    "danceability",
    "tempo",
    "instrumentalness",
    "acousticness",
    "liveness",
  ];

  const sum = {};
  fields.forEach(field => sum[field] = 0);

  const genresMap = {};

  for (const track of tracks) {
    fields.forEach(field => {
      const value = parseFloat(track[field]);
      sum[field] += isNaN(value) ? 0 : value;
    });

    if (Array.isArray(track.genres)) {
      for (const genre of track.genres) {
        genresMap[genre] = (genresMap[genre] || 0) + 1;
      }
    }
  }

  const topGenres = Object.entries(genresMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre, count]) => ({ genre, count }));

  const averages = {};
  fields.forEach(field => {
    averages[`average${capitalize(field)}`] = parseFloat((sum[field] / total).toFixed(3));
  });

  return {
    totalTracks: total,
    ...averages,
    topGenres,
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}