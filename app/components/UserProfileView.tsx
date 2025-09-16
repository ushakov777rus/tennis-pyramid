// app/components/UserProfileView.tsx
"use client";

import { useMemo } from "react";
import "./PlayerProfileModal.css";

import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";
import { MatchHistoryView } from "@/app/components/matches/MatchHistoryView";
import { User } from "@/app/models/Users";

/** Краткая статистика игрока для блока “о игроке” */
type PlayerStats = {
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
  stats?: PlayerStats;

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
              <h2 className="player-name-card">{player?.name ?? "Игрок"}</h2>

              {player?.ntrp != null && (
                <span className="badge ntrp">
                  NTRP {Number(player.ntrp).toFixed(1)}
                </span>
              )}

              {player?.sex && (
                <span className="badge">{player.sex === "F" ? "Ж" : "М"}</span>
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
                  title="Скопировать телефон"
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
          <StatCard label="Победы" value={stats?.wins ?? 0} />
          <StatCard label="Поражения" value={stats?.losses ?? 0} />
          <StatCard label="WinRate" value={winRate != null ? `${winRate}%` : "—"} />
          <StatCard label="Ранг" value={stats?.rank != null ? `#${stats.rank}` : "—"} />
          <StatCard label="Турниры" value={stats?.tournaments ?? "—"} />
        </div>

        {/* Кнопки действий */}
        {(onEditPlayer || onMessage) && player && (
          <div className="actions">
            {onMessage && (
              <button className="btn primary" onClick={() => onMessage(player)}>
                Написать
              </button>
            )}
            {onEditPlayer && (
              <button className="btn" onClick={() => onEditPlayer(player)}>
                Редактировать
              </button>
            )}
          </div>
        )}
      </div>

      {/* Последние матчи */}
      <div className="card">
        <h3>Последние матчи</h3>
        {onShowFullHistory && player && (
        <button className="btn ghost sm" onClick={() => onShowFullHistory(player)}>
            Показать всё
        </button>
        )}

        {matches.length > 0 ? (
          <MatchHistoryView
            matches={matches}
            onEditMatch={undefined}
            onDeleteMatch={undefined}
          />
        ) : (
          <div className="empty">Пока нет сыгранных матчей</div>
        )}
      </div>
    </div>
  );
}

/* ======================= helpers ======================= */

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="input">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/** Простая маска телефона под формат +7 (...) ...-..-.. */
function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return phone;
  const tail = digits.slice(-10);
  return `+7${digits.slice(0, digits.length - 10)} (${tail.slice(0, 3)}) ${tail.slice(
    3,
    6
  )}-${tail.slice(6, 8)}-${tail.slice(8)}`.replace(/\(\)/, "");
}