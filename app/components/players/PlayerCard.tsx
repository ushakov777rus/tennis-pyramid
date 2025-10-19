"use client";

import "./PlayerCard.css";

import { CommentIconButton, DeleteIconButton, EditIconButton, LikeIconButton } from "@/app/components/controls/IconButtons";
import { AdminOnly } from "../RoleGuard";
import { useState, type KeyboardEvent } from "react";
import { Player } from "@/app/models/Player";
import { useDictionary } from "@/app/components/LanguageProvider";

type PlayerCardProps = {
  players: Player[];
  stats: { matches: number; wins: number; winrate: number };
  titles?: string;
  onClick?: () => void;
  onDelete?: () => void;
};

export function PlayerCard({ players, stats, titles, onClick, onDelete }: PlayerCardProps) {
  const participants = players.filter((p): p is Player => Boolean(p));
  // состояние для временного тултипа "Пока не реализовано"
  const [showTooltip, setShowTooltip] = useState(false);
  const { players: playersText } = useDictionary();

  if (!participants.length) return null;

  const winrate = (winrate: number) => {
    return winrate.toFixed(1) + "%";
  };

  const isTeam = participants.length > 1;

  const names = participants.map((p) => p.displayName?.() ?? p.name ?? playersText.fallbackName).join("\n");
  const initials = participants.map((p) => {
    const name = p.displayName?.() ?? p.name ?? "U";
    return name.trim().charAt(0).toUpperCase() || "U";
  });

  const ntrpLabel = participants
    .map((p) => {
      const numeric = p.ntrp != null ? Number.parseFloat(p.ntrp) : NaN;
      return Number.isFinite(numeric) ? numeric.toFixed(1) : "—";
    })
    .join(isTeam ? " / " : "");

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="card"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >

      {/* тело карточки со счетом */}
      <div className="player-card-body">
        {/* строка игрока A */}
        <div className="player-card-first-row">
          <div className={`avatar-medium${isTeam ? " avatar-medium-team" : ""}`}>
            {isTeam ? (
              <>
                <span>{initials[0]}</span>
                <span>{initials[1] ?? ""}</span>
              </>
            ) : (
              initials[0]
            )}
          </div>        
          <div className="player">
            {names}
          </div>
        </div>  
        <div className="player-card-second-row">
            <div className="badge">{playersText.ntrp.replace("{value}", ntrpLabel)}</div>
            <div>{playersText.matches.replace("{count}", String(stats.matches ?? 0))}</div>
            <div>{playersText.wins.replace("{count}", String(stats.wins ?? 0))}</div>
            <div>{playersText.winRateShort.replace("{value}", winrate(stats.winrate).replace("%", ""))}</div>
        </div>
        
          {titles && 
            <div className="player-card-row">
              <div className="badge">{titles}</div>
            </div>}
      </div>

      {/* нижняя панель с действиями */}
      <div className="card-bottom-toolbar">
        {/* кнопка лайка */}
        <LikeIconButton
          title={playersText.actions.like}
          onClick={(e) => {
            e.stopPropagation();
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 2000); // показываем тултип на 2 сек
          }}
        />

        {/* кнопка комментария */}
        <CommentIconButton
          title={playersText.actions.comment}
          onClick={(e) => {
            e.stopPropagation();
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 2000); // показываем тултип на 2 сек
          }}
        />

        {/* кнопка удаления доступна только админам */}
        <AdminOnly>
          <EditIconButton 
            title={playersText.actions.edit}
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(true);
              setTimeout(() => setShowTooltip(false), 2000); // показываем тултип на 2 сек
            }}
          />

          {onDelete && (
            <DeleteIconButton
              title={playersText.actions.delete}
              onClick={(e) => {
                e.stopPropagation();
                onDelete()}}
            />
          )}
        </AdminOnly>

        {/* тултип "Пока не реализовано" */}
        {showTooltip && <div className="invalid-tooltip">{playersText.tooltipPending}</div>}
      </div>
    </div>
  );
}
