module.exports = {
  images: {
    domains: ["i.scdn.co", "mosaic.scdn.co"],
  },
  async redirects() {
    return [
      {
        source: '/team',
        destination: '/',
        permanent: false, // redirection temporaire
      },
    ];
  },
};