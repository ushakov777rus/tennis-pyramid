"use client";

import { useEffect, useMemo, useState } from "react";

import { UserRole } from "@/app/models/Users";

import { AuthContainer } from "@/app/components/AuthContainer";

import { MatchRepository } from "@/app/repositories/MatchRepository";
import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";

import Script from "next/script";
import "./MainPage.css";
import { ClubsRepository } from "@/app/repositories/ClubsRepository";
import { useUser } from "@/app/components/UserContext";
import { Footer } from "@/app/Footer";
import Link from "next/link";
import { useDictionary, useLanguage } from "@/app/components/LanguageProvider";
import { withLocalePath } from "@/app/i18n/routing";

type Stat = { label: string; value: number | string; link: string };
type Feature = { icon: React.ReactNode; label: string; text?: string };

/* ===========================
   SVG 24x24, цвет #CFA
   =========================== */
function IconBase({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="#A6FF00">{children}</g>
    </svg>
  );
}

/** Медаль — для "участника" */
function IconMedal() {
  return (
    <IconBase>
      {/* ленточки */}
      <path d="M7 2h4l1 3 1-3h4l-4 6h-2L7 2Z" />
      {/* круг медали */}
      <circle cx="12" cy="15" r="5" />
      {/* звезда внутри */}
      <path d="M12 12.8l.95 1.93 2.13.31-1.54 1.5.36 2.12L12 17.8l-1.9 1 .36-2.12-1.54-1.5 2.13-.31L12 12.8Z" />
    </IconBase>
  );
}

/** Кубок — для "организатора" */
function IconTrophy() {
  return (
    <IconBase>
      {/* чаша кубка */}
      <path d="M7 4h10v2a5 5 0 0 1-10 0V4Z" />
      {/* ручки */}
      <path d="M4 6h3v1a3 3 0 0 1-3-3v2Zm16 0h-3v1a3 3 0 0 0 3-3v2Z" />
      {/* ножка и подставка */}
      <rect x="10" y="12" width="4" height="3" rx="0.5" />
      <rect x="8" y="16" width="8" height="2" rx="0.5" />
      <rect x="9" y="19" width="6" height="2" rx="0.5" />
    </IconBase>
  );
}

const IconCalendar = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 2v2M17 2v2M3 9h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
  </svg>
);
const IconResult = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 7l-9 10L3 12" />
  </svg>
);
const IconChart = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 20h16M7 16v-6M12 20V8M17 20v-9" />
  </svg>
);
const IconBoard = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="M3 10h18M9 4v14" />
  </svg>
);
const IconNews = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 19a2 2 0 0 1-2-2V6h16v11a2 2 0 0 1-2 2H4z" />
    <path d="M22 7v10a2 2 0 0 1-2 2h-2" />
    <path d="M8 8h6M8 12h8M8 16h5" />
  </svg>
);
const IconUser = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z" />
    <path d="M3 22a9 9 0 0 1 18 0" />
  </svg>
);

const FEATURE_ICONS = [IconCalendar, IconResult, IconChart, IconBoard, IconNews, IconUser];

