import { notFound } from "next/navigation";

import ClubsPage from "@/app/admin/clubs/page";
import { isLocale } from "@/app/i18n/config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleAdminClubsPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <ClubsPage />;
}
