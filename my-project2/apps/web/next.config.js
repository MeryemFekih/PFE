/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '90mb', 
    },
  },
  images: {
    domains: ['localhost'], 
  },
  webpack: (config) => {
    config.module.rules.push({
      test:  /\.(mp4|mov|avi|mkv|pdf|docx?|pptx?|xlsx?)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[hash][ext][query]',
      },
    });
    return config;
  },
};

export default nextConfig;
