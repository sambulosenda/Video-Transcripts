/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.groq.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/groq/:path*',
        destination: 'https://api.groq.com/:path*',
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

export default nextConfig;
