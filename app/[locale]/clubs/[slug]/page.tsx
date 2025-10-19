import { notFound } from "next/navigation";

import ClubPage from "@/app/clubs/[slug]/page";
import { isLocale } from "@/app/i18n/config";

type PageParams = { locale: string; slug: string };

type PageProps = {
  params: Promise<PageParams>;
};

export default async function LocaleClubPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <ClubPage params={Promise.resolve({ slug })} />;
}
