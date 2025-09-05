"use client";

import { useEffect, useMemo, useState } from "react";

import { UserRole } from "./models/Users";

import { NavigationBar } from "@/app/components/NavigationBar";
import { AuthContainer } from "@/app/components/AuthContainer";


import { MatchRepository } from "./repositories/MatchRepository";
import { PlayersRepository } from "./repositories/PlayersRepository";
import { TournamentsRepository } from "./repositories/TournamentsRepository";

import "./MainPage.css";

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
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [signupRole, setSignupRole] =
    useState<UserRole.Player | UserRole.TournamentAdmin>(UserRole.Player);

  const [matchesCount, setMatchesCount] = useState<number | null>(null);
  const [playersCount, setPlayersCount] = useState<number | null>(null);
  const [tournamentsCount, setTournamentsCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;

    async function loadStats() {
      try {
        const m = await MatchRepository.countAll();
        const p = await PlayersRepository.countAll()
        const t = await TournamentsRepository.countAll()

        if (!alive) return;

        setMatchesCount(m ?? 0);
        setPlayersCount(p ?? 0);
        setTournamentsCount(t ?? 0);
      } catch (e) {
        console.error("Не удалось загрузить статистику:", e);
        if (!alive) return;
        setMatchesCount((v) => v ?? 0);
        setPlayersCount((v) => v ?? 0);
        setTournamentsCount((v) => v ?? 0);
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
      { label: "КЛУБОВ", value: 0 },
    ],
    [matchesCount, playersCount, tournamentsCount]
  );

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
      <h1 className="page-title">Турнирная платформа для большого тенниса</h1>

      <main className="page-content-container">
        {/* Картинка */}
        <section className="card" style={{ padding: "0px" }}>
          <div className="tennis-hero">
            <span>Погрузись в мир большого тенниса</span>
          </div>
        </section>

        {/* Шапка/заголовок */}
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
              Honey Cup — технологическая платформа для проведения
              турниров и сбора статистики. Мы поддерживаем самые разнообразные форматы турниров,
              крупные соревнования и локальные лиги и клубы — это вовлекает больше игроков и болельщиков.
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

        <section>
          <section className="section">
            <div className="card-grid">
              <div
                className="card card-register clickable"
                onClick={() => {
                  setSignupRole(UserRole.Player);
                  setIsLoginOpen(true);
                }}
              >
                <div className="card-icon">🏅</div>
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
                }} // 👈 дергаем проп
              >
                <div className="card-icon">🏆</div>
                Зарегистрироваться как организатор
                <div className="badge badge-register">
                  Организовывай турниры, выбирай любой формат, управляй матчами и следи за результатами
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>

      <footer className="card page-footer">
        <div className="footer-section left">
          <h3>Для связи</h3>
          <p>
            <a href="mailto:honey.cup@yandex.ru">honey.cup@yandex.ru</a>
          </p>
        </div>
        <div className="footer-section right">
          <h3>© {new Date().getFullYear()} HoneyCup</h3>
          <p>Все права защищены</p>
        </div>
      </footer>

      <AuthContainer
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        initialMode="register"
        initialRole={signupRole}
      />
    </div>
  );
}