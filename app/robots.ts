import { MetadataRoute } from "next";

const BASE_URL = "https://honeycup.ru";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/ru/", "/en/"],
        disallow: ["/api/", "/admin", "/_next/", "/private/"],
      },
    ],
    host: "honeycup.ru",
    sitemap: [`${BASE_URL}/sitemap.xml`],
  };
}
