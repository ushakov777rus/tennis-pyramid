// app/tournaments/TournamentsProvider.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Tournament, TournamentStatus, TournamentCreateInput } from "@/app/models/Tournament";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { useUser } from "@/app/components/UserContext";
import { MatchRepository } from "../repositories/MatchRepository";
import { useDictionary } from "@/app/components/LanguageProvider";

type TournamentStats = { participants: number; matches: number };

type TournamentsContextValue = {
  tournaments: Tournament[];
  loading: boolean;
  error: string | null;
  stats: Record<number, TournamentStats>;
  refresh: () => Promise<void>;
  createTournament: (p: TournamentCreateInput) => Promise<void>;
  deleteTournament: (id: number) => Promise<void>;
  updateTournamentStatus: (id: number, status: TournamentStatus) => Promise<void>;
};

const TournamentsContext = createContext<TournamentsContextValue | undefined>(undefined);

export function TournamentsProvider({ 
  children, clubId } : 
  { children: React.ReactNode; clubId?: number }) {
  const { user } = useUser();
  const { tournaments: tournamentsText } = useDictionary();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<number, TournamentStats>>({});
  
  // Флаг для отслеживания первой загрузки
  const [initialLoaded, setInitialLoaded] = useState(false);
  // Флаг для предотвращения параллельных запросов
  const [isFetching, setIsFetching] = useState(false);

  // Загрузка статистики - мемоизирована без зависимостей
  const loadStats = useCallback(async (ids: number[]) => {
    if (!ids.length) return;
    try {
      console.log("Tournaments provider, load stats for tournaments", ids);
      const map = await TournamentsRepository.loadStats(ids);
      setStats((prev) => ({ ...prev, ...map }));
    } catch (e) {
      console.error("loadStats error:", e);
    }
  }, []);

  // Основная функция загрузки турниров
  const refresh = useCallback(
    async (opts?: { background?: boolean }) => {
      // Предотвращаем параллельные запросы
      if (isFetching && !opts?.background) return;
      
      const background = !!opts?.background && initialLoaded;
      
      if (!background) {
        setLoading(true);
        setIsFetching(true);
      }
      
      setError(null);
      
      try {
        let list;
        if (clubId) {
          console.log("Tournaments provider, load tournaments for club", clubId);
          list = await TournamentsRepository.loadByClub(clubId);
        } else {
          console.log("Tournaments provider, load all tournaments");
          list = await TournamentsRepository.loadAll();
        }

        // Сохраняем оптимистичные элементы (id < 0)
        setTournaments(prev => {
          const optimistic = prev.filter(t => t.id < 0);
          return [...optimistic, ...list];
        });

        // Загружаем статистику один раз
        await loadStats(list.map((t) => t.id));
        
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? tournamentsText.provider.loadFailed);
      } finally {
        if (!background) {
          setLoading(false);
          setIsFetching(false);
        }
        setInitialLoaded(true);
      }
    },
    [clubId, loadStats, initialLoaded, isFetching, tournamentsText.provider.loadFailed]
  );

  // ЕДИНСТВЕННЫЙ эффект для первоначальной загрузки
  useEffect(() => {
    // Загружаем только если еще не загружали
    if (!initialLoaded && !isFetching) {
      void refresh();
    }
  }, [initialLoaded, isFetching, refresh]);

  // Фоновая синхронизация при смене пользователя (только после первоначальной загрузки)
  useEffect(() => {
    if (initialLoaded && user?.id) {
      void refresh({ background: true });
    }
  }, [user?.id, initialLoaded, refresh]);

  // Оптимистичное создание турнира
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
      "SLUG",
      p.club,
      p.settings,
      null,
      p.regulation ?? null
    );

    // Оптимистичное обновление UI
    setTournaments(prev => [optimistic, ...prev]);
    setStats(prev => ({ ...prev, [tmpId]: { participants: 0, matches: 0 } }));

    try {
      const created = await TournamentsRepository.createNewTournament({
        name,
        format: p.format,
        tournament_type: p.tournament_type,
        start_date: p.start_date,
        end_date: p.end_date,
        status: p.status ?? TournamentStatus.Draft,
        creator_id: p.creator_id,
        is_public: p.is_public,
        club: p.club,
        settings: p.settings,
        regulation: p.regulation ?? null,
      });

      if (created && (created as any).id) {
        const real = created as Tournament;

        // Заменяем оптимистичный на реальный
        setTournaments(prev => [real, ...prev.filter(t => t.id !== tmpId)]);

        // Переносим статистику
        setStats(prev => {
          const { [tmpId]: tmpStats, ...rest } = prev;
          return tmpStats ? { ...rest, [real.id]: tmpStats } : rest;
        });

        // Дополняем статистику для нового турнира
        void loadStats([real.id]);

      } else {
        // Полная синхронизация если не получили объект
        await refresh();
      }
    } catch (e) {
      console.error("createTournament error:", e);
      // Откат при ошибке
      setTournaments(prev => prev.filter(t => t.id !== tmpId));
      setStats(prev => {
        const { [tmpId]: _omit, ...rest } = prev;
        return rest;
      });
      throw e;
    }
  }, [loadStats, refresh]);

  // Оптимистичное удаление турнира
  const deleteTournament = useCallback(async (id: number) => {
    // Сохраняем состояние для отката
    const prevList = tournaments;
    const prevStats = stats;

    // Оптимистичное обновление
    setTournaments((prev) => prev.filter((t) => t.id !== id));
    setStats((prev) => {
      const { [id]: _omit, ...rest } = prev;
      return rest;
    });

    try {
      // Удаляем на сервере
      await MatchRepository.deleteTournamentMatches(id);
      await TournamentsRepository.delete(id);
      // Состояние уже актуально
    } catch (e) {
      // Откат при ошибке
      console.error("deleteTournament error:", e);
      setTournaments(prevList);
      setStats(prevStats);
      throw e;
    }
  }, [stats, tournaments]);

  // Обновление статуса турнира
  const updateTournamentStatus = useCallback(async (id: number, status: TournamentStatus) => {
    const target = tournaments.find((t) => t.id === id);
    if (!target) return;

    // Оптимистичное обновление
    const optimistic = new Tournament(
      target.id,
      target.name,
      target.format,
      status,
      target.tournament_type,
      target.start_date,
      target.end_date,
      target.is_public,
      target.creator_id,
      target.slug,
      target.club,
      target.settings,
      target.ownerToken ?? null,
      target.regulation ?? null
    );

    setTournaments((prev) => prev.map((t) => (t.id === id ? optimistic : t)));

    try {
      const updated = await TournamentsRepository.updateStatus(id, status);
      if (updated) {
        setTournaments((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } else {
        // Синхронизация если не получили обновленный объект
        await refresh({ background: true });
      }
    } catch (e) {
      console.error("updateTournamentStatus error:", e);
      // Откат при ошибке
      setTournaments((prev) => prev.map((t) => (t.id === id ? target : t)));
      throw e;
    }
  }, [tournaments, refresh]);

  // Мемоизация значения контекста
  const value = useMemo(() => ({
    tournaments,
    loading,
    error,
    stats,
    refresh,
    createTournament,
    deleteTournament,
    updateTournamentStatus,
  }), [tournaments, loading, error, stats, refresh, createTournament, deleteTournament, updateTournamentStatus]);

  return <TournamentsContext.Provider value={value}>{children}</TournamentsContext.Provider>;
}

export function useTournaments() {
  const ctx = useContext(TournamentsContext);
  if (!ctx) throw new Error("useTournaments must be used within <TournamentsProvider>");
  return ctx;
}
