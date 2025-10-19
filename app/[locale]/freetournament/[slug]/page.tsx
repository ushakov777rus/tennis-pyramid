import { notFound } from "next/navigation";

import FreeTournamentSlugPage, { dynamic, revalidate } from "@/app/freetournament/[slug]/pageContent";
import { isLocale } from "@/app/i18n/config";

type PageParams = {
  locale: string;
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

export { dynamic, revalidate };

export default async function LocaleFreeTournamentSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <FreeTournamentSlugPage params={Promise.resolve({ slug })} />;
}
