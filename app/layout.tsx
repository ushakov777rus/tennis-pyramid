// app/layout.tsx
import "./globals.css";
import { UserProvider } from "./components/UserContext";
import Script from "next/script";

import type { Metadata } from "next";
import { TournamentsProvider } from "./tournaments/TournamentsProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://honeycup.ru"),
  title: {
    default: "HoneyCup — генератор турнирной сетки онлайн и любительские теннисные турниры",
    template: "%s — HoneyCup",
  },
  description:
    "Турнирная платформа для большого тенниса: генератор турнирной сетки онлайн (бесплатно), организация турниров, результаты, рейтинги, статистика и история матчей.",
  keywords: [
    "генератор турнирной сетки онлайн бесплатно",
    "генератор турнирных сеток и таблиц онлайн",
    "любительские теннисные турниры",
    "сделать турнирную сетку онлайн",
    "создание турнирной сетки онлайн",
    "создать турнирную сетку онлайн бесплатно",
    "составить турнирную сетку онлайн",
    "составление турнирной сетки онлайн",
    "теннис онлайн турнирная сетка",
    "турнирная сетка онлайн",
    "турнирная сетка онлайн бесплатно",
    "турнирная сетка онлайн генератор",
    "организация турниров по теннису онлайн",
    "турнирная платформа для тенниса",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "ru": "https://honeycup.ru/",
    },
  },
  openGraph: {
    type: "website",
    url: "https://honeycup.ru",
    title:
      "HoneyCup — генератор турнирной сетки онлайн и любительские теннисные турниры",
    description:
      "Создавайте и проводите любительские теннисные турниры: сетки, таблицы, расписания, статистика, рейтинги и онлайн-табло.",
    siteName: "HoneyCup",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "HoneyCup — турнирная платформа для тенниса" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HoneyCup — турниры по теннису и генератор сетки онлайн",
    description:
      "Генератор турнирной сетки онлайн (бесплатно), организация турниров, рейтинги и статистика.",
    images: ["/og-default.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "name": "HoneyCup",
    "url": "https://honeycup.ru",
    "logo": "https://honeycup.ru/apple-icon.png",
    "sport": ["Tennis", "TableTennis", "Padel", "Badminton"],
    "description":
      "Платформа для организации любительских турниров и генератор турнирной сетки онлайн.",
    "sameAs": [
      // добавь свои соцсети при наличии
    ],
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "HoneyCup",
    "url": "https://honeycup.ru",
    // Если есть страница поиска — раскомментируй блок ниже и замени URL
    // "potentialAction": {
    //   "@type": "SearchAction",
    //   "target": "https://honeycup.ru/search?q={query}",
    //   "query-input": "required name=query"
    // }
  };

  return (
    <html lang="ru">
      <head>
        {/* JSON-LD: Organization */}
        <Script
          id="ld-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {/* JSON-LD: WebSite */}
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />

        {/* Вставка счётчика Яндекс.Метрики */}
        <Script
          id="ym-tag"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){
              (m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              k=e.createElement(t),a=e.getElementsByTagName(t)[0];
              k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
              ym(103777315, "init", {
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true,
                  webvisor:true
              });
            `,
          }}
        />
        <noscript>
          {/* Носкрипт для Метрики (рекомендуется оставить пустым или с пикселем) */}
        </noscript>
      </head>
      <body>
        <UserProvider>
          <TournamentsProvider>{children}</TournamentsProvider>
        </UserProvider>
      </body>
    </html>
  );
}