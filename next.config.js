/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.scdn.co', 'mosaic.scdn.co'],
  },
  async redirects() {
    return [
      {
        source: '/sonarmo-team',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;