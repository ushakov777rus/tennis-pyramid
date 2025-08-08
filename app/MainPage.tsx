"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationBar } from "@/app/components/NavigationBar";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { Tournament } from "@/app/models/Tournament";
import { formatDate } from "@/app/components/Utils"; // если есть

import "./MainPage.css";

export default function HomePage() {
  const router = useRouter();
  const [ongoing, setOngoing] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {

        const list = await TournamentsRepository.loadAll(); // <- готовый метод
        setOngoing(list.slice(0, 3));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page-container">
      <NavigationBar />
      <h1 className="page-title">Теннисные турниры</h1>

      <main className="main">
        <section className="section">
          <h2 className="section-title">Ближайшие турниры</h2>

          <div className="card-grid">
            {loading && [1,2,3].map(i => (
              <div className="card card-250px" key={`s-${i}`}>Загрузка…</div>
            ))}

            {!loading && ongoing.map(t => (
              <div className="card card-250px" key={t.id}>
                <div className="tournament-status">  
                  <span
                    className={`status ${
                      t.status === "finished"
                        ? "finished"
                        : t.status === "ongoing"
                        ? "ongoing"
                        : "draft"
                    }`}
                  >
                    { t.getStatus() }
                  </span>
                </div>
                <div className="card-icon">🏆</div>                
                <div className="card-date">
                  {t.name}
                </div>
                <div className="card-date">
                  {t.start_date ? `${formatDate(new Date(t.start_date))} — ${t.end_date ? formatDate(new Date(t.end_date)) : "…"}` : `${t.start_date ?? ""}`}
                </div>
                <button
                  className="card-btn card-btn-act"
                  onClick={() => router.push(`/tournaments/${t.id}`)}
                >
                  Подробнее
                </button>
              </div>
            ))}

            {!loading && ongoing.length === 0 && (
              <div className="card card-250px">Сейчас турниров нет</div>
            )}

            <div className="card card-80px card-all" onClick={() => router.push("/tournaments")}>
              Все
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Ближайшие матчи</h2>
          <div className="card-grid">
            {[1, 2, 3].map((i) => (
              <div className="card card-250px" key={i}>
                <div className="card-icon">🎾 + 🎾</div>
                <div className="card-date">MM/DD 00:00</div>
                <button className="card-btn card-btn-act">Подробнее</button>
              </div>
            ))}
            <div className="card card-80px card-all" onClick={() => router.push("/matches")}>
              Все
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Топ игроков</h2>
          <div className="card-grid">
            {[1, 2, 3].map((i) => (
              <div className="card card-250px" key={i}>
                <div className="card-avatar">🏅</div>
                <div className="card-name">Player Nickname</div>
                <button className="card-btn card-btn-act">Подробнее</button>
              </div>
            ))}
            <div className="card card-80px card-all" onClick={() => router.push("/rating")}>
              Все
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}