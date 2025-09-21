"use client";

import "./PlayerCard.css";

import { CommentIconButton, DeleteIconButton, EditIconButton, LikeIconButton } from "@/app/components/controls/IconButtons";
import { AdminOnly } from "../RoleGuard";
import { useState } from "react";
import { Player } from "@/app/models/Player";

type PlayerCardProps = {
  players: Player[];
  stats: { matches: number; wins: number; winrate: number };
  titles?: string;
  onClick?: () => void;
  onDelete?: () => void;
};

export function PlayerCard({ players, stats, titles, onClick, onDelete }: PlayerCardProps) {
  const participants = players.filter((p): p is Player => Boolean(p));
  if (!participants.length) return null;

  // состояние для временного тултипа "Пока не реализовано"
  const [showTooltip, setShowTooltip] = useState(false);

  const winrate = (winrate: number) => {
    return winrate.toFixed(1) + "%";
  };

  const isTeam = participants.length > 1;

  const names = participants.map((p) => p.displayName?.() ?? p.name ?? "Без имени").join("\n");
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

  return (
    <div
      className="card"
      onClick={onClick}
      role={onClick ? "button" : undefined}
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
            <div className="badge">NTRP {ntrpLabel}</div>
            <div>Игр: {stats.matches ?? 0}</div>
            <div>Побед: {stats.wins ?? 0}</div>
            <div>WR: {winrate(stats.winrate)}</div>
        </div>
        <div className="player-card-row">
          {titles && <div className="badge">{titles}</div>}
        </div>
      </div>

      {/* нижняя панель с действиями */}
      <div className="card-bottom-toolbar">
        {/* кнопка лайка */}
        <LikeIconButton
          title="Поставить лайк"
          onClick={(e) => {
            e.stopPropagation();
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 2000); // показываем тултип на 2 сек
          }}
        />

        {/* кнопка комментария */}
        <CommentIconButton
          title="Оставить комментарий"
          onClick={(e) => {
            e.stopPropagation();
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 2000); // показываем тултип на 2 сек
          }}
        />

        {/* кнопка удаления доступна только админам */}
        <AdminOnly>
          <EditIconButton 
            title="Удалить игрока"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(true);
              setTimeout(() => setShowTooltip(false), 2000); // показываем тултип на 2 сек
            }}
          />

          {onDelete && (
            <DeleteIconButton
              title="Удалить игрока"
              onClick={(e) => {
                e.stopPropagation();
                onDelete()}}
            />
          )}
        </AdminOnly>

        {/* тултип "Пока не реализовано" */}
        {showTooltip && <div className="invalid-tooltip">Пока не реализовано</div>}
      </div>
    </div>
  );
}
