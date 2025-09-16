"use client";

import { useEffect, useMemo } from "react";

import "./PlayerProfileModal.css";

import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";

import { MatchHistoryView } from "@/app/components/matches/MatchHistoryView"
import { User } from "../models/Users";

type PlayerStats = {
  wins: number;
  losses: number;
  winRate?: number;   // 0..100
  rank?: number;      // позиция в рейтинге/пирамиде
  tournaments?: number;
};

type Props = {
  user: User;

  // данные для блока статистики и "последние матчи"
  stats?: PlayerStats;
  recentMatches?: Match[]; // последние N матчей игрока (уже отфильтрованные сверху)

  // дополнительные действия (опционально)
  onShowFullHistory?: (player: Player) => void;
  onEditPlayer?: (player: Player) => void;
  onMessage?: (player: Player) => void; // например, открыть чат/телеграм
};

export function UserProfileView({
  user,
  stats,
  recentMatches = [],
  onShowFullHistory,
  onEditPlayer,
  onMessage,
}: Props) {

    // Инициалы для аватара
  const initials = useMemo(() => {
    if (!user.player?.name) return "??";
    return user.player.name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  }, [user.player?.name]);

  // вычисляем winRate если не передали
  const winRate = useMemo(() => {
    if (typeof stats?.winRate === "number") return stats!.winRate;
    if (!stats) return undefined;
    const total = stats.wins + stats.losses;
    if (total === 0) return 0;
    return Math.round((stats.wins / total) * 100);
  }, [stats]);

  return (
      <div className="card" onClick={(e) => e.stopPropagation()}>
        {/* header */}
        <div className="profile-header">
          <div className="avatar" aria-hidden>
            {initials}
          </div>

          <div className="title-block">
            <div className="name-row">
              <h2 className="player-name-card">{user.player.name}</h2>
              {user.player.ntrp != null && (
                <span className="badge ntrp">NTRP {Number(user.player.ntrp).toFixed(1)}</span>
              )}
              {user.player.sex && <span className="badge">{user.player.sex === "F" ? "Ж" : "М"}</span>}
            </div>

            <div className="meta-row">
              {user.player.phone && (
                <button
                  className="link-like"
                  onClick={() => {
                    navigator.clipboard?.writeText(user.player.phone!);
                  }}
                  title="Скопировать телефон"
                >
                  {formatPhone(user.player.phone)}
                </button>
              )}
              {/* добавь сюда email/telegram, если появится */}
            </div>
          </div>
        </div>

        {/* stats */}
        <div className="stats-grid">
          <StatCard label="Победы" value={stats?.wins ?? 0} />
          <StatCard label="Поражения" value={stats?.losses ?? 0} />
          <StatCard label="WinRate" value={winRate != null ? `${winRate}%` : "—"} />
          <StatCard label="Ранг" value={stats?.rank != null ? `#${stats.rank}` : "—"} />
          <StatCard label="Турниры" value={stats?.tournaments ?? "—"} />
        </div>

        {/* recent matches */}
        <div className="section">
          <div className="section-header">
            <h3>Последние матчи</h3>
            {onShowFullHistory && (
              <button className="btn ghost sm" onClick={() => onShowFullHistory(user.player)}>
                Показать всё
              </button>
            )}
          </div>

          {recentMatches.length === 0 ? (
            <div className="empty">Пока нет сыгранных матчей</div>
          ) : (
            <MatchHistoryView
              matches={recentMatches}
              onEditMatch={undefined}
              onDeleteMatch={undefined}
            />
          )}
        </div>

        {/* actions */}
        {(onEditPlayer || onMessage) && (
          <div className="actions">
            {onMessage && (
              <button className="btn primary" onClick={() => onMessage(user.player)}>
                Написать
              </button>
            )}
            {onEditPlayer && (
              <button className="btn" onClick={() => onEditPlayer(user.player)}>
                Редактировать
              </button>
            )}
          </div>
        )}
      </div>
  );
}

/* ——— helpers ——— */

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="input">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function formatPhone(phone: string) {
  // на всякий случай легкая маска
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return phone;
  const tail = digits.slice(-10);
  return `+7${digits.slice(0, digits.length - 10)} (${tail.slice(0, 3)}) ${tail.slice(3, 6)}-${tail.slice(6, 8)}-${tail.slice(8)}`.replace(
    /\(\)/,
    ""
  );
}