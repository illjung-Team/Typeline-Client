/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  exportPathMap: async function () {
    return {
      "/": { page: "/" },
    };
  },
  images: {
    unoptimized: true,
  },
  // assetPrefix: ".",
  compiler: {
    styledComponents: true,
  },
  // webpack: (config) => {
  //   config.resolve.fallback = { fs: false };

  //   return config;
  // },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.output.libraryTarget = "umd";
    }
    return config;
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
};
module.exports = nextConfig;
