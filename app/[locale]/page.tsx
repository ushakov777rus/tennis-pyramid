import { notFound } from "next/navigation";

import MainPage from "@/app/MainPage";
import { isLocale, locales } from "@/app/i18n/config";

type PageProps = {
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleHomePage({ params }: PageProps) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  return <MainPage />;
}
