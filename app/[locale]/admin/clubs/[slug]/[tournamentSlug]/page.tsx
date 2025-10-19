import { notFound } from "next/navigation";

import TournamentPage from "@/app/admin/clubs/[slug]/[tournamentSlug]/page";
import { isLocale } from "@/app/i18n/config";

type PageParams = { locale: string; slug: string; tournamentSlug: string };

type PageProps = {
  params: Promise<PageParams>;
};

export default async function LocaleAdminClubTournamentPage({ params }: PageProps) {
  const { locale, slug, tournamentSlug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <TournamentPage
      params={Promise.resolve({ slug, tournamentSlug })}
    />
  );
}
