import { MetadataRoute } from "next";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";

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
  ];

  // Динамические турниры
  try {
    const tournaments = await TournamentsRepository.loadAllSlugs(); 
    // ⚠️ Нужно реализовать метод loadAllSlugs, чтобы он возвращал:
    // { slug: string; updatedAt?: string | Date }[]

    const tournamentUrls: MetadataRoute.Sitemap = tournaments.map((t) => ({
      url: `${baseUrl}/tournaments/${t.slug}`,
      lastModified: t.updatedAt ? new Date(t.updatedAt) : new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

    return [...routes, ...tournamentUrls];
  } catch (e) {
    console.error("Ошибка генерации sitemap:", e);
    return routes;
  }
}