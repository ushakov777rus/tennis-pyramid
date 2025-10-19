import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LanguageProvider } from "@/app/components/LanguageProvider";
import { UserProvider } from "@/app/components/UserContext";
import { TournamentsProvider } from "@/app/tournaments/TournamentsProvider";
import { AppShell } from "@/app/components/AppShell";
import { getDictionary } from "@/app/i18n/dictionaries";
import { defaultLocale, isLocale, locales, type Locale } from "@/app/i18n/config";
import { withLocalePath } from "@/app/i18n/routing";
import Script from "next/script";
import { YaMetrika } from "@/app/components/analytics/YaMetrika";

type LayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

const BASE_URL = "https://honeycup.ru";

function absoluteLocaleUrl(locale: Locale, path: string) {
  return `${BASE_URL}${withLocalePath(locale, path)}`;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = await getDictionary(locale);
  const homeMeta = dictionary.metadata.home;

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: homeMeta.title,
      template: `%s — ${dictionary.app.name}`,
    },
    description: homeMeta.description,
    keywords: homeMeta.keywords,
    alternates: {
      languages: locales.reduce<Record<string, string>>((acc, item) => {
        acc[item] = absoluteLocaleUrl(item, "/");
        return acc;
      }, {}),
    },
    openGraph: {
      type: "website",
      url: absoluteLocaleUrl(locale, "/"),
      title: homeMeta.title,
      description: homeMeta.ogDescription,
      siteName: dictionary.app.name,
      images: [
        {
          url: "/og-default.png",
          width: 1200,
          height: 630,
          alt: `${dictionary.app.name} — ${dictionary.app.slogan}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: homeMeta.title,
      description: homeMeta.description,
      images: ["/og-default.png"],
    },
    robots: { index: true, follow: true },
    icons: {
      icon: [
        { url: "/favicon.ico?v=2", sizes: "any" },
        { url: "/icon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
        { url: "/icon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
        { url: "/icon-48x48.png?v=2", sizes: "48x48", type: "image/png" },
        { url: "/icon-64x64.png?v=2", sizes: "64x64", type: "image/png" },
        { url: "/icon-96x96.png?v=2", sizes: "96x96", type: "image/png" },
        { url: "/icon-128x128.png?v=2", sizes: "128x128", type: "image/png" },
        { url: "/icon-192x192.png?v=2", sizes: "192x192", type: "image/png" },
        { url: "/icon-256x256.png?v=2", sizes: "256x256", type: "image/png" },
        { url: "/icon-512x512.png?v=2", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/icon-180x180.png?v=2", sizes: "180x180", type: "image/png" }],
      other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg?v=2", color: "#0d0f10" }],
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: dictionary.app.name,
    url: BASE_URL,
    logo: `${BASE_URL}/icon-180x180.png?v=2`,
    sport: ["Tennis", "TableTennis", "Padel", "Badminton"],
    description: dictionary.app.description,
    sameAs: [],
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: dictionary.app.name,
    url: BASE_URL,
  };

  return (
    <LanguageProvider locale={locale} dictionary={dictionary}>
      <Script
        id="ld-org"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Script
        id="ld-website"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <YaMetrika counterId={103777315} />
      <UserProvider>
        <TournamentsProvider>
          <AppShell>{children}</AppShell>
        </TournamentsProvider>
      </UserProvider>
    </LanguageProvider>
  );
}
