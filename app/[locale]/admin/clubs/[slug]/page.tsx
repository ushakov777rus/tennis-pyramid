import { notFound } from "next/navigation";

import ClubPage from "@/app/admin/clubs/[slug]/page";
import { isLocale } from "@/app/i18n/config";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function LocaleAdminClubPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <ClubPage params={Promise.resolve({ slug })} />;
}
