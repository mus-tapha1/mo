/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/mo',
  assetPrefix: '/mo',
};

module.exports = nextConfig;
