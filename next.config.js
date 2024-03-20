/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["geist"],
  compiler: {
    removeConsole: {
      exclude: ["error", "info"],
    },
  },
};

export default config;
