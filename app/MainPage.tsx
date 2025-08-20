"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationBar } from "@/app/components/NavigationBar";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { Tournament } from "@/app/models/Tournament";
import { formatDate } from "@/app/components/Utils"; // если есть

import "./MainPage.css";
import { useUser } from "./components/UserContext";
import { GuestMainPageCard } from "./components/GuestMainPageCard";
import { AuthContainer } from "./components/AuthContainer";

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();
  const [ongoing, setOngoing] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [signupRole, setSignupRole] = useState<"player" | "tournament_admin">("player"); 

  const isGuest = !user;

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

      <main className="page-content-container">
        <section className="section">
          <h2 className="section-title">Ближайшие турниры</h2>

          <div className="card-grid">
            {loading && [1,2,3].map(i => (
              <div className="card card-250px" key={`s-${i}`}>Загрузка…</div>
            ))}

            {!loading && ongoing.map(t => (
              <div className="card card-250px card-with-status" key={t.id}>
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

        
        {isGuest && (
          <section className="section">
            <GuestMainPageCard
              onSignupPlayer={() => {              // 👇 клик по «участник»
                setSignupRole("player");
                setIsLoginOpen(true);
              }}
              onSignupAdmin={() => {               // 👇 клик по «организатор»
                setSignupRole("tournament_admin");
                setIsLoginOpen(true);
              }}
            />
          </section>
        )}
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