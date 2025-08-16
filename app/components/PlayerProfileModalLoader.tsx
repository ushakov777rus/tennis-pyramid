"use client";

import { useEffect, useMemo, useState } from "react";
import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";
import { PlayerProfileModal } from "@/app/components/PlayerProfileModal";

import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { MatchRepository } from "@/app/repositories/MatchRepository";
// Если у тебя другие имена методов — см. комментарии ниже, их легко заменить

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  recentLimit?: number; // по умолчанию возьмём 8
};

export function PlayerProfileModalLoader({
  isOpen,
  onClose,
  userId,
  recentLimit = 8,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // 1) находим Player по userId
        let p: Player | null = null;

        if ((PlayersRepository as any).findByUserId) {
          p = await (PlayersRepository as any).findByUserId(userId);
        }

        if (!p) {
          throw new Error("Игрок с таким пользователем не найден");
        }

        // 2) подтягиваем матчи игрока
        let ms: Match[] = [];
        if ((MatchRepository as any).loadForPlayer) {
          ms = await (MatchRepository as any).loadForPlayer(p.id);
        } else if ((MatchRepository as any).loadByPlayerId) {
          ms = await (MatchRepository as any).loadByPlayerId(p.id);
        } else {
          // fallback: если нет явных методов — можно сделать общий loadAll и отфильтровать
          if ((MatchRepository as any).loadAll) {
            const all = await (MatchRepository as any).loadAll();
            ms = (all as Match[]).filter(m =>
              isPlayerInMatch(p!.id, m)
            );
          }
        }

        // сортируем по дате убыв.
        ms.sort((a, b) => {
          const ad = a.date ? new Date(a.date as any).getTime() : 0;
          const bd = b.date ? new Date(b.date as any).getTime() : 0;
          return bd - ad;
        });

        if (!cancelled) {
          setPlayer(p);
          setMatches(ms);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Ошибка загрузки профиля");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [isOpen, userId]);

  const { wins, losses, winRate } = useMemo(() => {
    if (!player) return { wins: 0, losses: 0, winRate: 0 };
    let w = 0, l = 0;
    for (const m of matches) {
      if (isWinner(player, m)) w++; else l++;
    }
    const total = w + l;
    return {
      wins: w,
      losses: l,
      winRate: total ? Math.round((w / total) * 100) : 0,
    };
  }, [player, matches]);

  // TODO: если у тебя есть система рангов — подставь реальный rank
  const rank: number | undefined = undefined;

  if (!isOpen) return null;

  // Покажем простейший лоадер/скелетон внутри твоего overlay
  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
          Загрузка профиля…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
          <div style={{ color: "#f04438" }}>Ошибка: {error}</div>
        </div>
      </div>
    );
  }

  if (!player) return null;

  return (
    <PlayerProfileModal
      isOpen={isOpen}
      onClose={onClose}
      player={player}
      stats={{ wins, losses, winRate, rank }}
      recentMatches={matches.slice(0, recentLimit)}
    />
  );
}

/* ——— helpers ——— */

function isPlayerInMatch(playerId: number, m: Match) {
  if (m.player1?.id === playerId || m.player2?.id === playerId) return true;
  if (m.team1?.player1?.id === playerId || m.team1?.player2?.id === playerId) return true;
  if (m.team2?.player1?.id === playerId || m.team2?.player2?.id === playerId) return true;
  return false;
}

function isWinner(player: Player, match: Match) {
  const winnerId = match.getWinnerId?.();
  if (!winnerId) return false;

  // одиночки
  if (match.player1 && match.player2) {
    return winnerId === player.id;
  }

  // пары
  const inTeam1 =
    match.team1?.player1?.id === player.id || match.team1?.player2?.id === player.id;
  const inTeam2 =
    match.team2?.player1?.id === player.id || match.team2?.player2?.id === player.id;

  if (inTeam1) return winnerId === match.team1?.id;
  if (inTeam2) return winnerId === match.team2?.id;
  return false;
}