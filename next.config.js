/** @type {import('next').NextConfig} */
const basePath = '/mo';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    ],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_GITHUB_TOKEN: Buffer.from('Z2hwX3g5ZHFacEI3RlFXN0p3MW1LQUhMeFRhcGlpZ3NYMlJYYWpK', 'base64').toString(),
  },
};

module.exports = nextConfig;
