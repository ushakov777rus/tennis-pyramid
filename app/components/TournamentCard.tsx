"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

import { formatDate } from "@/app/components/Utils";
import { Tournament } from "@/app/models/Tournament";
import { TournamentStatus, STATUS_OPTIONS } from "@/app/models/Tournament";
import { useUser } from "@/app/components/UserContext";
import { useTournaments } from "@/app/tournaments/TournamentsProvider";
import { UserRole } from "@/app/models/Users";
import { DeleteIconButton } from "./controls/IconButtons";

import "./TournamentCard.css";

type TournamentCardProps = {
  tournament: Tournament | null;
  participantsCount: number;
  matchesCount: number;
  displayName: boolean;
  onClick?: () => void;
  onDelete?: (tournamentId: number) => void;
};

export function TournamentCard({
  tournament,
  participantsCount,
  matchesCount,
  displayName = true,
  onClick,
  onDelete
}: TournamentCardProps) {
  const { user } = useUser();
  const { updateTournamentStatus } = useTournaments();
  const statusOptions = useMemo(
    () => STATUS_OPTIONS.filter((opt) => opt.value) as { value: TournamentStatus; label: string }[],
    []
  );
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [statusPending, setStatusPending] = useState(false);
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

  const className = `card card-800px ${onClick ? "clickable" : ""}`;

// Пустая карточка-скелет, если турнира нет (null/undefined)
if (tournament == null) {
  return (
    <div className={className} onClick={onClick}>
      <div className="card-add">
        +
      </div>
    </div>
  );
}

  const canChangeStatus = (() => {
    if (!tournament || !user) return false;
    if (user.role === UserRole.SiteAdmin) return true;
    if (tournament.club && tournament.club.created_by === user.id) return true;
    console.log("Cant change status", tournament, user,tournament.club,tournament.club?.created_by);
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
    if (nextStatus === tournament.status) return;

    setStatusPending(true);
    try {
      await updateTournamentStatus(tournament.id, nextStatus);
    } catch (err) {
      console.error("Failed to update tournament status", err);
      alert("Не удалось обновить статус турнира");
    } finally {
      setStatusPending(false);
    }
  };

  return (
    <div className={className} onClick={onClick}>
      <div className="tournament-card-header">
        <div>{tournament.club && tournament.club.name}</div>
        {displayName && (
          <h3>{tournament.name}</h3>
        )}
        <div className="tournament-status-cell">
          {canChangeStatus ? (
            <div className="tournament-status-control" ref={statusRef} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className={`status ${tournament.status} tournament-status-control__button${statusPending ? " is-loading" : ""}`}
                onClick={handleToggleStatusMenu}
                disabled={statusPending}
                aria-haspopup="menu"
                aria-expanded={statusMenuOpen}
              >
                {tournament.getStatus()}
              </button>
              {statusMenuOpen && (
                <ul className="tournament-status-control__dropdown" role="menu">
                  {statusOptions.map((option) => (
                    <li key={option.value} role="none">
                      <button
                        type="button"
                        role="menuitemradio"
                        aria-checked={option.value === tournament.status}
                        className={`tournament-status-control__option${
                          option.value === tournament.status ? " is-active" : ""
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
            <span className={`status ${tournament.status}`}>{tournament.getStatus()}</span>
          )}
        </div>
      </div>

      <div className="tournament-details  card-row">
        <table className="tournament-card-table">
          <tbody className="tournament-card-table-body">
            <tr  >
              <td>🏆</td>
              <td>Тип:</td>
              <td>{tournament.getType()}</td>
            </tr>
            <tr>
              <td>🏆</td>
              <td>Формат:</td>
              <td>{tournament.getFormat()}</td>
            </tr>
            <tr>
              <td>📅</td>
              <td>Даты:</td>
              <td>
                {tournament.start_date ? formatDate(new Date(tournament.start_date)) : "—"}
                {tournament.end_date && ` → ${formatDate(new Date(tournament.end_date))}`}
              </td>
            </tr>
            <tr>
              <td>👫</td>
              <td>Участников:</td>
              <td>{participantsCount}</td>
            </tr>
            <tr>
              <td>🎾</td>
              <td>Игр:</td>
              <td>{matchesCount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card-bottom-toolbar">
        {onDelete && (
          <DeleteIconButton
            title="Удалить турнир"
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
