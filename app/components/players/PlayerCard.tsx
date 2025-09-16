"use client";

import "./PlayerCard.css";

import { formatDate } from "@/app/components/Utils";
import { CommentIconButton, DeleteIconButton, EditIconButton, LikeIconButton } from "@/app/components/controls/IconButtons";
import { AdminOnly } from "../RoleGuard";
import { useState } from "react";
import { Player } from "@/app/models/Player";

type PlayerCardProps = {
  player: Player;
  stats: { matches: number; wins: number; winrate: number }
  onClick?: () => void;
  onDelete?: () => void;
};

export function PlayerCard({ player, stats, onClick, onDelete }: PlayerCardProps) {
  // состояние для временного тултипа "Пока не реализовано"
  const [showTooltip, setShowTooltip] = useState(false);

  const winrate = (winrate: number) => {
    return winrate.toFixed(1) + "%";
  };

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
          <div className="avatar-medium">
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
            <div>WR: {winrate(stats.winrate)}</div>
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