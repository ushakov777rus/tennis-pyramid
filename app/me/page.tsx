// app/me/MatchListView.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

import { MatchRepository } from "@/app/repositories/MatchRepository";
import { Match } from "@/app/models/Match";

import "@/app/components/matches/MatchHistoryView.css";
import { UserProfileView } from "@/app/components/UserProfileView";
import { useUser } from "@/app/components/UserContext";
import { useDictionary } from "@/app/components/LanguageProvider";

/**
 * Показывает профиль текущего пользователя и его последние матчи.
 * Страница: /me (или любая другая, куда подключишь компонент)
 */
export default function UserPage() {
  const { user } = useUser();
  const { mePage, common } = useDictionary();

  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // если пользователь не залогинен или нет связанного игрока — показываем ошибку
      if (!user?.player?.id) {
        setError(mePage.playerNotFound);
        setMatches([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // ⚠️ ОБЯЗАТЕЛЬНО await — это асинхронный вызов к БД
        const playerMatches = await MatchRepository.loadByPlayerId(user.player.id);

        // Отсортируем по дате (новые сверху). Если у матча нет даты — считаем её как 0.
        playerMatches.sort((a, b) => {
          const ad = a.date ? new Date(a.date as any).getTime() : 0;
          const bd = b.date ? new Date(b.date as any).getTime() : 0;
          return bd - ad;
        });

        if (!cancelled) {
          setMatches(playerMatches);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? mePage.loadFailed);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    // аккуратно завершаем setState при анмаунте
    return () => {
      cancelled = true;
    };
  }, [user]); // если user меняется, перегружаем

  // Подсчёт статистики побед/поражений
  const { wins, losses, winRate } = useMemo(() => {
    const pid = user?.player?.id;
    if (!pid) return { wins: 0, losses: 0, winRate: 0 };

    let w = 0,
      l = 0;
    for (const m of matches) {
      if (pid === m.getWinnerId()) w++;
      else l++;
    }
    const total = w + l;
    return {
      wins: w,
      losses: l,
      winRate: total ? Math.round((w / total) * 100) : 0,
    };
  }, [user?.player?.id, matches]);

  const rank: number | undefined = undefined;
  const className = user ? "page-container-no-padding" : "page-container";
  // Состояния: нет пользователя / лоадер / ошибка
  if (!user) {
    return <div className={className}>{mePage.loginRequired}</div>;
  }
  if (loading) {
    return (
      <div className={className}>
        <h1 className="page-title">{mePage.title}</h1>
        <div className="page-content-container">{common.loading}</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={className}>
        <h1 className="page-title">{mePage.title}</h1>
        <div className="page-content-container" style={{ color: "#f04438" }}>
          {mePage.errorPrefix} {error}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <h1 className="page-title">{mePage.title}</h1>
      <UserProfileView
        user={user}
        stats={{ wins, losses, winRate, rank }}
        matches={matches.slice(0, 8)}
      />
    </div>
  );
}
