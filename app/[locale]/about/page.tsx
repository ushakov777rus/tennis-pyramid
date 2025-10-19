import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AboutPage from "@/app/about/AboutPage";
import { getDictionary } from "@/app/i18n/dictionaries";
import { isLocale, locales } from "@/app/i18n/config";
import { withLocalePath } from "@/app/i18n/routing";

const BASE_URL = "https://honeycup.ru";

type PageProps = {
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isLocale(params.locale)) {
    return {};
  }

  const dictionary = await getDictionary(params.locale);
  const meta = dictionary.metadata.about;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${BASE_URL}${withLocalePath(params.locale, meta.canonical)}`,
    },
  };
}

export default function LocaleAboutPage({ params }: PageProps) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  return <AboutPage />;
}
