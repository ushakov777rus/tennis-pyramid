import { MetadataRoute } from "next";

import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { ClubsRepository } from "@/app/repositories/ClubsRepository";
import { locales } from "./i18n/config";
import { withLocalePath } from "./i18n/routing";

const BASE_URL = "https://honeycup.ru";

type LocalizedStaticRoute = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
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
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
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

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  return buildSitemapEntries();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await buildSitemapEntries();
  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    alternates: { languages: entry.alternates },
  }));
}
