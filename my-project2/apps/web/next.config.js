/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.(mp3)$/,          // Match .mp3 files
        type: 'asset/resource',    // Treat as static resources
        generator: {
          filename: 'static/media/[hash][ext][query]', // Output folder
        },
      });
      return config;
    },
  };
  
  export default nextConfig;
  