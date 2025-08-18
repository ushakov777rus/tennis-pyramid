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
import { AdminOnly, LoggedIn } from "@/app/components/RoleGuard";
import { TournamentCard } from "@/app/components/TournamentCard";
import { useUser } from "@/app/components/UserContext";
import { AddTournamentModal } from "../components/AddTournamentModal";

import { useTournaments } from "@/app/tournaments/TournamentsProvider";
import { Tournament } from "@/app/models/Tournament";

import "./page.css";
import "@/app/MainPage.css";

export function TournamentsClient() {
  const { user } = useUser();
  const router = useRouter();
  const { tournaments, loading, error, createTournament, deleteTournament, stats } = useTournaments();

  // --- фильтры
  const [q, setQ] = useState<string>("");
  type FilterType = "" | TournamentType;
  type FilterFormat = "" | TournamentFormat;
  type FilterStatus = "" | TournamentStatus;
  const [fltType, setFltType] = useState<FilterType>("");
  const [fltFormat, setFltFormat] = useState<FilterFormat>("");
  const [fltStatus, setFltStatus] = useState<FilterStatus>("");

  const [modalOpen, setModalOpen] = useState(false);

  // 🎯 ПРИНИМАЕМ payload из модалки
  const onCreate = async (payload: {
    name: string;
    type: TournamentType;
    format: TournamentFormat;
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
  }) => {
    if (!user?.id) {
      alert("Вы должны быть авторизованы для создания турнира");
      return;
    }

    await createTournament({
      name: payload.name.trim(),
      format: payload.format,
      tournament_type: payload.type,
      start_date: payload.startDate || null,
      end_date: payload.endDate || null,
      status: TournamentStatus.Draft,
      creator_id: user.id,
    });

    setModalOpen(false);
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

          <CancelIconButton onClick={resetFilters} title="Сброс" />
        </div>

        {/* Список турниров */}
        {loading && <div className="card">Загрузка…</div>}
        {error && <div className="card card-error">Ошибка: {error}</div>}

        <div className="tournaments-grid">
          {/* Карточка создания турниров — только для админов */}
          <AdminOnly>
            <TournamentCard
              key={0}
              tournament={null}
              participantsCount={0}
              matchesCount={0}
              onClick={() => setModalOpen(true)}
            />
          </AdminOnly>

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

        <AddTournamentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={onCreate}  // ✅ теперь передаём правильный handler
        />
      </div>
    </div>
  );
}