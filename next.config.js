/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  compiler: {
    styledComponents: true,
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
};
module.exports = nextConfig;
