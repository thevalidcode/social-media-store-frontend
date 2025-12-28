import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          // "https://validpanel.com/social-media-store/backend/api/v1/:path*",
          "http://localhost:6060/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
