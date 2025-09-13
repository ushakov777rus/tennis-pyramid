// app/tournaments/TournamentsProvider.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Tournament, TournamentStatus, TournamentCreateInput } from "@/app/models/Tournament";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { useUser } from "@/app/components/UserContext";
import { MatchRepository } from "../repositories/MatchRepository";

type TournamentStats = { participants: number; matches: number };

type TournamentsContextValue = {
  tournaments: Tournament[];
  loading: boolean;
  error: string | null;
  stats: Record<number, TournamentStats>;
  refresh: () => Promise<void>;
  createTournament: (p: TournamentCreateInput) => Promise<void>;
  deleteTournament: (id: number) => Promise<void>;
};

const TournamentsContext = createContext<TournamentsContextValue | undefined>(undefined);

export function TournamentsProvider({ 
  children, clubId } : 
  { children: React.ReactNode; clubId?: number }) {
  const { user } = useUser();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<number, TournamentStats>>({});

  // pending id-шники (для точечного дизейбла кнопок, если нужно)
  const [pendingCreateIds, setPendingCreateIds] = useState<Set<number>>(new Set());
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<number>>(new Set());

  const loadStats = useCallback(async (ids: number[]) => {
    if (!ids.length) return;
    try {
      const map = await TournamentsRepository.loadStats(ids);
      setStats((prev) => ({ ...prev, ...map }));
    } catch (e) {
      console.error("loadStats error:", e);
    }
  }, []);

  // Единая точка полной загрузки списка турниров
  // provider
  const [initialLoaded, setInitialLoaded] = useState(false);

// app/tournaments/TournamentsProvider.tsx

const refresh = useCallback(
  async (opts?: { background?: boolean }) => {
    const background = !!opts?.background && initialLoaded;
    if (!background) setLoading(true);
    setError(null);
    try {
      let list;
      if(clubId)
        list = await TournamentsRepository.loadByClub(clubId);
      else
        list = await TournamentsRepository.loadAll();

      // ⬇️ НЕ ЗАТИРАЕМ оптимистичные элементы (id < 0)
      setTournaments(prev => {
        const optimistic = prev.filter(t => t.id < 0);
        return [...optimistic, ...list];
      });

      void loadStats(list.map((t) => t.id));
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Не удалось загрузить турниры");
    } finally {
      if (!background) setLoading(false);
      setInitialLoaded(true);
    }
  },
  [loadStats, initialLoaded]
);

  // 1) Первая загрузка
  useEffect(() => { void refresh(); }, []);

  // 2) Когда меняется user — рефетч без глобального "Загрузка…"
  useEffect(() => { if (initialLoaded) void refresh({ background: true }); }, [user?.id]);


  // ====== ОПТИМИСТИЧНОЕ СОЗДАНИЕ ТУРНИРА ======
// app/tournaments/TournamentsProvider.tsx

const createTournament = useCallback(async (p: TournamentCreateInput) => {
  const name = p.name.trim();
  if (!name) return;

  const tmpId = -Math.floor(Math.random() * 1e9);
  const optimistic = new Tournament(
    tmpId,
    name,
    p.format,
    p.status ?? TournamentStatus.Draft,
    p.tournament_type,
    p.start_date ?? null,
    p.end_date ?? null,
    p.is_public ?? false,
    p.creator_id,
    p.settings
  );

  setPendingCreateIds(s => new Set(s).add(tmpId));
  setTournaments(prev => [optimistic, ...prev]);
  setStats(prev => ({ ...prev, [tmpId]: { participants: 0, matches: 0 } }));

  try {
    const created = await TournamentsRepository.create({
      name,
      format: p.format,
      tournament_type: p.tournament_type,
      start_date: p.start_date,
      end_date: p.end_date,
      status: p.status ?? TournamentStatus.Draft,
      creator_id: p.creator_id,
      is_public: p.is_public,
      club_id: p.club_id,
      settings: p.settings
    });

    if (created && (created as any).id) {
      const real = created as Tournament;

      // заменяем оптимистичный на реальный
      setTournaments(prev => [real, ...prev.filter(t => t.id !== tmpId)]);

      // переносим/обновляем стату
      setStats(prev => {
        const { [tmpId]: tmpStats, ...rest } = prev;
        return tmpStats ? { ...rest, [real.id]: tmpStats } : rest;
      });

      // ⬇️ тихо дотягиваем всё, что могло установиться на бэке
      void refresh({ background: true });
      void loadStats([real.id]);

    } else {
      // если репозиторий не вернул объект — полная синхронизация
      await refresh();
    }
  } catch (e) {
    console.error("createTournament error:", e);
    // откат оптимистичного
    setTournaments(prev => prev.filter(t => t.id !== tmpId));
    setStats(prev => {
      const { [tmpId]: _omit, ...rest } = prev;
      return rest;
    });
    throw e;
  } finally {
    setPendingCreateIds(s => {
      const n = new Set(s);
      n.delete(tmpId);
      return n;
    });
  }
}, [refresh, loadStats]);

  // ====== ОПТИМИСТИЧНОЕ УДАЛЕНИЕ ТУРНИРА ======
  const deleteTournament = useCallback(async (id: number) => {
    // 1) оптимистично убираем турнир из списка и стату
    const prevList = tournaments;
    const prevStats = stats;

    setPendingDeleteIds((s) => new Set(s).add(id));
    setTournaments((prev) => prev.filter((t) => t.id !== id));
    setStats((prev) => {
      const { [id]: _omit, ...rest } = prev;
      return rest;
    });

    try {
      // 2) удаляем связанные матчи и сам турнир
      await MatchRepository.deleteTournamentMatches(id);
      await TournamentsRepository.delete(id);
      // 3) тут ничего не делаем — состояние уже актуально
    } catch (e) {
      // 4) откат при ошибке
      console.error("deleteTournament error:", e);
      setTournaments(prevList);
      setStats(prevStats);
      throw e;
    } finally {
      setPendingDeleteIds((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }
  }, [tournaments, stats]);

  const value = useMemo(() => ({
    tournaments,
    loading,
    error,
    stats,
    refresh,
    createTournament,
    deleteTournament,
  }), [tournaments, loading, error, stats, refresh, createTournament, deleteTournament]);

  return <TournamentsContext.Provider value={value}>{children}</TournamentsContext.Provider>;
}

export function useTournaments() {
  const ctx = useContext(TournamentsContext);
  if (!ctx) throw new Error("useTournaments must be used within <TournamentsProvider>");
  return ctx;
}