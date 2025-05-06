/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // For larger uploads like images/videos
    },
  },
  images: {
    domains: ['localhost'], // Allow image src from http://localhost:4000
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp3)$/,              // Support .mp3 files
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[hash][ext][query]',
      },
    });
    return config;
  },
};

export default nextConfig;
