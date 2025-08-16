"use client";

import { useEffect, useMemo } from "react";
import "./PlayerProfileModal.css";

import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";

import { MatchHistoryView } from "@/app/components/MatchHistoryView"

type PlayerStats = {
  wins: number;
  losses: number;
  winRate?: number;   // 0..100
  rank?: number;      // позиция в рейтинге/пирамиде
  tournaments?: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;

  player: Player;

  // данные для блока статистики и "последние матчи"
  stats?: PlayerStats;
  recentMatches?: Match[]; // последние N матчей игрока (уже отфильтрованные сверху)

  // дополнительные действия (опционально)
  onShowFullHistory?: (player: Player) => void;
  onEditPlayer?: (player: Player) => void;
  onMessage?: (player: Player) => void; // например, открыть чат/телеграм
};

export function PlayerProfileModal({
  isOpen,
  onClose,
  player,
  stats,
  recentMatches = [],
  onShowFullHistory,
  onEditPlayer,
  onMessage,
}: Props) {
  // Блокируем прокрутку боди, когда открыта модалка
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  console.log("recentMatches:", recentMatches);

  // Инициалы для аватара
  const initials = useMemo(() => {
    if (!player?.name) return "??";
    return player.name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  }, [player?.name]);

  // вычисляем winRate если не передали
  const winRate = useMemo(() => {
    if (typeof stats?.winRate === "number") return stats!.winRate;
    if (!stats) return undefined;
    const total = stats.wins + stats.losses;
    if (total === 0) return 0;
    return Math.round((stats.wins / total) * 100);
  }, [stats]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* останавливаем всплытие внутри карточки */}
      <div className="modal-content profile-modal slide-in" onClick={(e) => e.stopPropagation()}>
        {/* header */}
        <div className="profile-header">
          <div className="avatar" aria-hidden>
            {initials}
          </div>

          <div className="title-block">
            <div className="name-row">
              <h2 className="player-name-card">{player.name}</h2>
              {player.ntrp != null && (
                <span className="badge ntrp">NTRP {Number(player.ntrp).toFixed(1)}</span>
              )}
              {player.sex && <span className="badge">{player.sex === "F" ? "Ж" : "М"}</span>}
            </div>

            <div className="meta-row">
              {player.phone && (
                <button
                  className="link-like"
                  onClick={() => {
                    navigator.clipboard?.writeText(player.phone!);
                  }}
                  title="Скопировать телефон"
                >
                  {formatPhone(player.phone)}
                </button>
              )}
              {/* добавь сюда email/telegram, если появится */}
            </div>
          </div>

          <button className="icon-btn close-btn" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
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
              <button className="btn ghost sm" onClick={() => onShowFullHistory(player)}>
                Показать всё
              </button>
            )}
          </div>

          {recentMatches.length === 0 ? (
            <div className="empty">Пока нет сыгранных матчей</div>
          ) : (
            <MatchHistoryView
              player={null}
              matches={recentMatches}
              showTournament={true}
              onEditMatch={undefined}
              onDeleteMatch={undefined}
            />
          )}
        </div>

        {/* actions */}
        {(onEditPlayer || onMessage) && (
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
  return `+${digits.slice(0, digits.length - 10)} (${tail.slice(0, 3)}) ${tail.slice(3, 6)}-${tail.slice(6, 8)}-${tail.slice(8)}`.replace(
    /\(\)/,
    ""
  );
}