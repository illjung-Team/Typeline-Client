/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  // exportPathMap: async function () {
    //   return {
      //     "/": { page: "/" },
      //   };
      // },
      reactStrictMode: true,
      images: {
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.output.libraryTarget = "umd";
  //   }
  //   return config;
  // },
};
module.exports = nextConfig;
