import { notFound } from "next/navigation";

import PlayerClubsPage from "@/app/player/clubs/page";
import { isLocale } from "@/app/i18n/config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalePlayerClubsPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <PlayerClubsPage />;
}
