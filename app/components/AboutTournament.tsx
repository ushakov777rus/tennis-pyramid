// app/tournaments/[slug]/components/AboutTournament.tsx
"use client";

import { useMemo } from "react";
import "./AboutTournament.css";
import { useTournament } from "@/app/tournaments/[slug]/TournamentProvider";
import { UserCard } from "@/app/components/UserCard";
import { UserRole } from "../models/Users";

function formatDate(d?: string | null) { /* как у тебя */ }
function formatDateRange(start?: string | null, end?: string | null) { /* как у тебя */ }

export function AboutTournament() {
  const { tournament, creator } = useTournament();

  if (!tournament) {
    return <div className="card about-card">Нет данных о турнире</div>;
  }

  const {
    venue, city, surface, fee,
    format, tournament_type, categories, tags,
    organizer_name, organizer_phone, organizer_email, organizer_whatsapp, organizer_telegram,
  } = tournament as any;

  // Контакты организатора: сначала из турнира, потом fallback к creator
  const orgName = organizer_name ?? (creator?.displayName ? creator.displayName(false) : creator?.displayName) ?? "Организатор";
  //const orgRole = (creator?.role as any) ?? "tournament_admin";
  const orgPhone = organizer_phone ?? (creator as any)?.phone ?? null;
  const orgEmail = organizer_email ?? (creator as any)?.email ?? null;
  const orgWa = organizer_whatsapp ?? null; // если не указано, UserCard сам возьмёт phone
  const orgTg = organizer_telegram ?? (creator as any)?.telegram ?? null;

  const chips = useMemo(() => {
    const arr: string[] = [];
    if (format) arr.push(String(format));
    if (tournament_type) arr.push(String(tournament_type));
    if (surface) arr.push(String(surface));
    if (Array.isArray(categories)) arr.push(...categories);
    if (Array.isArray(tags)) arr.push(...tags);
    return arr.slice(0, 12);
  }, [format, tournament_type, surface, categories, tags]);

  return (
    <div className="about-root">
      {/* Инфо-грид */}
      <section className="card about-grid">
        <div className="info-item">
          <UserCard
            fullName={orgName}
            role={UserRole.TournamentAdmin}
            phone={orgPhone}
            email={orgEmail}
            whatsapp={orgWa}
            telegram={orgTg}
            className="mt-1"
          />
        </div>

        <div className="info-item">
          <div className="info-k">Взнос</div>
          <div className="info-v">{fee != null ? `${fee} ₽` : "—"}</div>
        </div>
      </section>

      {/* остальной контент AboutTournament — без изменений */}
    </div>
  );
}