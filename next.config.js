/**
 * Next.js config optimized for a modern production-ready site
 */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  swcMinify: true,
  compiler: {
    removeConsole: {
      exclude: ['error', 'warn'],
    },
  },
  images: {
    domains: ['images.unsplash.com', 'placehold.co'],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://luxora-estates.vercel.app',
    NEXT_PUBLIC_TWITTER_HANDLE: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@luxora_estates',
  },
};

module.exports = nextConfig;
