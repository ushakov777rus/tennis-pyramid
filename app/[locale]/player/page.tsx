import { notFound } from "next/navigation";

import { handlePlayerRedirect } from "@/app/player/_redirect";
import { isLocale } from "@/app/i18n/config";

type PageParams = { locale: string };

type PageProps = {
  params: Promise<PageParams>;
};

export default async function LocalePlayerRootPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  await handlePlayerRedirect(locale);
}
