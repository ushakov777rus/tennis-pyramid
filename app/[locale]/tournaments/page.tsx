import type { Metadata } from "next"; // metadata type
import { notFound, redirect } from "next/navigation"; // navigation helpers

import { getDictionary } from "@/app/i18n/dictionaries"; // dictionary loader
import { isLocale, locales } from "@/app/i18n/config"; // locale helpers
import { withLocalePath } from "@/app/i18n/routing"; // locale-aware routing

const BASE_URL = "https://honeycup.ru";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = await getDictionary(locale);
  const meta = dictionary.metadata.tournaments;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${BASE_URL}${withLocalePath(locale, meta.canonical)}`
    },
  };
}

export default async function LocaleTournamentsPage({ params }: PageProps) { // locale tournaments entry
  const { locale } = await params; // unwrap locale
  if (!isLocale(locale)) { // validate locale
    notFound(); // show 404 for invalid locale
  } // end locale guard
  redirect(withLocalePath(locale, "/tournaments/1")); // enforce page number in URL
} // end LocaleTournamentsPage
