// app/components/UserProfileView.tsx
"use client";

import { useMemo } from "react";
import "./PlayerProfileModal.css";

import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";
import { MatchHistoryView } from "@/app/components/matches/MatchHistoryView";
import { User } from "@/app/models/Users";
import { formatPhone } from "./Utils";
import { useDictionary } from "./LanguageProvider";

/** Краткая статистика игрока для блока “о игроке” */
export type UserProfileStats = {
  wins: number;
  losses: number;
  winRate?: number;   // 0..100
  rank?: number;      // позиция в рейтинге/пирамиде
  tournaments?: number;
};

type Props = {
  /** Пользователь, внутри — связанный Player */
  user: User;

  /** Данные для блока статистики */
  stats?: UserProfileStats;

  /** Последние матчи игрока (уже отсортированные снаружи) */
  matches?: Match[];

  /** Опциональные экшены */
  onShowFullHistory?: (player: Player) => void;
  onEditPlayer?: (player: Player) => void;
  onMessage?: (player: Player) => void; // например, открыть чат/телеграм
};

/**
 * Презентационный компонент профиля пользователя/игрока.
 * Не делает загрузок сам; принимает готовые user/stats/matches.
 */
export function UserProfileView({
  user,
  stats,
  matches = [],
  onShowFullHistory,
  onEditPlayer,
  onMessage,
}: Props) {
  const player = user.player; // короче и удобнее
  const { profile } = useDictionary();

  // Инициалы для аватара из имени игрока
  const initials = useMemo(() => {
    if (!player?.name) return "??";
    return player.name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  }, [player?.name]);

  // Вычисляем winRate, если не пришёл готовый
  const winRate = useMemo(() => {
    if (typeof stats?.winRate === "number") return stats.winRate;
    if (!stats) return undefined;
    const total = stats.wins + stats.losses;
    return total === 0 ? 0 : Math.round((stats.wins / total) * 100);
  }, [stats]);

  return (
    <div className="page-content-container">
      {/* Карточка профиля */}
      <div className="card" onClick={(e) => e.stopPropagation()}>
        {/* Header: аватар + имя + тэги */}
        <div className="profile-header">
          <div className="avatar" aria-hidden>
            {initials}
          </div>

          <div className="title-block">
            <div className="name-row">
              <h2 className="player-name-card">{player?.name ?? profile.unknownPlayer}</h2>

              {player?.ntrp != null && (
                <span className="badge ntrp">
                  NTRP {Number(player.ntrp).toFixed(1)}
                </span>
              )}

              {player?.sex && (
                <span className="badge">{player.sex === "F" ? profile.sexBadge.female : profile.sexBadge.male}</span>
              )}
            </div>

            {/* Контакты / действия с контактами */}
            <div className="meta-row">
              {player && player?.phone && (
                <button
                  className="link-like"
                  onClick={() => {
                    // удобная кнопка “скопировать телефон”
                    if (player?.phone) {
                        navigator.clipboard?.writeText(player.phone);
                        }
                    }}
                  title={profile.copyPhone}
                >
                  {formatPhone(player.phone)}
                </button>
              )}
              {/* тут же можно вывести email/telegram и т.д. */}
            </div>
          </div>
        </div>

        {/* Сетка статистики */}
        <div className="stats-grid">
          <StatCard label={profile.stats.wins} value={stats?.wins ?? 0} />
          <StatCard label={profile.stats.losses} value={stats?.losses ?? 0} />
          <StatCard label={profile.stats.winRate} value={winRate != null ? `${winRate}%` : "—"} />
          <StatCard label={profile.stats.rank} value={stats?.rank != null ? `#${stats.rank}` : "—"} />
          <StatCard label={profile.stats.tournaments} value={stats?.tournaments ?? "—"} />
        </div>

        {/* Кнопки действий */}
        {(onEditPlayer || onMessage) && player && (
          <div className="actions">
            {onMessage && (
              <button className="btn primary" onClick={() => onMessage(player)}>
                {profile.actions.message}
              </button>
            )}
            {onEditPlayer && (
              <button className="btn" onClick={() => onEditPlayer(player)}>
                {profile.actions.edit}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Последние матчи */}
      <div className="card">
        <div className="card-title">
          <h3>{profile.matchesTitle}</h3>
          {onShowFullHistory && player && (
            <button className="btn ghost sm" onClick={() => onShowFullHistory(player)}>
              {profile.actions.showAll}
            </button>
          )}
        </div>

        {matches.length > 0 ? (
          <MatchHistoryView
            matches={matches}
            onEditMatch={undefined}
            onDeleteMatch={undefined}
          />
        ) : (
          <div className="empty">{profile.matchesEmpty}</div>
        )}
      </div>
    </div>
  );
}

/* ======================= helpers ======================= */

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="input">
        <div className="stat-value">{value}</div>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
