"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

import { formatDate } from "@/app/components/Utils";
import { Tournament } from "@/app/models/Tournament";
import { TournamentStatus, TournamentFormat, STATUS_OPTIONS } from "@/app/models/Tournament";
import { useUser } from "@/app/components/UserContext";
import { useTournaments } from "@/app/tournaments/TournamentsProvider";
import { UserRole } from "@/app/models/Users";
import { DeleteIconButton } from "./controls/IconButtons";
import { useDictionary } from "@/app/components/LanguageProvider";

import "./TournamentCard.css";

type TournamentCardProps = {
  tournament: Tournament | null;
  participantsCount: number;
  matchesCount: number;
  displayName: boolean;
  onClick?: () => void;
  onDelete?: (tournamentId: number) => void;
  onStatusChange?: (status: TournamentStatus) => void;
};

export function TournamentCard({
  tournament,
  participantsCount,
  matchesCount,
  displayName = true,
  onClick,
  onDelete,
  onStatusChange,
}: TournamentCardProps) {
  const { user } = useUser();
  const { updateTournamentStatus } = useTournaments();
  const { tournaments: tournamentsText } = useDictionary();
  const tournamentsCard = tournamentsText.card;
  const statusOptions = useMemo(
    () =>
      STATUS_OPTIONS.filter((opt) => opt.value).map((opt) => ({
        value: opt.value as TournamentStatus,
        label: tournamentsText.statusLabels[opt.value as TournamentStatus],
      })),
    [tournamentsText.statusLabels]
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
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [statusPending, setStatusPending] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(tournament?.status ?? TournamentStatus.Draft);
  const statusRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!statusMenuOpen) return;
    const onClickOutside = (event: globalThis.MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setStatusMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [statusMenuOpen]);

  useEffect(() => {
    if (!tournament) return;
    setCurrentStatus(tournament.status);
  }, [tournament?.status, tournament]);

  const currentStatusLabel = useMemo(() => {
    const matched = statusOptions.find((option) => option.value === currentStatus);
    return matched ? matched.label : tournamentsText.statusLabels[currentStatus] ?? "";
  }, [currentStatus, statusOptions, tournamentsText.statusLabels]);

  const typeLabel = useMemo(
    () => (tournament ? tournamentsText.typeLabels[tournament.tournament_type] : ""),
    [tournament, tournamentsText.typeLabels]
  );
  const formatLabel = useMemo(
    () => (tournament ? resolveFormatLabel(tournament.format as TournamentFormat) : ""),
    [tournament, resolveFormatLabel]
  );
  const participantsLabel = useMemo(
    () => tournamentsCard.participantsLabel.replace(" {count}", ""),
    [tournamentsCard.participantsLabel]
  );
  const matchesLabel = useMemo(
    () => tournamentsCard.matchesLabel.replace(" {count}", ""),
    [tournamentsCard.matchesLabel]
  );

  const className = `card card-800px ${onClick ? "clickable" : ""}`;

  // Пустая карточка-скелет, если турнира нет (null/undefined)
  if (tournament == null) {
    return (
      <div className={className} onClick={onClick}>
        <div className="card-add">+</div>
      </div>
    );
  }

  const canChangeStatus = (() => {
    if (!tournament || !user) return false;
    if (user.role === UserRole.SiteAdmin) return true;
    if (tournament.club && tournament.club.created_by === user.id) return true;
    return false;
  })();

  const handleToggleStatusMenu = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!canChangeStatus || statusPending) return;
    setStatusMenuOpen((prev) => !prev);
  };

  const handleStatusSelect = async (nextStatus: TournamentStatus, event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!tournament) return;
    setStatusMenuOpen(false);
    if (nextStatus === currentStatus) return;

    setStatusPending(true);
    setCurrentStatus(nextStatus);
    try {
      await updateTournamentStatus(tournament.id, nextStatus);
      onStatusChange?.(nextStatus);
    } catch (err) {
      console.error("Failed to update tournament status", err);
      alert(tournamentsCard.statusUpdateFailed);
      setCurrentStatus(tournament.status);
      onStatusChange?.(tournament.status);
    } finally {
      setStatusPending(false);
    }
  };

  return (
    <div className={className} onClick={onClick}>
      <div className="card-header">
        <div>{tournament.club && tournament.club.name}</div>
        {displayName ? (
          <h3>{tournament.name}</h3>
        ) : (<div></div>)}
        <div className="tournament-status-cell">
          {canChangeStatus ? (
            <div className="tournament-status-control" ref={statusRef} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className={`status ${currentStatus} tournament-status-control__button${statusPending ? " is-loading" : ""}`}
                onClick={handleToggleStatusMenu}
                disabled={statusPending}
                aria-haspopup="menu"
                aria-expanded={statusMenuOpen}
              >
                {currentStatusLabel}
              </button>
              {statusMenuOpen && (
                <ul className="tournament-status-control__dropdown" role="menu">
                  {statusOptions.map((option) => (
                    <li key={option.value} role="none">
                      <button
                        type="button"
                        role="menuitemradio"
                        aria-checked={option.value === currentStatus}
                        className={`tournament-status-control__option${
                          option.value === currentStatus ? " is-active" : ""
                        }`}
                        onClick={(event) => handleStatusSelect(option.value, event)}
                        disabled={statusPending}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <span className={`status ${currentStatus}`}>{currentStatusLabel}</span>
          )}
        </div>
      </div>

      <div className="tournament-details  card-row">
        <table className="tournament-card-table">
          <tbody className="tournament-card-table-body">
            <tr  >
              <td>🏆</td>
              <td>{tournamentsCard.typeLabel}</td>
              <td>{typeLabel}</td>
            </tr>
            <tr>
              <td>🏆</td>
              <td>{tournamentsCard.formatLabel}</td>
              <td>{formatLabel}</td>
            </tr>
            <tr>
              <td>📅</td>
              <td>{tournamentsCard.datesLabel}</td>
              <td>
                {tournament.start_date ? formatDate(new Date(tournament.start_date)) : "—"}
                {tournament.end_date && ` → ${formatDate(new Date(tournament.end_date))}`}
              </td>
            </tr>
            <tr>
              <td>👫</td>
              <td>{participantsLabel}</td>
              <td>{participantsCount}</td>
            </tr>
            <tr>
              <td>🎾</td>
              <td>{matchesLabel}</td>
              <td>{matchesCount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card-bottom-toolbar">
        {onDelete && (
          <DeleteIconButton
            title={tournamentsCard.deleteTitle}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(tournament.id);
            }}
          />
        )}
      </div>
    </div>
  );
}
