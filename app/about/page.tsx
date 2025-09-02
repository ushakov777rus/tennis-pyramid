// app/about/page.tsx
"use client";

import React from "react";
import "./about.css";
import { NavigationBar } from "../components/NavigationBar";

type Stat = { label: string; value: string };
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

export default function AboutPage() {
  const stats: Stat[] = [
    { label: "МАТЧЕЙ", value: "462" },
    { label: "УЧАСТНИКОВ", value: "195" },
    { label: "ТУРНИРОВ", value: "3" },
    { label: "КЛУБОВ", value: "0" },
  ];

  const features: Feature[] = [
    { icon: IconCalendar, label: "РАСПИСАНИЕ" },
    { icon: IconResult,   label: "РЕЗУЛЬТАТЫ" },
    { icon: IconChart,    label: "СТАТИСТИКА" },
    { icon: IconBoard,    label: "ОНЛАЙН-ТАБЛО" },
    { icon: IconNews,     label: "НОВОСТИ И ОБЗОРЫ" },
    { icon: IconUser,     label: "ЛИЧНЫЕ КАБИНЕТЫ" },
  ];

  return (
        <div className="page-container">
          <NavigationBar />
          <h1 className="page-title">О проекте</h1>
    
    <main className="page-content-container">
      {/* Шапка/заголовок */}
      <section className="about__head card">
        <div className="about__grid">
          <p className="about__lead">
            <b>Honey Cup</b> — технологическая платформа для проведения 
            турниров и сбора статистики. Мы поддерживаем самые разнообразные форматы турниров, 
            крупные соревнования и локальные лиги и клубы — это вовлекает больше игроков и болельщиков.
          </p>

          <div className="about__stats">
            {stats.map((s) => (
              <div key={s.label} className="about__stat">
                <div className="about__statValue">{s.value}</div>
                <div className="about__statLabel">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Фичи */}
      <section className="about__features card">
        {features.map((f) => (
          <div key={f.label} className="about__feature">
            <div className="about__icon">{f.icon}</div>
            <div className="about__featureLabel">{f.label}</div>
          </div>
        ))}
      </section>

      {/* Блок о миссии/соц-проектах (опционально, можешь скрыть) */}
      <section className="about__foot card">
        <p>
          Мы делаем теннис ближе: социальные инициативы, свежие обзоры,
          подробная статистика каждого турнира — всё в одном месте.
        </p>
      </section>
    </main>

    </div>
  );
}