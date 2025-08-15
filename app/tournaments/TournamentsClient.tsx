"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PlusIconButton, CancelIconButton } from "../components/IconButtons";

import {
  TournamentStatus,
  TournamentFormat,
  TournamentType,
  TYPE_OPTIONS,
  FORMAT_OPTIONS,
  STATUS_OPTIONS,
} from "@/app/models/Tournament";

import { NavigationBar } from "@/app/components/NavigationBar";
import { AdminOnly } from "@/app/components/RoleGuard";
import { TournamentCard } from "@/app/components/TournamentCard";

import { useTournaments } from "@/app/tournaments/TournamentsProvider";
import { Tournament } from "@/app/models/Tournament";

import "./page.css";
import "@/app/MainPage.css";

export function TournamentsClient() {
  const router = useRouter();
  const { tournaments, loading, error, createTournament, deleteTournament, stats } = useTournaments();

  // --- создание турнира
  const [newName, setNewName] = useState("");
  const [newFormat, setNewFormat] = useState<TournamentFormat>(TournamentFormat.Pyramid);
  const [newType, setNewType] = useState<TournamentType>(TournamentType.Single);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- фильтры
  const [q, setQ] = useState<string>("");

  type FilterType = "" | TournamentType;
  type FilterFormat = "" | TournamentFormat;
  type FilterStatus = "" | TournamentStatus;

  const [fltType, setFltType] = useState<FilterType>("");
  const [fltFormat, setFltFormat] = useState<FilterFormat>("");
  const [fltStatus, setFltStatus] = useState<FilterStatus>("");

  const onCreate = async () => {
    await createTournament({
      name: newName,
      format: newFormat,
      tournament_type: newType,
      start_date: startDate || null,
      end_date: endDate || null,
      status: TournamentStatus.Draft, // можно не указывать, если в провайдере дефолт "draft"
    });
    // Сброс формы
    setNewName("");
    setNewFormat(TournamentFormat.Pyramid);
    setStartDate("");
    setEndDate("");
    setNewType(TournamentType.Single);
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
            className="input card-input-add-tournament"
          />

          <select
            className="input card-input-add-tournament"
            value={fltType}
            onChange={(e) => setFltType(e.target.value as FilterType)}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            className="input card-input-add-tournament"
            value={fltFormat}
            onChange={(e) => setFltFormat(e.target.value as FilterFormat)}
          >
            {FORMAT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            className="input card-input-add-tournament"
            value={fltStatus}
            onChange={(e) => setFltStatus(e.target.value as FilterStatus)}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <CancelIconButton onClick={resetFilters} title="Сброс"/>

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
              onChange={(e) => setNewType(e.target.value as TournamentType)}
              className="input card-input-add-tournament"
            >
              {/* можно использовать TYPE_OPTIONS.slice(1), но здесь наглядно */}
              <option value={TournamentType.Single}>Одиночный</option>
              <option value={TournamentType.Double}>Парный</option>
            </select>

            <select
              value={newFormat}
              onChange={(e) => setNewFormat(e.target.value as TournamentFormat)}
              className="input card-input-add-tournament"
            >
              {/* для создания — без пункта "Любой формат" */}
              {FORMAT_OPTIONS.slice(1).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
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

            <PlusIconButton onClick={onCreate} title="Создать"/>

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