/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  reactStrictMode: true,
  exportPathMap: async function () {
    return {
      "/": { page: "/" },
    };
  },
  images: {
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.output.libraryTarget = "umd";
    }
    return config;
  },
};
module.exports = nextConfig;
