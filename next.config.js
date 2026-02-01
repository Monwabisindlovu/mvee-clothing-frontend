/** @type {import('next').NextConfig} */
const path = require('path');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  webpack(config) {
    // Alias for @ -> src
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };

    // Catch case-sensitive import issues on Windows (same as Linux/Vercel)
    config.plugins.push(new CaseSensitivePathsPlugin());

    return config;
  },
};

module.exports = nextConfig;
