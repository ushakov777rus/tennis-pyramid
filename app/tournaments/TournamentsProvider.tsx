// app/tournaments/TournamentsProvider.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Tournament, TournamentStatus, TournamentCreateInput } from "@/app/models/Tournament";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { useUser } from "@/app/components/UserContext";

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

  const loadStats = useCallback(async (ids: number[]) => {
    if (!ids.length) { setStats({}); return; }
    try {
      const map = await TournamentsRepository.loadStats(ids);
      setStats(map);
    } catch (e) {
      console.error("loadStats error:", e);
    }
  }, []);

  // единая точка обновления списка турниров
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const uid = user?.id;
      if (!uid) {
        setTournaments([]);
        setStats({});
        return;
      }
      const list = await TournamentsRepository.loadAccessible(uid);
      setTournaments(list);
      void loadStats(list.map((t) => t.id));
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Не удалось загрузить турниры");
    } finally {
      setLoading(false);
    }
  }, [loadStats, user?.id]);

  // загружаем/очищаем при смене пользователя
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createTournament = useCallback(async (p: TournamentCreateInput) => {
    const name = p.name.trim();
    if (!name) return;
    await TournamentsRepository.create({
      name,
      format: p.format,
      tournament_type: p.tournament_type,
      start_date: p.start_date,
      end_date: p.end_date,
      status: p.status ?? TournamentStatus.Draft,  // дефолт
      creator_id: p.creator_id,
      is_public: p.is_public
    });
    await refresh(); // перезагрузим список с актуальным user?.id
  }, [refresh]);

  const deleteTournament = useCallback(async (id: number) => {
    await TournamentsRepository.delete(id);
    setTournaments((prev) => prev.filter((t) => t.id !== id));
    setStats((prev) => { const { [id]: _omit, ...rest } = prev; return rest; });
  }, []);

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