import { MetadataRoute } from "next";

const BASE_URL = "https://honeycup.ru";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/ru/", "/en/"],
        disallow: ["/api/", "/admin", "/_next/", "/private/", "/player"],
      },
    ],
    host: BASE_URL,
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

// Отключаем кэширование для этого route
export const dynamic = 'force-dynamic';
export const revalidate = 0;