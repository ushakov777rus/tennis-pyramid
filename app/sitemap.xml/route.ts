import { getSitemapEntries } from "@/app/sitemap";

const XML_HEADER =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

export async function GET(): Promise<Response> {
  const entries = await getSitemapEntries();

  const body = entries
    .map((entry) => {
      const {
        url,
        lastModified,
        changeFrequency,
        priority,
        alternates,
      } = entry;

      const alternateTags = Object.entries(alternates)
        .map(
          ([hreflang, href]) =>
            `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`
        )
        .join("");

      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified.toISOString()}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
    ${alternateTags}
  </url>`;
    })
    .join("");

  const xml = `${XML_HEADER}${body}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
