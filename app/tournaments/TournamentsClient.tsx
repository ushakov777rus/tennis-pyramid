"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { NavigationBar } from "@/app/components/NavigationBar";
import { AdminOnly } from "@/app/components/RoleGuard";
import { TournamentCard } from "@/app/components/TournamentCard";

import { useTournaments } from "@/app/tournaments/TournamentsProvider";
import { Tournament } from "@/app/models/Tournament";

import "./page.css";
import "@/app/MainPage.css";

const FORMAT_OPTIONS = [
  { value: "", label: "Любой формат" },
  { value: "pyramid", label: "Пирамида" },
  { value: "round_robin", label: "Круговой" },
  { value: "single_elimination", label: "Олимпийка" },
  { value: "double_elimination", label: "Двойная олим." },
  { value: "groups_playoff", label: "Группы + плей-офф" },
  { value: "swiss", label: "Швейцарка" },
] as const;

const TYPE_OPTIONS = [
  { value: "", label: "Любой тип" },
  { value: "single", label: "Одиночный" },
  { value: "double", label: "Парный" },
] as const;

const STATUS_OPTIONS = [
  { value: "", label: "Любой статус" },
  { value: "draft", label: "Черновик" },
  { value: "ongoing", label: "Идёт" },
  { value: "finished", label: "Завершён" },
] as const;

export function TournamentsClient() {
  const router = useRouter();
  const { tournaments, loading, error, createTournament, deleteTournament, stats } = useTournaments();

  // --- создание турнира
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"single" | "double">("single");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- фильтры
  const [q, setQ] = useState<string>("");
  const [fltType, setFltType] = useState<"" | "single" | "double">("");
  const [fltFormat, setFltFormat] = useState<
    "" | "pyramid" | "round_robin" | "single_elimination" | "double_elimination" | "groups_playoff" | "swiss"
  >("");
  const [fltStatus, setFltStatus] = useState<"" | "draft" | "ongoing" | "finished">("");

  const onCreate = async () => {
    await createTournament({
      name: newName,
      format: "pyramid", // TODO: выбрать из UI при необходимости
      tournament_type: newType,
      start_date: startDate || null,
      end_date: endDate || null,
      status: "draft",
    });
    setNewName(""); setStartDate(""); setEndDate(""); setNewType("single");
  };

  const onDelete = async (id: number) => {
    if (!confirm("Удалить турнир и все его матчи?")) return;
    await deleteTournament(id);
  };

  const resetFilters = () => {
    setQ("");
    setFltType("");
    setFltFormat("");
    setFltStatus("");
  };

  // --- применяем фильтры
  const filtered = useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    return tournaments.filter((t) => {
      if (qNorm && !t.name.toLowerCase().includes(qNorm)) return false;
      if (fltType && t.tournament_type !== fltType) return false;
      if (fltFormat && t.format !== fltFormat) return false;
      if (fltStatus && t.status !== fltStatus) return false;
      return true;
    });
  }, [tournaments, q, fltType, fltFormat, fltStatus]);

  return (
    <div className="page-container">
      <NavigationBar />

      <h1 className="page-title">Турниры</h1>

      <div className="page-content-container">
        {/* Панель фильтров */}
        <div className="card">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск по названию…"
            className="input  card-input-add-tournament"
          />

          <select className="input card-input-add-tournament" value={fltType} onChange={(e) => setFltType(e.target.value as any)}>
            {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select className="input card-input-add-tournament" value={fltFormat} onChange={(e) => setFltFormat(e.target.value as any)}>
            {FORMAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select className="input card-input-add-tournament" value={fltStatus} onChange={(e) => setFltStatus(e.target.value as any)}>
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <button className="card-btn card-btn-act" onClick={resetFilters}>Сброс</button>
        </div>

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
          {filtered.map((t: Tournament) => (
            <TournamentCard
              key={t.id}
              tournament={t}
              participantsCount={stats[t.id]?.participants ?? 0}
              matchesCount={stats[t.id]?.matches ?? 0}
              onClick={() => router.push(`/tournaments/${t.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}