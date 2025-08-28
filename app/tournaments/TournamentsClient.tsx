"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { CancelIconButton, CheckBoxIcon } from "../components/IconButtons";

import {
  TournamentStatus,
  TournamentFormat,
  TournamentType,
  TYPE_OPTIONS,
  FORMAT_OPTIONS,
  STATUS_OPTIONS,
} from "@/app/models/Tournament";

import { NavigationBar } from "@/app/components/NavigationBar";
import { AdminOnly, NotAdminOnly } from "@/app/components/RoleGuard";
import { TournamentCard } from "@/app/components/TournamentCard";
import { useUser } from "@/app/components/UserContext";
import { AddTournamentModal } from "../components/AddTournamentModal";

import { useTournaments } from "@/app/tournaments/TournamentsProvider";
import { Tournament, TournamentCreateInput } from "@/app/models/Tournament";

import { canDeleteTournament, canViewTournament } from "@/app/lib/permissions";


import "./page.css";
import "@/app/MainPage.css";
import { CustomSelect } from "../components/CustomSelect";

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
  const [fltMy, setFltMy] = useState<boolean>(true);

  const [modalOpen, setModalOpen] = useState(false);

  // 🎯 ПРИНИМАЕМ payload из модалки
  const onCreate = async (payload: TournamentCreateInput) => {
    if (!user?.id) {
      alert("Вы должны быть авторизованы для создания турнира");
      return;
    }

    await createTournament({
      name: payload.name.trim(),
      format: payload.format,
      tournament_type: payload.tournament_type,
      start_date: payload.start_date || null,
      end_date: payload.end_date || null,
      status: TournamentStatus.Draft,
      creator_id: user.id,
      is_public: payload.is_public,
      settings: payload.settings,
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
    setFltMy(true)
  };

const filtered = useMemo(() => {
  const qNorm = q.trim().toLowerCase();

  // аккуратно определим «мой турнир» для разных схем БД
  const isMine = (t: Tournament) => {
    const uid = user?.id;
    if (!uid) return false;
    if (user.role === "site_admin") return true;
    // приоритет — creator_id; на всякий случай поддержим admin_user_id / owner_id
    const anyT = t as any;
    return (
      anyT.creator_id === uid ||
      anyT.admin_user_id === uid ||
      anyT.owner_id === uid
    );
  };

  return tournaments.filter((t) => {
    if (qNorm && !t.name.toLowerCase().includes(qNorm)) return false;
    if (fltType && t.tournament_type !== fltType) return false;
    if (fltFormat && t.format !== fltFormat) return false;
    if (fltStatus && t.status !== fltStatus) return false;

    // показываем только мои, если включён чекбокс
    if (fltMy && !isMine(t)) return false;

    return true;
  });
}, [tournaments, q, fltType, fltFormat, fltStatus, fltMy, user?.id]);
  

  return (
    <div className="page-container">
      <NavigationBar />

      <h1 className="page-title">Турниры</h1>

      <div className="page-content-container">
        {/* Панель фильтров */}
        <div className="card card-controls">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск по названию…"
            className="input card-filter-controls"
          />

          <CustomSelect
            className="input card-filter-controls"
            options={TYPE_OPTIONS}
            value={fltType}
            onChange={(val) => setFltType(val as TournamentType)}
            disabled={false}
            showSearch={false}
            sort={false}
          />

          <CustomSelect
            className="input card-filter-controls"
            options={FORMAT_OPTIONS}
            value={fltFormat}
            onChange={(val) => setFltFormat(val as FilterFormat)}
            disabled={false}
            showSearch={false}
            sort={false}
          />

          <CustomSelect
            className="input card-filter-controls"
            options={STATUS_OPTIONS}
            value={fltStatus}
            onChange={(val) => setFltStatus(val as FilterStatus)}
            disabled={false}
            showSearch={false}
            sort={false}
          />

          <NotAdminOnly>
            <div className="card-filter-controls">
              <CheckBoxIcon
                isSelected={fltMy}
                onClick={() => setFltMy(v => !v)}
                aria-label="Показывать только мои турниры"
              />
              <span>Только мои</span>
            </div>
          </NotAdminOnly>

          <CancelIconButton onClick={resetFilters} title="Сброс" />
        </div>

        {/* Список турниров */}
        {loading && <div className="card">Загрузка…</div>}
        {error && <div className="card card-error">Ошибка: {error}</div>}

        <div className="card-grid">
          {/* Карточка создания турниров — только для админов */}
          <AdminOnly>
            <TournamentCard
              key={0}
              tournament={null}
              participantsCount={0}
              matchesCount={0}
              onClick={() => setModalOpen(true)}
              displayName={true}
            />
          </AdminOnly>

          {filtered.map((t) => {
            const canView = canViewTournament(user, t);
            const canDelete = canDeleteTournament(user, t);
            return (
              <TournamentCard
                key={t.id}
                tournament={t}
                participantsCount={stats[t.id]?.participants ?? 0}
                matchesCount={stats[t.id]?.matches ?? 0}
                {...(canView ? { onClick: () => router.push(`/tournaments/${t.id}`) } : {})}
                {...(canDelete ? {onDelete} : {})}
                displayName={true}
              />
            );
          })}

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