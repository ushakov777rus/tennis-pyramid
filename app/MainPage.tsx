"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationBar } from "@/app/components/NavigationBar";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { Tournament } from "@/app/models/Tournament";
import { formatDate } from "@/app/components/Utils"; // если есть

import "./MainPage.css";
import { useUser } from "./components/UserContext";
import { GuestMainPageCard } from "./components/GuestMainPageCard";
import { AuthContainer } from "./components/AuthContainer";
import { TournamentCard } from "./components/TournamentCard";
import { useTournaments } from "./tournaments/TournamentsProvider";
import { canViewTournament } from "./lib/permissions";

export default function HomePage() {
  const { user } = useUser();
  const { tournaments, loading: tLoading, stats } = useTournaments();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [signupRole, setSignupRole] = useState<"player" | "tournament_admin">("player"); 
  const router = useRouter();


  const isGuest = !user;

  const ongoing = useMemo(() => tournaments.slice(0, 3), [tournaments]);

  return (
    <div className="page-container">
      <NavigationBar />
      <h1 className="page-title">Теннисные турниры</h1>

      <main className="page-content-container">
        <section className="section">
          <h2 className="section-title">Ближайшие турниры</h2>

      <div className="card-grid">
        {tLoading && [1,2,3].map(i => (
          <div className="card card-250px" key={`s-${i}`}>Загрузка…</div>
        ))}

        {!tLoading && ongoing.map(t => (
   
          <TournamentCard
            key={t.id}
            tournament={t}
            participantsCount={stats[t.id]?.participants ?? 0}
            matchesCount={stats[t.id]?.matches ?? 0}
            {...(canViewTournament(user,t) ? { onClick: () => router.push(`/tournaments/${t.id}`) } : {})}
          />
        ))}

        {!tLoading && ongoing.length === 0 && (
          <div className="card card-250px">Сейчас турниров нет</div>
        )}
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