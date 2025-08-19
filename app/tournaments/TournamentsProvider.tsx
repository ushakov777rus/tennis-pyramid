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

export function TournamentsProvider({ children }: { children: React.ReactNode }) {
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

  const refresh = useCallback(
    async (opts?: { background?: boolean }) => {
      const background = !!opts?.background && initialLoaded;
      if (!background) setLoading(true);
      setError(null);
      try {
        const uid = user?.id;
        const list = await TournamentsRepository.loadAccessible(user?.id, user?.role);
        setTournaments(list);
        void loadStats(list.map((t) => t.id));
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? "Не удалось загрузить турниры");
      } finally {
        if (!background) setLoading(false);
        setInitialLoaded(true);
      }
    },
    [loadStats, user?.id, initialLoaded]
  );

  // 1) Первая загрузка
  useEffect(() => { void refresh(); }, []);

  // 2) Когда меняется user — рефетч без глобального "Загрузка…"
  useEffect(() => { if (initialLoaded) void refresh({ background: true }); }, [user?.id]);


  // ====== ОПТИМИСТИЧНОЕ СОЗДАНИЕ ТУРНИРА ======
  const createTournament = useCallback(async (p: TournamentCreateInput) => {
    const name = p.name.trim();
    if (!name) return;

    // 1) оптимистично добавляем «временный» турнир с отрицательным id
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
    );

    setPendingCreateIds((s) => new Set(s).add(tmpId));
    setTournaments((prev) => [optimistic, ...prev]);
    // сразу положим пустую стату, чтобы UI не прыгал
    setStats((prev) => ({ ...prev, [tmpId]: { participants: 0, matches: 0 } }));

    try {
      // 2) создаём на бэке (желательно, чтобы репозиторий вернул созданный Tournament)
      const created = await TournamentsRepository.create({
        name,
        format: p.format,
        tournament_type: p.tournament_type,
        start_date: p.start_date,
        end_date: p.end_date,
        status: p.status ?? TournamentStatus.Draft,
        creator_id: p.creator_id ?? user?.id,
        is_public: p.is_public,
      });

      // Если create возвращает id/объект — заменяем оптимистичный элемент на реальный
      if (created && (created as any).id) {
        const real = created as Tournament;
        setTournaments((prev) => [real, ...prev.filter((t) => t.id !== tmpId)]);
        // переносим стату на реальный id
        setStats((prev) => {
          const { [tmpId]: tmpStats, ...rest } = prev;
          return tmpStats ? { ...rest, [real.id]: tmpStats } : rest;
        });
        // дотягиваем актуальную стату по реальному id
        void loadStats([real.id]);
      } else {
        // Если create ничего не возвращает — на всякий случай синхронизируемся полностью
        await refresh();
      }
    } catch (e) {
      // 3) откат оптимистичного элемента
      console.error("createTournament error:", e);
      setTournaments((prev) => prev.filter((t) => t.id !== tmpId));
      setStats((prev) => {
        const { [tmpId]: _omit, ...rest } = prev;
        return rest;
      });
      throw e;
    } finally {
      setPendingCreateIds((s) => {
        const n = new Set(s);
        n.delete(tmpId);
        return n;
      });
    }
  }, [user?.id, refresh, loadStats]);

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
    // при желании можно экспортировать pending наборы
    // pendingCreateIds,
    // pendingDeleteIds,
  }), [tournaments, loading, error, stats, refresh, createTournament, deleteTournament]);

  return <TournamentsContext.Provider value={value}>{children}</TournamentsContext.Provider>;
}

export function useTournaments() {
  const ctx = useContext(TournamentsContext);
  if (!ctx) throw new Error("useTournaments must be used within <TournamentsProvider>");
  return ctx;
}