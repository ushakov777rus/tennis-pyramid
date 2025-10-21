// app/tournaments/[slug]/components/AboutTournament.tsx
"use client";

import "./AboutClub.css";
import { useClub } from "@/app/clubs/[slug]/ClubProvider";
import { UserCard } from "@/app/components/UserCard";
import { UserRole } from "../../models/Users";
import { useDictionary } from "@/app/components/LanguageProvider";

export function AboutClub() {
  const { club, director } = useClub(); // 👈 берём директора
  const { clubPage, clubs } = useDictionary();

  if (!club) {
    return <div className="card about-card">{clubPage.noData}</div>;
  }

  // Fallback'и из полей клуба (если нет пользователя-директора или контактов)
  const organizer_name = (club as any)?.organizer_name as string | undefined;
  const organizer_phone = (club as any)?.organizer_phone as string | undefined;
  const organizer_email = (club as any)?.organizer_email as string | undefined;
  const organizer_whatsapp = (club as any)?.organizer_whatsapp as string | undefined;
  const organizer_telegram = (club as any)?.organizer_telegram as string | undefined;

  const fullName = director?.name ?? organizer_name ?? clubs.directorFallback;
  const phone    = (director as any)?.player.phone ?? organizer_phone ?? undefined;
  const email    = (director as any)?.email ?? organizer_email ?? undefined;
  const whatsapp = (director as any)?.player.whatsapp ?? organizer_whatsapp ?? undefined;
  const telegram = (director as any)?.telegram ?? organizer_telegram ?? undefined;

  // Если в enum нет явной роли директора клуба — используем TournamentAdmin
  const role = (UserRole as any).ClubDirector ?? UserRole.TournamentAdmin;

  return (
    <div className="page-content-container card-800px">
      <section className="card-grid">
        <UserCard
          fullName={fullName}
          role={role}
          phone={phone}
          email={email}
          whatsapp={whatsapp}
          telegram={telegram}
        />
      </section>

      {/* остальной контент AboutTournament — без изменений */}
    </div>
  );
}
