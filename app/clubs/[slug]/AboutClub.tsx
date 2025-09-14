// app/tournaments/[slug]/components/AboutTournament.tsx
"use client";

import { useMemo } from "react";
import "./AboutTournament.css";
import { useClub } from "@/app/clubs/[slug]/ClubProvider";
import { UserCard } from "@/app/components/UserCard";
import { UserRole } from "../../models/Users";

function formatDate(d?: string | null) { /* как у тебя */ }
function formatDateRange(start?: string | null, end?: string | null) { /* как у тебя */ }

export function AboutClub() {
  const { club } = useClub();

  const {
    venue, city, surface, fee,
    format, tournament_type, categories, tags,
    organizer_name, organizer_phone, organizer_email, organizer_whatsapp, organizer_telegram,
  } = club as any;


  const chips = useMemo(() => {
    const arr: string[] = [];
    if (format) arr.push(String(format));
    if (tournament_type) arr.push(String(tournament_type));
    if (surface) arr.push(String(surface));
    if (Array.isArray(categories)) arr.push(...categories);
    if (Array.isArray(tags)) arr.push(...tags);
    return arr.slice(0, 12);
  }, [format, tournament_type, surface, categories, tags]);

  if (!club) {
    return <div className="card about-card">Нет данных о турнире</div>;
  }

  return (
    <div className="page-content-container">
      {/* Инфо-грид */}
      <section className="card-grid">
          <UserCard
            fullName={"ФИО"}
            role={UserRole.TournamentAdmin}
            phone={"Телефон"}
            email={"Почта"}
            whatsapp={"WA"}
            telegram={"TG"}
          />
      </section>

      {/* остальной контент AboutTournament — без изменений */}
    </div>
  );
}