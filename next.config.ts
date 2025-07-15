import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/sys/api/:path*",
  //       destination: "https://validpanel.com:6060/sys/api/:path*",
  //     },
  //   ];
  // },
};

export default nextConfig;
