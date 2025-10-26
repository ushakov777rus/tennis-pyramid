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
        display: 'flex', // Меняем grid на flex
        flexDirection: 'column', // Вертикальное расположение
        justifyContent: 'center', // Центрирование по вертикали
        alignItems: 'center', // Центрирование по горизонтали
        height: '100dvh',
        width: '100%',
        gap: '2rem', // Добавляем отступ между элементами
      }}
    >
      <h1 style={{ 
        margin: 0, // Убираем стандартные отступы h1
        textAlign: 'center'
      }}>{dictionary.landing.title}</h1>
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