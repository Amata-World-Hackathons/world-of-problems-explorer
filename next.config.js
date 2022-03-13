/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH || "";
const nextConfig = {
  basePath,
  assetPrefix: basePath,
  reactStrictMode: true,
};

module.exports = nextConfig;
