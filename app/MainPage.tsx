"use client";

import { useEffect, useMemo, useState } from "react";

import { UserRole } from "./models/Users";

import { AuthContainer } from "@/app/components/AuthContainer";

import { MatchRepository } from "./repositories/MatchRepository";
import { PlayersRepository } from "./repositories/PlayersRepository";
import { TournamentsRepository } from "./repositories/TournamentsRepository";

import Script from "next/script";
import "./MainPage.css";
import { ClubsRepository } from "./repositories/ClubsRepository";
import { useUser } from "./components/UserContext";
import { Footer } from "./Footer";

type Stat = { label: string; value: number | string };
type Feature = { icon: React.ReactNode; label: string; text?: string };

const IconCalendar = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 2v2M17 2v2M3 9h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>
  </svg>
);
const IconResult = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 7l-9 10L3 12"/>
  </svg>
);
const IconChart = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 20h16M7 16v-6M12 20V8M17 20v-9"/>
  </svg>
);
const IconBoard = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4" width="18" height="14" rx="2"/>
    <path d="M3 10h18M9 4v14"/>
  </svg>
);
const IconNews = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 19a2 2 0 0 1-2-2V6h16v11a2 2 0 0 1-2 2H4z"/>
    <path d="M22 7v10a2 2 0 0 1-2 2h-2"/>
    <path d="M8 8h6M8 12h8M8 16h5"/>
  </svg>
);
const IconUser = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z"/>
    <path d="M3 22a9 9 0 0 1 18 0"/>
  </svg>
);

