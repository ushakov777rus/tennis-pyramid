"use client";

import { useEffect, useMemo, useState } from "react";

import { MatchRepository } from "@/app/repositories/MatchRepository";
import { Match } from "@/app/models/Match";

import "@/app/components/matches/MatchHistoryView.css";
import { UserProfileView } from "../components/UserProfileView";
import { User } from "../models/Users";
import { UsersRepository } from "../repositories/UsersRepository";
import { useUser } from "../components/UserContext";

export default function MatchListView() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // 1) находим Player по userId
        let p: User | null = null;

        if ((UsersRepository as any).findByUserId) {
          p = await (UsersRepository as any).findByUserId(user?.id);
        }

        if (!p) {
          throw new Error("Игрок с таким пользователем не найден");
        }

        // 2) подтягиваем матчи игрока
        let ms: Match[] = [];
        if ((MatchRepository as any).loadForPlayer) {
          ms = await (MatchRepository as any).loadForPlayer(p.id);
        } else {
          ms = await (MatchRepository as any).loadByPlayerId(p.id);
        }

        // сортируем по дате убыв.
        ms.sort((a, b) => {
          const ad = a.date ? new Date(a.date as any).getTime() : 0;
          const bd = b.date ? new Date(b.date as any).getTime() : 0;
          return bd - ad;
        });

        if (!cancelled) {
          
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
  }, []);

  const { wins, losses, winRate } = useMemo(() => {
    if (!user) return { wins: 0, losses: 0, winRate: 0 };
    let w = 0, l = 0;
    for (const m of matches) {
      if (m.getWinnerId() === user.id) w++; else l++;
    }
    const total = w + l;
    return {
      wins: w,
      losses: l,
      winRate: total ? Math.round((w / total) * 100) : 0,
    };
  }, [user, matches]);

  // TODO: если у тебя есть система рангов — подставь реальный rank
  const rank: number | undefined = undefined;

  if (!user) return null;


  return (
    <div className="page-container">
      <h1 className="page-title">{user.name}</h1>

      <div className="page-content-container">
        <UserProfileView
          user={user}
          stats={{ wins, losses, winRate, rank }}
          recentMatches={matches.slice(0, 8)}
        />
      </div>
    </div>
  );
}


