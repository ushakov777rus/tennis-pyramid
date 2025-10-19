"use client";

import "./page.css";
import "@/app/MainPage.css";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { CancelIconButton, CheckBoxIcon } from "../components/controls/IconButtons";

import {
  TournamentStatus,
  TournamentFormat,
  TournamentType,
  TYPE_OPTIONS,
  FORMAT_OPTIONS,
  STATUS_OPTIONS,
} from "@/app/models/Tournament";

import { AdminOnly, LoggedIn } from "@/app/components/RoleGuard";
import { TournamentCard } from "@/app/components/TournamentCard";
import { useUser } from "@/app/components/UserContext";
import { AddTournamentModal } from "../components/AddTournamentModal";

import { useTournaments } from "@/app/tournaments/TournamentsProvider";
import { Tournament, TournamentCreateInput } from "@/app/models/Tournament";

import { canDeleteTournament, canViewTournament } from "@/app/lib/permissions";

import { CustomSelect } from "../components/controls/CustomSelect";
import { Club } from "../models/Club";
import { UserRole } from "../models/Users";
import { useDictionary } from "../components/LanguageProvider";

type Props = {
  club: Club | null;
};


export function TournamentsClient({club} : Props) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { tournaments, loading, error, createTournament, deleteTournament, stats } = useTournaments();
  const { tournaments: tournamentsText } = useDictionary();

  // --- фильтры
  const [q, setQ] = useState<string>("");
  type FilterType = "" | TournamentType;
  type FilterFormat = "" | TournamentFormat;
  type FilterStatus = "" | TournamentStatus;
  const [fltType, setFltType] = useState<FilterType>("");
  const [fltFormat, setFltFormat] = useState<FilterFormat>("");
  const [fltStatus, setFltStatus] = useState<FilterStatus>("");
  const [fltMy, setFltMy] = useState<boolean>(false);

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
      club: club,
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
    if (!uid) return true; // TODO пока разрешаем всем

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

const isAdmin = user?.role === UserRole.TournamentAdmin && pathname.includes("/admin");

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const className = user || tab ? "page-container-no-padding" : "page-container";

  return (
    <div className={className}>
      {club === null && <h1 className="page-title">{tournamentsText.title}</h1>}

      <div className="page-content-container  card-grid-wrapper">
        {/* Панель фильтров */}
        <div className="card page-toolbar">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tournamentsText.searchPlaceholder}
            className="input"
          />

          <CustomSelect
            className="input"
            options={TYPE_OPTIONS}
            value={fltType}
            onChange={(val) => setFltType(val as TournamentType)}
            disabled={false}
            showSearch={false}
            sort={false}
          />

          <CustomSelect
            className="input"
            options={FORMAT_OPTIONS}
            value={fltFormat}
            onChange={(val) => setFltFormat(val as FilterFormat)}
            disabled={false}
            showSearch={false}
            sort={false}
          />

          <CustomSelect
            className="input"
            options={STATUS_OPTIONS}
            value={fltStatus}
            onChange={(val) => setFltStatus(val as FilterStatus)}
            disabled={false}
            showSearch={false}
            sort={false}
          />

          <LoggedIn>
            <div className="page-toolbar__checkbox">
              <CheckBoxIcon
                isSelected={fltMy}
                onClick={() => setFltMy(v => !v)}
                aria-label="Показывать только мои турниры"
              />
              <span>{tournamentsText.filters.onlyMineLabel}</span>
            </div>
          </LoggedIn>

          <div className="page-toolbar__reset">
            <CancelIconButton
              onClick={resetFilters}
              title={tournamentsText.filters.resetTitle}
            />
          </div>
        </div>

        {/* Список турниров */}
        {loading && <div className="card">Загрузка…</div>}
        {error && <div className="card card-error">Ошибка: {error}</div>}

        <div className="card-grid-new">
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
                {...(canView ? { onClick: () => isAdmin ? router.push(`/admin/clubs/${t.club?.slug}/${t.slug}`) : router.push(`/player/clubs/${t.club?.slug}/${t.slug}`)} : {})}
                {...(canDelete ? { onDelete } : {})}
                displayName
              />
            );
          })}

        </div>

        <AddTournamentModal
          isOpen={modalOpen}
          club={club}
          onClose={() => setModalOpen(false)}
          onCreate={onCreate}  // ✅ теперь передаём правильный handler
        />
      </div>
    </div>
  );
}
