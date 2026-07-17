/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/mo',
  assetPrefix: '/mo',
  // يُعرَّض للعميل لبناء روابط المشاركة الصحيحة (مع /mo)
  env: {
    NEXT_PUBLIC_BASE_PATH: '/mo',
  },
};

module.exports = nextConfig;
