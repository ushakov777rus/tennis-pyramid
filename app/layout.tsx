// app/layout.tsx
import "./globals.css";
import { UserProvider } from "./components/UserContext";
import Script from "next/script";

import type { Metadata } from "next";
import { TournamentsProvider } from "./tournaments/TournamentsProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://honeycup.ru"),
  title: {
    default: "HoneyCup — Любительские теннисные турниры",
    template: "%s — HoneyCup",
  },
  description: "Организуйте и участвуйте в любительских теннисных турнирах формата пирамида. Рейтинг игроков, сетки, расписание и результаты.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://honeycup.ru",
    title: "HoneyCup — Любительские теннисные турниры",
    description: "Пирамида, рейтинги, матчи.",
    siteName: "HoneyCup",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HoneyCup",
    description: "Любительские теннисные турниры",
    images: ["/og-default.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
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
      </head>
      <body>
        <UserProvider>
          <TournamentsProvider>
            {children}
          </TournamentsProvider>
        </UserProvider>
      </body>
    </html>
  );
}