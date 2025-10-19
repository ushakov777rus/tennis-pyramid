import { notFound } from "next/navigation";

import MainPage from "@/app/MainPage";
import { isLocale, locales } from "@/app/i18n/config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleHomePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <MainPage />;
}
