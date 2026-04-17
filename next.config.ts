import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enables static exports
  images: {
    unoptimized: true, // Required because Next.js Image Optimization doesn't work with static exports
  },
};

export default nextConfig;
