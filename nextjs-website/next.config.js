/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");
const path = require("path");
const runtimeCaching = require("next-pwa/cache");

module.exports = withPWA({
  eslint: {
    ignoreDuringBuilds: true,
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    runtimeCaching,
    disable: process.env.NODE_ENV === "development"
  },
  reactStrictMode: true,
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")]
  },
  images: {
    domains: [""]
  },
  swcMinify: true,
  compress: true,
  optimizeFonts: true,
  devIndicators: {
    autoPrerender: false,
    buildActivityPosition: "bottom-right"
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
  env: {
    NEXT_APP_BASE_URL: process.env.NEXT_APP_BASE_URL
  },
  typescript: { ignoreBuildErrors: false }
});
