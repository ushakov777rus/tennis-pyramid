import { notFound } from "next/navigation";

import PlayerTournamentPage from "@/app/player/clubs/[slug]/[tournamentSlug]/page";
import { isLocale } from "@/app/i18n/config";

type PageParams = { locale: string; slug: string; tournamentSlug: string };

type PageProps = {
  params: Promise<PageParams>;
};

export default async function LocalePlayerTournamentPage({ params }: PageProps) {
  const { locale, slug, tournamentSlug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <PlayerTournamentPage
      params={Promise.resolve({ slug, tournamentSlug })}
    />
  );
}
