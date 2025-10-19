import Script from "next/script";

import { LanguageProvider } from "@/app/components/LanguageProvider";
import { UserProvider } from "@/app/components/UserContext";
import { TournamentsProvider } from "@/app/tournaments/TournamentsProvider";
import { AppShell } from "@/app/components/AppShell";
import { getDictionary } from "@/app/i18n/dictionaries";
import { resolveServerLocale } from "@/app/i18n/locale-server";

const BASE_URL = "https://honeycup.ru";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const locale = await resolveServerLocale();
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
      <Script
        id="ym-tag-admin"
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
      <UserProvider>
        <TournamentsProvider>
          <AppShell>{children}</AppShell>
        </TournamentsProvider>
      </UserProvider>
    </LanguageProvider>
  );
}
