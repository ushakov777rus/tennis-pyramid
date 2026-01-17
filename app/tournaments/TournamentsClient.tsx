"use client";

import "./page.css";
import "@/app/MainPage.css";

import { useCallback, useMemo, useState } from "react";
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
import { useDictionary, useLanguage } from "../components/LanguageProvider"; // dictionary and locale hooks
import { withLocalePath } from "../i18n/routing";
import { Pagination } from "@/app/components/controls/Pagination"; // pagination UI

type PaginationInfo = { // pagination shape for list page
  currentPage: number; // current page number
  totalPages: number; // total pages count
  basePath: string; // base path for links
}; // end PaginationInfo

type Props = { // component props
  club: Club | null; // current club or null
  pagination?: PaginationInfo; // optional pagination config
}; // end Props


export function TournamentsClient({ club, pagination } : Props) { // tournaments list UI
  const { user } = useUser();
  const router = useRouter();
  const { locale } = useLanguage();
  const pathname = usePathname();
  const { tournaments, loading, error, createTournament, deleteTournament, stats } = useTournaments();
  const { tournaments: tournamentsText } = useDictionary();
  const typeOptions = useMemo(
    () =>
      TYPE_OPTIONS.map((option) =>
        option.value
          ? {
              ...option,
              label: tournamentsText.typeLabels[option.value as TournamentType],
            }
          : { ...option, label: tournamentsText.filters.typeAny }
      ),
    [tournamentsText.filters.typeAny, tournamentsText.typeLabels]
  );
  const resolveFormatLabel = useCallback(
    (format: TournamentFormat) => {
      switch (format) {
        case TournamentFormat.RoundRobin:
          return tournamentsText.formatLabels.roundRobin;
        case TournamentFormat.SingleElimination:
          return tournamentsText.formatLabels.singleElimination;
        case TournamentFormat.DoubleElimination:
          return tournamentsText.formatLabels.doubleElimination;
        case TournamentFormat.GroupsPlayoff:
          return tournamentsText.formatLabels.groupsPlayoff;
        case TournamentFormat.Swiss:
          return tournamentsText.formatLabels.swiss;
        case TournamentFormat.Custom:
          return tournamentsText.formatLabels.custom;
        case TournamentFormat.Pyramid:
        default:
          return tournamentsText.formatLabels.pyramid;
      }
    },
    [tournamentsText.formatLabels]
  );
  const formatOptions = useMemo(
    () =>
      FORMAT_OPTIONS.map((option) =>
        option.value
          ? { ...option, label: resolveFormatLabel(option.value as TournamentFormat) }
          : { ...option, label: tournamentsText.filters.formatAny }
      ),
    [tournamentsText.filters.formatAny, resolveFormatLabel]
  );
  const statusOptions = useMemo(
    () =>
      STATUS_OPTIONS.map((option) =>
        option.value
          ? {
              ...option,
              label: tournamentsText.statusLabels[option.value as TournamentStatus],
            }
          : { ...option, label: tournamentsText.filters.statusAny }
      ),
    [tournamentsText.filters.statusAny, tournamentsText.statusLabels]
  );

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
      alert(tournamentsText.loginRequired);
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
    if (!confirm(tournamentsText.deleteConfirm)) return;
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

  return ( // main render
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
            options={typeOptions}
            value={fltType}
            onChange={(val) => setFltType(val as TournamentType)}
            disabled={false}
            showSearch={false}
            sort={false}
          />

          <CustomSelect
            className="input"
            options={formatOptions}
            value={fltFormat}
            onChange={(val) => setFltFormat(val as FilterFormat)}
            disabled={false}
            showSearch={false}
            sort={false}
          />

          <CustomSelect
            className="input"
            options={statusOptions}
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
                aria-label={tournamentsText.filters.onlyMineAria}
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
        {loading && <div className="card">{tournamentsText.loading}</div>}
        {error && (
          <div className="card card-error">
            {tournamentsText.errorPrefix}: {error}
          </div>
        )}

        <div className="card-grid-new"> {/* cards grid */}
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
                {...(canView ? { onClick: () => isAdmin 
                  ? router.push(withLocalePath(locale, `/admin/clubs/${t.club?.slug}/${t.slug}`)) 
                  : router.push(withLocalePath(locale, `/player/clubs/${t.club?.slug}/${t.slug}`))} 
                  : {})}
                {...(canDelete ? { onDelete } : {})}
                displayName
              />
            );
          })}

        </div> {/* end cards grid */}

        {pagination && ( // show pagination when configured
          <Pagination // pagination control
            currentPage={pagination.currentPage} // current page
            totalPages={pagination.totalPages} // total pages
            basePath={pagination.basePath} // base path
          /> // end Pagination
        )} {/* end pagination */}

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
