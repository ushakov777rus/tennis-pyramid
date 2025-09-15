"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation"; // Добавьте этот импорт

import { useClub } from "./ClubProvider";
import { ClubCard } from "../ClubCard";

import { ScrollableTabs, TabItem } from "@/app/components/controls/ScrollableTabs";
import { AboutClub } from "@/app/clubs/[slug]/AboutClub";
import { ClubParticipantsView } from "@/app/components/ParticipantsView"; // Исправил импорт
import { TournamentsProvider } from "@/app/tournaments/TournamentsProvider";
import { TournamentsClient } from "@/app/tournaments/TournamentsClient";
import { AdminOnly } from "@/app/components/RoleGuard";
import { PlayerListView } from "@/app/rating/PlayerListView";
import { useUser } from "@/app/components/UserContext";
import { UserRole } from "@/app/models/Users";
import { SimpleBreadcrumbs } from "@/app/components/BreadCrumbs";

type ViewKey = "aboutc" | "participants" | "tournaments" | "rating";

export default function ClubClient() {
  const { user } = useUser();
  const { club } = useClub();
  const searchParams = useSearchParams(); // Добавьте это

  const [view, setView] = useState<ViewKey>("aboutc");

  const tabs: TabItem[] = useMemo(
    () => [
      { key: "aboutc", label: "О клубе" },
      (user?.role === UserRole.SiteAdmin || user?.role === UserRole.TournamentAdmin) && 
        { key: "participants", label: "Участники" },
      { key: "tournaments", label: "Турниры" },
      { key: "rating", label: "Рейтинг" },
    ].filter(Boolean) as TabItem[],
    [user?.role]
  );

  // Синхронизация с URL параметром tab
  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (urlTab && tabs.some(tab => tab.key === urlTab)) {
      setView(urlTab as ViewKey);
    }
  }, [searchParams, tabs]);

  if (!club) return <p>Загрузка...</p>;

  const className = user ? "page-container-no-padding" : "page-container";

  return (
    <div className={className}>
      <SimpleBreadcrumbs clubName={club.name} />

      <div className="page-content-container">
        {/* Карточка клуба */}
        <div className="card-grid">
          <ClubCard club={club} displayName={false}/>
        </div>

        {/* Вкладки */}
        <div>
          <ScrollableTabs
            items={tabs}
            value={view}
            onChange={(k) => setView(k as ViewKey)}
            ariaLabel="Разделы клуба"
          />

          <div>
            {view === "aboutc" && <AboutClub />}
            <AdminOnly>
              {view === "participants" && <ClubParticipantsView />}
            </AdminOnly>
            {view === "tournaments" && 
              <TournamentsProvider clubId={club.id}>
                <TournamentsClient clubId={club.id}/>
              </TournamentsProvider>
            }
            {view === "rating" && 
              <PlayerListView clubId={club.id}/>
            }
          </div>
        </div>
      </div>
    </div>
  );
}