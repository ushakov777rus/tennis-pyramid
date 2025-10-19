import { notFound } from "next/navigation";

import TournamentPage, { dynamic, revalidate } from "@/app/tournaments/[slug]/pageContent";
import { isLocale } from "@/app/i18n/config";

type PageProps = {
  params: Promise<{ locale: string; tournamentSlug: string }>;
};

export { dynamic, revalidate };

export default async function LocaleTournamentPage({ params }: PageProps) {
  const { locale, tournamentSlug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <TournamentPage params={Promise.resolve({ tournamentSlug })} />;
}
