import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/webp'],
    qualities: [40, 50, 55, 65, 75],
    minimumCacheTTL: 31536000,
    deviceSizes: [384, 480, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384],
  },
};

export default nextConfig;
