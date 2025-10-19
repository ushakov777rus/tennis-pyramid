"use client";

import Link from "next/link";
import { StatsFooter } from "./components/StatsFooter";
import { useDictionary, useLanguage } from "./components/LanguageProvider";
import { withLocalePath } from "./i18n/routing";

export default function HomePage() {
  const { locale } = useLanguage();
  const dictionary = useDictionary();

  return (
    <div
      className="page-container-no-padding" 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100dvh', // Используем dvh вместо vh для мобильных устройств
        width: '100%',
        
      }}
    >
      <Link
        href={withLocalePath(locale, "/freetournament")}
        className="btn-base floating-cta"
        aria-label={dictionary.landing.fastTournamentAria}
        style={{
          fontSize: '1.5rem',
          padding: '1rem 2rem',
          textDecoration: 'none',
          
          zIndex: 2
        }}
      >
        {dictionary.landing.fastTournamentCta}
      </Link>

      <StatsFooter />
    </div>
  );
}