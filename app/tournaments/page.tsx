"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Tournament } from "@/app/models/Tournament";

import { AdminOnly } from "@/app/components/RoleGuard"
import { NavigationBar } from "@/app/components/NavigationBar";

import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";

import "./page.css";
import "@/app/MainPage.css";

export default function TournamentListView() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"single" | "double">("single");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();

  const loadTournaments = async () => {
    const list = await TournamentsRepository.loadAll();
    setTournaments(list);
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  const createTournament = async () => {
    if (!newName.trim()) return;
    await TournamentsRepository.create({
      name: newName.trim(),
      tournament_type: newType,
      start_date: startDate || null,
      end_date: endDate || null,
      status: "draft",
    });
    setNewName("");
    loadTournaments();
  };

  const deleteTournament = async (id: number) => {
    if (!confirm("Удалить турнир и все его матчи?")) return;
    await TournamentsRepository.delete(id);
    loadTournaments();
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
              className="card-input card-input-add-tournament"
            />

            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as "single" | "double")}
              className="card-input card-input-add-tournament"
            >
              <option value="single">Одиночный</option>
              <option value="double">Парный</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="card-input card-input-add-tournament"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="card-input card-input-add-tournament"
            />
          
            <button onClick={createTournament} className="card-btn card-btn-act">Создать</button>
          </div>
        </AdminOnly>
        

        {/* Список турниров в виде карточек */}
        <div className="card-grid">
          {tournaments.map((t) => (
            <div key={t.id} className="card card-250px">
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
              <div className="tournament-header">
                <h3>{t.name}</h3>
              </div>

              <div className="tournament-details">
                <p>
                  🏆 Тип:{" "}
                  {t.tournament_type === "single" ? "Одиночный" : "Парный"}
                </p>
                <p>
                  📅{" "}
                  {t.start_date
                    ? `${t.start_date} → ${t.end_date || "?"}`
                    : "Дата не назначена"}
                </p>
              </div>

              <div className="tournament-actions">
                <button className="card-btn card-btn-act" onClick={() => {
                    router.push(`/tournaments/${t.id}`);
                  }}>
                  Просмотр
                </button>
                <AdminOnly>
                  <button
                    className="card-btn card-btn-del"
                    onClick={() => deleteTournament(t.id)}
                  >
                    Удалить
                  </button>
                </AdminOnly>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}