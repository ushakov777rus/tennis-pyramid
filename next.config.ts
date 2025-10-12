import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Для продакшена редиректим все кроме localhost
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
      return [
        {
          source: '/:path*',
          destination: 'https://honeycup.ru/:path*',
          permanent: true,
          has: [
            {
              type: 'host',
              value: 'tennis-pyramid\.vercel\.app',
            }
          ]
        }
      ];
    }
    
    // Для разработки - никаких редиректов
    return [];
  }
};

export default nextConfig;