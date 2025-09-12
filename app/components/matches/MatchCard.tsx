"use client";

import "./MatchCard.css";

import { formatDate } from "@/app/components/Utils";
import { Match } from "@/app/models/Match";
import { CommentIconButton, DeleteIconButton, LikeIconButton } from "@/app/components/IconButtons";
import { AdminOnly } from "../RoleGuard";
import { useState } from "react";

type MatchCardProps = {
  match: Match;
  onClick?: () => void;
  onDelete?: (tournamentId: number) => void;
};

export function MatchCard({ match, onClick, onDelete }: MatchCardProps) {
  // состояние для временного тултипа "Пока не реализовано"
  const [showTooltip, setShowTooltip] = useState(false);

  // нормализуем массив сетов
  const sets: Array<[number | string | null, number | string | null]> = Array.isArray(match.scores)
    ? (match.scores as any[])
    : [];

  // безопасный доступ к счёту
  const getScore = (setIdx: number, playerIdx: 0 | 1) => {
    const set = sets[setIdx];
    if (!set) return "";
    const v = set[playerIdx];
    return (v ?? "") as string | number;
  };

  // определяем победителя конкретного сета
  const getWinner = (setIdx: number): 0 | 1 | null => {
    const set = sets[setIdx];
    if (!set) return null;
    const [a, b] = set.map((v) => (typeof v === "number" ? v : parseInt(String(v)) || 0));
    if (a > b) return 0;
    if (b > a) return 1;
    return null;
  };

  // определяем победителя всего матча (по логике модели)
  const matchWinnerId = match.getWinnerId();

  return (
    <div
      className="card"
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {/* заголовок карточки */}
      <div className="card-head">
        <h3>{match.tournament.name}</h3>
        <div className="match-card-date">{formatDate(match.date)}</div>
      </div>

      {/* тело карточки со счетом */}
      <div className="match-card-body">
        {/* строка игрока A */}
        <div className="match-card-row">
          <div
            className={`avatar ${
              matchWinnerId && matchWinnerId === match.player1?.id ? "match-winner" : ""
            }`}
          >
            {(match.player1?.displayName()?.[0] ?? "U").toUpperCase()}
          </div>

          <div className="player">
            {match.player1?.displayName() ?? match.team1?.displayName()}
          </div>

          {sets.map((_, i) => {
            const winner = getWinner(i);
            return (
              <div
                key={`a-${i}`}
                className={`cell cell--score ${winner === 0 ? "winner" : ""}`}
              >
                {getScore(i, 0)}
              </div>
            );
          })}
        </div>

        {/* строка игрока B */}
        <div className="match-card-row">
          <div
            className={`avatar ${
              matchWinnerId && matchWinnerId === match.player2?.id ? "match-winner" : ""
            }`}
          >
            {(match.player2?.displayName()?.[0] ?? "U").toUpperCase()}
          </div>

          <div className="player">
            {match.player2?.displayName() ?? match.team2?.displayName()}
          </div>

          {sets.map((_, i) => {
            const winner = getWinner(i);
            return (
              <div
                key={`b-${i}`}
                className={`cell cell--score ${winner === 1 ? "winner" : ""}`}
              >
                {getScore(i, 1)}
              </div>
            );
          })}
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
          {onDelete && (
            <DeleteIconButton
              title="Удалить матч"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(match.tournament.id);
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