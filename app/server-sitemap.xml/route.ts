const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://honeycup.ru";

export const dynamic = "force-static";
export const revalidate = 60 * 60; // revalidate once per hour

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <sitemap>\n` +
    `    <loc>${BASE_URL}/sitemap.xml</loc>\n` +
    `  </sitemap>\n` +
    `</sitemapindex>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
