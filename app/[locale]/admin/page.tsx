import { notFound } from "next/navigation";

import { handleAdminRedirect } from "@/app/admin/_redirect";
import { isLocale } from "@/app/i18n/config";

type PageParams = { locale: string };

type PageProps = {
  params: Promise<PageParams>;
};

export default async function LocaleAdminRootPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  await handleAdminRedirect(locale);
}