export default function AboutPage() {
  const { user } = useUser();
  const { locale } = useLanguage();
  const dictionary = useDictionary();
  const pageDict = dictionary.aboutPage;
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [signupRole, setSignupRole] =
    useState<UserRole.Player | UserRole.TournamentAdmin>(UserRole.Player);

  const [matchesCount, setMatchesCount] = useState<number | null>(null);
  const [playersCount, setPlayersCount] = useState<number | null>(null);
  const [tournamentsCount, setTournamentsCount] = useState<number | null>(null);
  const [clubsCount, setClubsCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;

    async function loadStats() {
      try {
        const m = await MatchRepository.countAll();
        const p = await PlayersRepository.countAll();
        const t = await TournamentsRepository.countAll();
        const c = await ClubsRepository.countAll();

        if (!alive) return;

        setMatchesCount(m ?? 0);
        setPlayersCount(p ?? 0);
        setTournamentsCount(t ?? 0);
        setClubsCount(c ?? 0);
      } catch (e) {
        console.error("Не удалось загрузить статистику:", e);
        if (!alive) return;
        setMatchesCount((v) => v ?? 0);
        setPlayersCount((v) => v ?? 0);
        setTournamentsCount((v) => v ?? 0);
        setClubsCount((v) => v ?? 0);
      }
    }

    loadStats();
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo<Stat[]>(() => {
    const values: Record<"matches" | "players" | "tournaments" | "clubs", number | string> = {
      matches: matchesCount ?? "…",
      players: playersCount ?? "…",
      tournaments: tournamentsCount ?? "…",
      clubs: clubsCount ?? "…",
    };

    return pageDict.stats.map((stat) => ({
      label: stat.label,
      value: values[stat.key],
      link: stat.localized ? withLocalePath(locale, stat.link) : stat.link,
    }));
  }, [pageDict.stats, matchesCount, playersCount, tournamentsCount, clubsCount, locale]);

  const features: Feature[] = useMemo(
    () =>
      FEATURE_ICONS.map((icon, index) => ({
        icon,
        label: pageDict.features[index] ?? "",
      })),
    [pageDict.features]
  );

  const faqJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: pageDict.faq.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    }),
    [pageDict.faq.items]
  );

  return (
    <div className="about-page">
      <Script
        id="about-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="about__hero card">
        <div className="about__hero-text">
          <h1>{pageDict.hero.title}</h1>
          <p>{pageDict.hero.description}</p>

          <div className="about__cta">
            <button
              className="btn-base"
              onClick={() => {
                setSignupRole(UserRole.Player);
                setIsLoginOpen(true);
              }}
            >
              {pageDict.hero.ctaPlayer}
            </button>
            <button
              className="btn-base btn-secondary"
              onClick={() => {
                setSignupRole(UserRole.TournamentAdmin);
                setIsLoginOpen(true);
              }}
            >
              {pageDict.hero.ctaOrganizer}
            </button>
          </div>
        </div>

        <div className="about__hero-stats">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.link} className="about__stat-card">
              <div className="about__stat-value">{stat.value}</div>
              <div className="about__stat-label">{stat.label}</div>
            </Link>
          ))}
        </div>
      </header>

      <main className="about__content">
        <section className="section card">
          <div className="card-grid">
            <div className="card">
              <h2>{pageDict.intro.title}</h2>
              <p>{pageDict.intro.paragraph}</p>
              <ul className="bullet-list">
                {pageDict.intro.bullets.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div
              className="card"
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                padding: "20px",
              }}
            >
              <p>{pageDict.intro.aside}</p>
            </div>
          </div>
        </section>

        <section className="about__features card">
          {features.map((feature, index) => (
            <div key={`${feature.label}-${index}`} className="about__feature">
              <div className="about__icon" aria-hidden="true">
                {feature.icon}
              </div>
              <div className="about__featureLabel">{feature.label}</div>
            </div>
          ))}
        </section>

        <section className="section card" id="generator">
          <h2>{pageDict.generator.title}</h2>
          <p>{pageDict.generator.paragraph}</p>
          <ul className="bullet-list">
            {pageDict.generator.bullets.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>

        <section className="section card" id="tennis-platform">
          <h2>{pageDict.tennis.title}</h2>
          <p>{pageDict.tennis.paragraph}</p>
          <ul className="bullet-list">
            {pageDict.tennis.bullets.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>

        <section>
          <div className="card-grid-cta">
            <div
              className="card card-register clickable"
              onClick={() => {
                setSignupRole(UserRole.Player);
                setIsLoginOpen(true);
              }}
            >
              <div className="card-icon" aria-hidden="true">
                <IconMedal />
              </div>
              {pageDict.ctaCards.playerTitle}
              <div className="badge badge-register">{pageDict.ctaCards.playerBadge}</div>
            </div>

            <div
              className="card card-register clickable"
              onClick={() => {
                setSignupRole(UserRole.TournamentAdmin);
                setIsLoginOpen(true);
              }}
            >
              <div className="card-icon" aria-hidden="true">
                <IconTrophy />
              </div>
              {pageDict.ctaCards.organizerTitle}
              <div className="badge badge-register">{pageDict.ctaCards.organizerBadge}</div>
            </div>
          </div>
        </section>

        <section className="section card" id="faq">
          <h2>{pageDict.faq.title}</h2>
          {pageDict.faq.items.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </section>

        <Footer />
      </main>

      <AuthContainer
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        initialMode="register"
        initialRole={signupRole}
      />
    </div>
  );
}
