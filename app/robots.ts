import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/api/", "/admin", "/_next/", "/private/"],
      },
    ],
    host: "honeycup.ru",
    sitemap: [
      "https://honeycup.ru/sitemap.xml",
    ],
  };
}
