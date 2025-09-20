// app/layout.tsx
import "./colors.css";
import "./globals.css";
import "./cards.css";
import "./tables.css";
import "./app-shell.css"; // 👈 добавим стили оболочки

import { UserProvider } from "./components/UserContext";
import Script from "next/script";

import type { Metadata } from "next";
import { TournamentsProvider } from "./tournaments/TournamentsProvider";
import { NavigationBar } from "./components/NavigationBar";
import { SideNavigationBar } from "./components/controls/SideNavigationBar"; 

export const metadata: Metadata = {
  metadataBase: new URL("https://honeycup.ru"),
  title: {
    default:
      "HoneyCup — генератор турнирной сетки онлайн и любительские теннисные турниры",
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
    "система управления теннисным клубом",
    "теннис турнирная сетка",
  ],
  alternates: {
    canonical: "/",
    languages: { ru: "https://honeycup.ru/" },
  },
  openGraph: {
    type: "website",
    url: "https://honeycup.ru",
    title:
      "HoneyCup — генератор турнирной сетки онлайн и любительские теннисные турниры",
    description:
      "Создавайте и проводите любительские теннисные турниры: сетки, таблицы, расписания, статистика, рейтинги и онлайн-табло.",
    siteName: "HoneyCup",
    images: [
      { url: "/og-default.png", width: 1200, height: 630, alt: "HoneyCup — турнирная платформа для тенниса" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HoneyCup — турниры по теннису и генератор сетки онлайн",
    description:
      "Генератор турнирной сетки онлайн (бесплатно), организация турниров, рейтинги и статистика.",
    images: ["/og-default.png"],
  },
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
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "HoneyCup",
    url: "https://honeycup.ru",
    logo: "https://honeycup.ru/icon-180x180.png?v=2", // ← обновили URL с версией
    sport: ["Tennis", "TableTennis", "Padel", "Badminton"],
    description:
      "Платформа для организации любительских турниров и генератор турнирной сетки онлайн.",
    sameAs: [],
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HoneyCup",
    url: "https://honeycup.ru",
  };

  return (
    <html lang="ru">
      <head>
        <Script id="ld-org" type="application/ld+json" strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Script id="ld-website" type="application/ld+json" strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }} />

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
              ym(103777315, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
            `,
          }}
        />
        <noscript>{/* пусто */}</noscript>
      </head>
      <body>
        <UserProvider>
            <TournamentsProvider>
              <NavigationBar />

              {/* APP SHELL: sidebar + main */}
              <div className="app-shell">
                <SideNavigationBar />

                <main id="app-main" className="app-main">
                  {children}
                </main>
              </div>
            </TournamentsProvider>
        </UserProvider>

      </body>
    </html>
  );
}
