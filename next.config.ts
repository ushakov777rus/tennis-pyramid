import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://honeycup.ru/:path*',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
