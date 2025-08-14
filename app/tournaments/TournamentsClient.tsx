"use client";

import { useRouter } from "next/navigation";

import { NavigationBar } from "@/app/components/NavigationBar";
import { AdminOnly } from "@/app/components/RoleGuard";
import { TournamentCard } from "@/app/components/TournamentCard";

import { useTournaments } from "@/app/tournaments/TournamentsProvider";
import { useState } from "react";
import { Tournament } from "@/app/models/Tournament";

import "./page.css";
import "@/app/MainPage.css";

export function TournamentsClient() {
  const router = useRouter();

  const { tournaments, loading, error, createTournament, deleteTournament, stats } = useTournaments();

  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"single" | "double">("single");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const onCreate = async () => {
    await createTournament({
      name: newName,
      format: "pyramid", // ДОДЕЛАТЬ
      tournament_type: newType,
      start_date: startDate || null,
      end_date: endDate || null,
      status: "draft",
    });
    setNewName("");
    setStartDate("");
    setEndDate("");
    setNewType("single");
  };

  const onDelete = async (id: number) => {
    if (!confirm("Удалить турнир и все его матчи?")) return;
    await deleteTournament(id);
  };

  return (
    <div className="page-container">
      <NavigationBar />

      <h1 className="page-title">Турниры</h1>

      <div className="page-content-container">
        {/* Создание турнира */}
        <AdminOnly>
          <div className="card">
            <input
              type="text"
              placeholder="Название турнира"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="input card-input-add-tournament"
            />

            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as "single" | "double")}
              className="input card-input-add-tournament"
            >
              <option value="single">Одиночный</option>
              <option value="double">Парный</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input card-input-add-tournament"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input card-input-add-tournament"
            />

            <button onClick={onCreate} className="card-btn card-btn-act">Создать</button>
          </div>
        </AdminOnly>

        {/* Список турниров */}
        {loading && <div className="card">Загрузка…</div>}
        {error && <div className="card card-error">Ошибка: {error}</div>}

        <div className="tournaments-grid">
            {tournaments.map((t: Tournament) => (
            <TournamentCard
                key={t.id} // 👈 уникальный ключ
                tournament={t}
                participantsCount={stats[t.id]?.participants ?? 0}
                matchesCount={stats[t.id]?.matches ?? 0}
                onClick={() => router.push(`/tournaments/${t.id}`)} // 👈 передаем клик
            />
            ))}
        </div>
      </div>
    </div>
  );
}