"use client";

import React, { useMemo, useState } from "react";

import { useClub } from "./ClubProvider";
import { ClubCard } from "../ClubCard";

import { ScrollableTabs, TabItem } from "@/app/components/controls/ScrollableTabs";
import { AboutClub } from "@/app/clubs/[slug]/AboutClub";
import { ClubParticipantsView, ParticipantsView } from "@/app/components/ParticipantsView";
import { TournamentsProvider } from "@/app/tournaments/TournamentsProvider";
import { TournamentsClient } from "@/app/tournaments/TournamentsClient";
import { AdminOnly } from "@/app/components/RoleGuard";
import { PlayerListView } from "@/app/rating/PlayerListView";

type ViewKey = "about" | "participants" | "tournaments" | "rating";

export default function ClubClient() {
  const { club, reload } = useClub(); // предполагаем, что провайдер отдаёт club (+ при желании reload)

  const [view, setView] = useState<ViewKey>("about");

  const tabs: TabItem[] = useMemo(
    () => [
      { key: "about", label: "О клубе" },
      { key: "participants", label: "Участники" },
      { key: "tournaments", label: "Турниры" },
      { key: "rating", label: "Рейтинг" },
    ],
    []
  );

  if (!club) return <p>Загрузка...</p>;

  return (
    <div className="page-container">
      <h1 className="page-title">{club.name}</h1>

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
            {view === "about" && <AboutClub />}
            <AdminOnly>
              {view === "participants" && <ClubParticipantsView />}
            </AdminOnly>
            {view === "tournaments" && 
              <TournamentsProvider clubId={club.id}>
                <TournamentsClient clubId={club.id}/>
              </TournamentsProvider>
            }
            {view === "rating" && 
              <PlayerListView  clubId={club.id}/>
            }
          </div>
        </div>
      </div>
    </div>
  );
}