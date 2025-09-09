import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/private/"], // ⚠️ добавь свои приватные роуты
      },
    ],
    sitemap: "https://honeycup.ru/sitemap.xml",
  };
}