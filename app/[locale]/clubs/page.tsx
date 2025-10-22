import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ClubsProvider } from "@/app/clubs/ClubsProvider";
import { ClubsClient } from "@/app/clubs/ClubsClient";
import { isLocale } from "@/app/i18n/config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleClubsPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <ClubsProvider mode="all">
      <Suspense fallback={null}>
        <ClubsClient />
      </Suspense>
    </ClubsProvider>
  );
}
