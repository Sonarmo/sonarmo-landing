// /pages/api/spotify/recent-tracks.js
import { getTokenFromFirebase } from '/lib/spotifyTokens';

export default async function handler(req, res) {
  try {
    const token = await getTokenFromFirebase(req);
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=10', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const recentTracks = data.items.map(({ track }) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
      image: track.album.images[0]?.url,
      uri: track.uri,
    }));

    res.status(200).json(recentTracks);
  } catch (err) {
    console.error("❌ Error fetching recent tracks:", err);
    res.status(500).json({ error: 'Failed to fetch recent tracks' });
  }
}
