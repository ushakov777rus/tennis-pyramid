import { MetadataRoute } from "next";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { ClubsRepository } from "@/app/repositories/ClubsRepository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://honeycup.ru";

  // Статические страницы
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/tournaments`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/clubs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  let tournamentUrls: MetadataRoute.Sitemap = [];
  let clubUrls: MetadataRoute.Sitemap = [];

  try {
    // Турниры
    const tournaments = await TournamentsRepository.loadAllSlugs();
    tournamentUrls = tournaments.map((t) => ({
      url: `${baseUrl}/tournaments/${t.slug}`,
      lastModified: t.updatedAt ? new Date(t.updatedAt) : new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));
  } catch (e) {
    console.error("Ошибка генерации sitemap (турниры):", e);
  }

  try {
    // Клубы
    const clubs = await ClubsRepository.loadAllSlugs();
    // ⚠️ Нужно реализовать метод loadAllSlugs в ClubsRepository
    // чтобы он возвращал: { slug: string; updatedAt?: string | Date }[]
    clubUrls = clubs.map((c) => ({
      url: `${baseUrl}/clubs/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (e) {
    console.error("Ошибка генерации sitemap (клубы):", e);
  }

  return [...routes, ...tournamentUrls, ...clubUrls];
}