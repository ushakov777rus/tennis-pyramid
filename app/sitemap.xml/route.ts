// app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { ClubsRepository } from "@/app/repositories/ClubsRepository";
import { locales } from "../i18n/config";
import { withLocalePath } from "../i18n/routing";

const BASE_URL = "https://honeycup.ru";

type LocalizedStaticRoute = {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
};

const localizedStaticRoutes: LocalizedStaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/tournaments", changeFrequency: "daily", priority: 0.9 },
  { path: "/matches", changeFrequency: "daily", priority: 0.8 },
  { path: "/rating", changeFrequency: "weekly", priority: 0.8 },
  { path: "/freetournament", changeFrequency: "weekly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/clubs", changeFrequency: "weekly", priority: 0.9 },
];

function buildAlternates(path: string) {
  const defaultUrl = `${BASE_URL}${path}`;
  const alternates = locales.reduce<Record<string, string>>((acc, locale) => {
    acc[locale] = `${BASE_URL}${withLocalePath(locale, path)}`;
    return acc;
  }, {});
  if (!alternates["x-default"]) {
    alternates["x-default"] = defaultUrl;
  }
  return alternates;
}

type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
  alternates: Record<string, string>;
};

async function buildSitemapEntries(): Promise<SitemapEntry[]> {
  const localizedEntries: SitemapEntry[] = localizedStaticRoutes.flatMap(
    ({ path, changeFrequency, priority }) => {
      const alternates = buildAlternates(path);
      const lastModified = new Date();

      return locales.map((locale) => ({
        url: `${BASE_URL}${withLocalePath(locale, path)}`,
        lastModified,
        changeFrequency,
        priority,
        alternates,
      }));
    }
  );

  let tournamentEntries: SitemapEntry[] = [];
  try {
    const tournaments = await TournamentsRepository.loadAllSlugs();
    tournamentEntries = tournaments.flatMap((tournament) => {
      const path = `/tournaments/${tournament.slug}`;
      const alternates = buildAlternates(path);
      const lastModified = tournament.updatedAt
        ? new Date(tournament.updatedAt)
        : new Date();

      return locales.map((locale) => ({
        url: `${BASE_URL}${withLocalePath(locale, path)}`,
        lastModified,
        changeFrequency: "daily",
        priority: 0.8,
        alternates,
      }));
    });
  } catch (error) {
    console.error("Ошибка генерации sitemap (турниры):", error);
  }

  let clubEntries: SitemapEntry[] = [];
  try {
    const clubs = await ClubsRepository.loadAllSlugs();
    clubEntries = clubs.flatMap((club) => {
      const path = `/clubs/${club.slug}`;
      const alternates = buildAlternates(path);
      const lastModified = club.updatedAt ? new Date(club.updatedAt) : new Date();

      return locales.map((locale) => ({
        url: `${BASE_URL}${withLocalePath(locale, path)}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates,
      }));
    });
  } catch (error) {
    console.error("Ошибка генерации sitemap (клубы):", error);
  }

  return [...localizedEntries, ...tournamentEntries, ...clubEntries];
}

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>\n' +
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
  const entries = await buildSitemapEntries();

  // Добавьте тестовую запись для проверки
  const testEntry = {
    url: `${BASE_URL}/test-page`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.5,
    alternates: {
      'ru': `${BASE_URL}/ru/test-page`,
      'en': `${BASE_URL}/en/test-page`,
      'x-default': `${BASE_URL}/test-page`
    }
  };

  const allEntries = [...entries, testEntry];

  const body = allEntries
    .map((entry) => {
      const { url, lastModified, changeFrequency, priority, alternates } = entry;

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

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}