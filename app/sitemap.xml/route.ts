import { getSitemapEntries } from "@/app/sitemap";

const XML_HEADER =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&apos;");
}

export async function GET(): Promise<Response> {
  const entries = await getSitemapEntries();

  // Добавьте логирование для отладки
  console.log('Generating sitemap with namespace:', XML_HEADER);

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
        .sort(([a], [b]) => a.localeCompare(b))
        .map(
          ([hreflang, href]) =>
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}" />`
        )
        .join("\n");

      const sections = [
        "  <url>",
        `    <loc>${escapeXml(url)}</loc>`,
        `    <lastmod>${lastModified.toISOString()}</lastmod>`,
        `    <changefreq>${changeFrequency}</changefreq>`,
        `    <priority>${priority}</priority>`,
      ];

      if (alternateTags) {
        sections.push(alternateTags);
      }

      sections.push("  </url>");

      return sections.join("\n");
    })
    .join("\n");

  const xml = `${XML_HEADER}\n${body}\n</urlset>`;

  // Логируем первые 500 символов для проверки
  console.log('Generated XML start:', xml.substring(0, 500));

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
