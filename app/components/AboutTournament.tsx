// app/tournaments/[slug]/components/AboutTournament.tsx
"use client";

import "./AboutTournament.css";
import { useTournament } from "@/app/tournaments/[slug]/TournamentProvider";
import { UserCard } from "@/app/components/UserCard";
import { UserRole } from "../models/Users";

export function AboutTournament() {
  const { tournament, creator } = useTournament();

  const {
    organizer_name,
    organizer_phone,
    organizer_email,
    organizer_whatsapp,
    organizer_telegram,
  } = tournament as any;

  // Контакты организатора: сначала из турнира, потом fallback к creator
  const orgName = organizer_name ?? (creator?.displayName ? creator.displayName(false) : creator?.displayName) ?? "Организатор";
  //const orgRole = (creator?.role as any) ?? "tournament_admin";
  const orgPhone = organizer_phone ?? (creator as any)?.phone ?? null;
  const orgEmail = organizer_email ?? (creator as any)?.email ?? null;
  const orgWa = organizer_whatsapp ?? null; // если не указано, UserCard сам возьмёт phone
  const orgTg = organizer_telegram ?? (creator as any)?.telegram ?? null;

  if (!tournament) {
    return <div className="card about-card">Нет данных о турнире</div>;
  }

  return (
    <div className="page-content-container card-800px">
      <section className="card-grid">
        <UserCard
          fullName={orgName}
          role={UserRole.TournamentAdmin}
          phone={orgPhone}
          email={orgEmail}
          whatsapp={orgWa}
          telegram={orgTg}
          className="mt-1"
        />
      </section>

      {tournament.regulation ? (
        <div className="card about-text">
          <h3>Положение о турнире</h3>
          <p className="muted about-regulation-text">{tournament.regulation}</p>
        </div>
      ) : null}
    </div>
  );
}
