"use client";

import "./PlayerCard.css";

import { formatDate } from "@/app/components/Utils";
import { CommentIconButton, DeleteIconButton, LikeIconButton } from "@/app/components/IconButtons";
import { AdminOnly } from "../RoleGuard";
import { useState } from "react";
import { Player } from "@/app/models/Player";

type PlayerCardProps = {
  player: Player;
  stats: { matches: number; wins: number; winrate: number }
  onClick?: () => void;
  onDelete?: (tournamentId: number) => void;
};

export function PlayerCard({ player, stats, onClick, onDelete }: PlayerCardProps) {
  // состояние для временного тултипа "Пока не реализовано"
  const [showTooltip, setShowTooltip] = useState(false);

  const winrate = (winrate: number) => {
    return winrate.toFixed(1) + "%";
  };

  return (
    <div
      className="card match-card"
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >

      {/* тело карточки со счетом */}
      <div className="player-card-body">
        {/* строка игрока A */}
        <div className="player-card-first-row">
          <div className="avatar">
            {(player.displayName()?.[0] ?? "U").toUpperCase()}
          </div>        
          <div className="player">
            {player?.displayName()}
          </div>
        </div>  
        <div className="player-card-second-row">
            <div className="badge">NTRP {Number(player.ntrp).toFixed(1)}</div>
            <div>Игр: {stats.matches ?? 0}</div>
            <div>Побед: {stats.wins ?? 0}</div>
            <div>WinRate: {winrate(stats.winrate)}</div>
        </div>
      </div>

      {/* нижняя панель с действиями */}
      <div className="match-card-bottom">
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
          {onDelete && (
            <DeleteIconButton
              title="Удалить матч"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(true);
                setTimeout(() => setShowTooltip(false), 2000); // показываем тултип на 2 сек
              }}
            />
          )}
        </AdminOnly>

        {/* тултип "Пока не реализовано" */}
        {showTooltip && <div className="invalid-tooltip">Пока не реализовано</div>}
      </div>
    </div>
  );
}