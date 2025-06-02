// /pages/api/spotify/current-track.js
import { getTokenFromFirebase } from 'lib/auth';

export default async function handler(req, res) {
  try {
    const token = await getTokenFromFirebase(req);
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204 || response.status > 400) {
      return res.status(200).json(null);
    }

    const data = await response.json();
    const currentTrack = {
      id: data.item?.id,
      name: data.item?.name,
      artist: data.item?.artists?.map((a) => a.name).join(', '),
      image: data.item?.album?.images?.[0]?.url,
      uri: data.item?.uri,
    };

    res.status(200).json(currentTrack);
  } catch (err) {
    console.error("❌ Error fetching current track:", err);
    res.status(500).json({ error: 'Failed to fetch current track' });
  }
} 