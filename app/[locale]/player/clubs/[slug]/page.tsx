import { notFound } from "next/navigation";

import PlayerClubPage from "@/app/player/clubs/[slug]/page";
import { isLocale } from "@/app/i18n/config";

type PageParams = { locale: string; slug: string };

type PageProps = {
  params: Promise<PageParams>;
};

export default async function LocalePlayerClubPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <PlayerClubPage params={Promise.resolve({ slug })} />;
}
