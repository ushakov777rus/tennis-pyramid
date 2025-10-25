// app/robots.txt/route.ts
export async function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /_next/
Disallow: /private/
Disallow: /player

Host: https://honeycup.ru

Sitemap: https://honeycup.ru/sitemap.xml`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'max-age=0, s-maxage=3600',
    },
  });
}