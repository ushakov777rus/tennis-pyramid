// app/tournaments/TournamentsProvider.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"; // react hooks
import { Tournament, TournamentStatus, TournamentCreateInput } from "@/app/models/Tournament"; // tournament models
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository"; // tournaments repository
import { useUser } from "@/app/components/UserContext"; // user context
import { MatchRepository } from "../repositories/MatchRepository"; // matches repository
import { useDictionary } from "@/app/components/LanguageProvider"; // dictionary hook

type TournamentStats = { participants: number; matches: number }; // stats shape

type TournamentsContextValue = { // context value shape
  tournaments: Tournament[]; // tournaments list
  loading: boolean; // loading flag
  error: string | null; // error message
  stats: Record<number, TournamentStats>; // stats map
  refresh: () => Promise<void>; // reload handler
  createTournament: (p: TournamentCreateInput) => Promise<void>; // create handler
  deleteTournament: (id: number) => Promise<void>; // delete handler
  updateTournamentStatus: (id: number, status: TournamentStatus) => Promise<void>; // status update handler
}; // end TournamentsContextValue

const TournamentsContext = createContext<TournamentsContextValue | undefined>(undefined); // context instance

type TournamentsProviderProps = { // provider props
  children: React.ReactNode; // child nodes
  clubId?: number; // optional club filter
  autoLoad?: boolean; // should auto-load data
  initialTournaments?: Tournament[]; // initial tournaments list
  initialStats?: Record<number, TournamentStats>; // initial stats map
  page?: number; // optional page number
  pageSize?: number; // optional page size
}; // end TournamentsProviderProps

export function TournamentsProvider({ // tournaments provider
  children, // provider children
  clubId, // optional club id
  autoLoad = true, // auto-load toggle
  initialTournaments, // initial tournaments list
  initialStats, // initial stats map
  page, // page number
  pageSize, // page size
} : TournamentsProviderProps) { // end props
  const { user } = useUser(); // current user
  const { tournaments: tournamentsText } = useDictionary(); // tournaments dictionary
  const hasInitial = initialTournaments !== undefined; // initial data flag
  const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments ?? []); // tournaments state
  const [loading, setLoading] = useState(!hasInitial); // loading state
  const [error, setError] = useState<string | null>(null); // error state
  const [stats, setStats] = useState<Record<number, TournamentStats>>(initialStats ?? {}); // stats state
  
  // Флаг для отслеживания первой загрузки
  const [initialLoaded, setInitialLoaded] = useState(hasInitial); // initial load flag
  // Флаг для предотвращения параллельных запросов
  const [isFetching, setIsFetching] = useState(false); // request guard

  // Загрузка статистики - мемоизирована без зависимостей
  const loadStats = useCallback(async (ids: number[]) => { // stats loader
    if (!ids.length) return; // skip empty ids
    try { // stats fetch guard
      console.log("Tournaments provider, load stats for tournaments", ids); // debug stats request
      const map = await TournamentsRepository.loadStats(ids); // load stats map
      setStats((prev) => ({ ...prev, ...map })); // merge stats into state
    } catch (e) { // handle stats errors
      console.error("loadStats error:", e); // log stats errors
    } // end stats error handling
  }, []); // memoize stats loader

  // Основная функция загрузки турниров
  const refresh = useCallback( // refresh tournaments list
    async (opts?: { background?: boolean }) => { // refresh options
      // Предотвращаем параллельные запросы
      if (isFetching && !opts?.background) return; // skip duplicate requests
      const background = !!opts?.background && initialLoaded; // background flag
      if (!background) { // mark loading state for foreground refresh
        setLoading(true); // set loading
        setIsFetching(true); // set fetching guard
      } // end loading state
      setError(null); // reset error
      try { // refresh try block
        let list: Tournament[]; // list placeholder
        if (page && pageSize) { // use paginated load when page is provided
          const pageResult = await TournamentsRepository.loadPage(page, pageSize, clubId); // load paginated list
          list = pageResult.tournaments; // extract tournaments list
        } else if (clubId) { // club-specific list
          list = await TournamentsRepository.loadByClub(clubId); // load by club
        } else { // global list
          list = await TournamentsRepository.loadAll(); // load all tournaments
        } // end list selection
        // Сохраняем оптимистичные элементы (id < 0)
        setTournaments(prev => { // update tournaments with optimistic items
          const optimistic = prev.filter(t => t.id < 0); // keep optimistic items
          return [...optimistic, ...list]; // merge lists
        }); // end setTournaments
        // Загружаем статистику один раз
        await loadStats(list.map((t) => t.id)); // fetch stats for current list
      } catch (e: any) { // refresh error handling
        console.error(e); // log error
        setError(e?.message ?? tournamentsText.provider.loadFailed); // set error message
      } finally { // finalize refresh
        if (!background) { // reset flags for foreground refresh
          setLoading(false); // stop loading
          setIsFetching(false); // clear fetching guard
        } // end foreground reset
        setInitialLoaded(true); // mark as loaded
      } // end refresh finalize
    }, // end refresh callback
    [clubId, loadStats, initialLoaded, isFetching, tournamentsText.provider.loadFailed, page, pageSize] // refresh deps
  ); // end refresh

  // ЕДИНСТВЕННЫЙ эффект для первоначальной загрузки
  useEffect(() => { // auto-load effect
    // Загружаем только если еще не загружали
    if (autoLoad && !initialLoaded && !isFetching) { // gate auto load
      void refresh(); // trigger refresh
    } // end auto load guard
  }, [autoLoad, initialLoaded, isFetching, refresh]); // auto-load deps

  // Фоновая синхронизация при смене пользователя (только после первоначальной загрузки)
  useEffect(() => { // background sync effect
    if (autoLoad && initialLoaded && user?.id) { // sync only when auto-load enabled
      void refresh({ background: true }); // background refresh
    } // end background sync guard
  }, [user?.id, initialLoaded, refresh, autoLoad]); // background sync deps

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
  const updateTournamentStatus = useCallback(async (id: number, status: TournamentStatus) => { // update tournament status
    const target = tournaments.find((t) => t.id === id); // find target in state
    if (!target) { // fallback when target is not in local list
      await TournamentsRepository.updateStatus(id, status); // update directly in repository
      return; // exit when list is not hydrated
    } // end missing target guard

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
  }, [tournaments, refresh]); // update status deps

  // Мемоизация значения контекста
  const value = useMemo(() => ({ // memoized context value
    tournaments, // tournaments list
    loading, // loading state
    error, // error message
    stats, // stats map
    refresh, // refresh handler
    createTournament, // create handler
    deleteTournament, // delete handler
    updateTournamentStatus, // update handler
  }), [tournaments, loading, error, stats, refresh, createTournament, deleteTournament, updateTournamentStatus]); // memo deps

  return <TournamentsContext.Provider value={value}>{children}</TournamentsContext.Provider>; // provider render
}

export function useTournaments() { // hook to access tournaments context
  const ctx = useContext(TournamentsContext); // read context
  if (!ctx) throw new Error("useTournaments must be used within <TournamentsProvider>"); // enforce provider
  return ctx; // return context value
} // end useTournaments
