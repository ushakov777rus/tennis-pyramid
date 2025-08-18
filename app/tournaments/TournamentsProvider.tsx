// app/tournaments/TournamentsProvider.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { Tournament, TournamentStatus, TournamentFormat, TournamentType } from "@/app/models/Tournament";

import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { useUser } from "@/app/components/UserContext";


type TournamentStats = { participants: number; matches: number };

// 👇 Единый тип для createTournament
type NewTournamentPayload = {
  name: string;
  format: TournamentFormat;
  tournament_type: TournamentType;
  start_date: string | null;
  end_date: string | null;
  status: TournamentStatus; // ← опционально
  creator_id: number;
};

type TournamentsContextValue = {
  tournaments: Tournament[];
  loading: boolean;
  error: string | null;
  stats: Record<number, TournamentStats>;

  refresh: () => Promise<void>;
  createTournament: (p: NewTournamentPayload) => Promise<void>; // ← используем единый тип
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

  const refresh = useCallback(async (uid?: number) => {
    setLoading(true);
    setError(null);
    try {
      if (!uid) { setTournaments([]); setStats({}); return; }
      const list = await TournamentsRepository.loadAccessible(uid);
      setTournaments(list);
      void loadStats(list.map(t => t.id));
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Не удалось загрузить турниры");
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  useEffect(() => {
    void refresh(user?.id);    // 👈 передаём актуальный id
  }, [refresh, user?.id]);

  useEffect(() => { void refresh(); }, [refresh]);

  // 👇 status опционален. Дефолт "draft" проставляем здесь.
  const createTournament = useCallback(async (p: NewTournamentPayload) => {
    if (!p.name.trim()) return;
    await TournamentsRepository.create({
      name: p.name.trim(),
      format: p.format,
      tournament_type: p.tournament_type,
      start_date: p.start_date,
      end_date: p.end_date,
      status: p.status ?? TournamentStatus.Draft, // ← дефолт
      creator_id: p.creator_id,
    });
    await refresh();
  }, [refresh]);

  const deleteTournament = useCallback(async (id: number) => {
    await TournamentsRepository.delete(id);
    setTournaments(prev => prev.filter(t => t.id !== id));
    setStats(prev => { const { [id]: _, ...rest } = prev; return rest; });
  }, []);

  const value = useMemo(() => ({
    tournaments, loading, error, stats, refresh, createTournament, deleteTournament
  }), [tournaments, loading, error, stats, refresh, createTournament, deleteTournament]);

  return <TournamentsContext.Provider value={value}>{children}</TournamentsContext.Provider>;
}

export function useTournaments() {
  const ctx = useContext(TournamentsContext);
  if (!ctx) throw new Error("useTournaments must be used within <TournamentsProvider>");
  return ctx;
}