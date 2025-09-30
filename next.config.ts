import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for modern browsers
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // SWC minification is enabled by default in Next.js 13+
  // Ensure production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundle

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
