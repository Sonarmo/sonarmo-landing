/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image-cdn-ak.spotifycdn.com", // images de playlists
      },
      {
        protocol: "https",
        hostname: "i.scdn.co", // artistes et morceaux
      },
      {
        protocol: "https",
        hostname: "mosaic.scdn.co", // images mosaïques Spotify
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // ✅ pour Cloudinary
      },
    ],
  },
};

module.exports = nextConfig;