export default function HomePage() {
  const { user } = useUser();
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

  const stats = useMemo<Stat[]>(
    () => [
      { label: "МАТЧЕЙ", value: matchesCount ?? "…" },
      { label: "УЧАСТНИКОВ", value: playersCount ?? "…" },
      { label: "ТУРНИРОВ", value: tournamentsCount ?? "…" },
      { label: "КЛУБОВ", value: clubsCount  ?? "…" },
    ],
    [matchesCount, playersCount, tournamentsCount, clubsCount]
  );

  const features: Feature[] = [
    { icon: IconCalendar, label: "РАСПИСАНИЕ" },
    { icon: IconResult,   label: "РЕЗУЛЬТАТЫ" },
    { icon: IconChart,    label: "СТАТИСТИКА" },
    { icon: IconBoard,    label: "ОНЛАЙН-ТАБЛО" },
    { icon: IconNews,     label: "НОВОСТИ И ОБЗОРЫ" },
    { icon: IconUser,     label: "ЛИЧНЫЕ КАБИНЕТЫ" },
  ];

  // JSON-LD FAQ
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Можно ли бесплатно создать турнирную сетку онлайн?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Да. В HoneyCup есть бесплатный генератор турнирной сетки онлайн для любительских соревнований."
        }
      },
      {
        "@type": "Question",
        "name": "Какие форматы турнирных сеток поддерживаются?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Круговая система, олимпийка (single elimination), пирамида и другие варианты. Поддерживается настройка под конкретные правила клуба."
        }
      },
      {
        "@type": "Question",
        "name": "Подходит ли платформа для настольного тенниса и падела?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Да. HoneyCup подходит для большого и настольного тенниса, падела и бадминтона."
        }
      }
    ]
  };

  // JSON-LD Breadcrumbs (Home)
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": "https://honeycup.ru/"
      }
    ]
  };

  const className = user ? "page-container-no-padding" : "page-container";

  return (
    <div className={className}>
      {/* JSON-LD вставляем через Script (SEO) */}
      <Script
        id="ld-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="ld-breadcrumbs"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* H1 содержит главную ключевую группу, но читабельно */}
      <h1 className="page-title">
        Платформа для проведения любительских теннисных турниров
      </h1>

      <main className="page-content-container">
        {/* Hero: изображение с alt и приоритетом (если есть /hero.png) */}
        <section className="card" style={{ padding: 0 }}>
          <div className="tennis-hero" style={{ position: "relative", width: "100%", height: "260px" }}>
            <span className="tennis-hero__title">Погрузись в мир большого тенниса</span>
          </div>
        </section>

        {/* Вступительный абзац (важно для SEO — первые 100–150 слов) */}
        <section className="about__head">
          <div className="about__grid">
            <div className="about__stats">
              {stats.map((s) => (
                <div key={s.label} className="card">
                  <div className="about__statValue">{s.value}</div>
                  <div className="about__statLabel">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ height: "100%", display: "flex", alignItems: "center", padding: "20px" }}>
              <p>
              HoneyCup — турнирная платформа для тенниса. Создавайте и ведите любительские турниры, 
              используйте генератор турнирной сетки онлайн, публикуйте расписание и результаты, 
              собирайте статистику и рейтинги, ведите историю матчей. Поддерживаем популярные форматы: 
              круговая система, олимпийка и пирамида.
              </p>
            </div>
          </div>
        </section>

        {/* Блок с фичами */}
        <section className="about__features card">
          {features.map((f) => (
            <div key={f.label} className="about__feature">
              <div className="about__icon" aria-hidden="true">{f.icon}</div>
              <div className="about__featureLabel">{f.label}</div>
            </div>
          ))}
        </section>

        {/* SEO-блоки с H2 и вкраплением твоих ключей (естественно, без переспама) */}
        <section className="section card" id="generator">
          <h2>Турнирная сетка за 2 минуты</h2>
          <p>
            Запустите турнир без рутины: наш онлайн-генератор бесплатно создаст сетку, распределит участников и подготовит схему к печати и экспорту. Работает для тенниса и других ракеточных видов спорта.
          </p>
          <ul className="bullet-list">
            <li>•	Бесплатный генератор турнирных сеток онлайн</li>
            <li>•	Быстрое составление и удобная печать</li>
            <li>•	Форматы: круговая, олимпийка (single elimination), пирамида</li>
          </ul>
        </section>

        <section className="section card" id="tennis-platform">
          <h2>Организация турниров по теннису онлайн</h2>
          <p>
            HoneyCup помогает клубам и тренерам запускать и вести любительские теннисные турниры:
            регистрация участников, сетки и таблицы, расписание, онлайн-табло, подсчёт результатов,
            статистика игроков и рейтинги.
          </p>
          <ul className="bullet-list">
            <li>•	Любительские теннисные турниры в вашем клубе</li>
            <li>•	Онлайн-табло и публикация результатов</li>
            <li>•	Статистика, рейтинги, история матчей</li>
          </ul>
        </section>

        {/* CTA блоки */}
        <section>
          <div className="card-grid-cta">
            <div
              className="card card-register clickable"
              onClick={() => {
                setSignupRole(UserRole.Player);
                setIsLoginOpen(true);
              }}
            >
              <div className="card-icon" aria-hidden="true">🏅</div>
              Зарегистрироваться как участник
              <div className="badge badge-register">
                Участвуй в турнирах, прокачивайся, побеждай, попади в рейтинг лучших
              </div>
            </div>

            <div
              className="card card-register clickable"
              onClick={() => {
                setSignupRole(UserRole.TournamentAdmin);
                setIsLoginOpen(true);
              }}
            >
              <div className="card-icon" aria-hidden="true">🏆</div>
              Зарегистрироваться как организатор
              <div className="badge badge-register">
                Организовывай турниры, выбирай любой формат, управляй матчами и следи за результатами
              </div>
            </div>
          </div>
        </section>

        {/* FAQ для расширенных сниппетов */}
        <section className="section card" id="faq">
          <h2>Частые вопросы</h2>
          <details>
            <summary>Можно ли бесплатно создать турнирную сетку онлайн?</summary>
            <p>Да. Базовый генератор турнирной сетки доступен бесплатно.</p>
          </details>
          <details>
            <summary>Какие форматы поддерживаются?</summary>
            <p>Круговая система, олимпийка (single elimination), пирамида и другие.</p>
          </details>
          <details>
            <summary>Подходит ли платформа для настольного тенниса и падела?</summary>
            <p>Да, HoneyCup подходит для большого и настольного тенниса, падела и бадминтона.</p>
          </details>
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