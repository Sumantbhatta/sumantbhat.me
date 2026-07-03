import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow unoptimized local images and SVGs without domain restriction
  images: {
    unoptimized: true, // We serve all images locally from /public
  },
  // Suppress hydration warnings for custom elements (dotlottie-player)
  reactStrictMode: true,
  // Allow connections from local network for testing on mobile
  allowedDevOrigins: ['192.168.1.38', 'localhost'],
};

export default nextConfig;
