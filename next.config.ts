import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'minio',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '10.129.57.64',
        port: '9000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
