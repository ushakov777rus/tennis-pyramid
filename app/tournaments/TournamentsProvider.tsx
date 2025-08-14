"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { Tournament } from "@/app/models/Tournament";

type NewTournamentPayload = {
  name: string;
  tournament_type: "single" | "double";
  start_date: string | null;
  end_date: string | null;
  status?: Tournament["status"];
};

type TournamentsContextValue = {
  tournaments: Tournament[];
  loading: boolean;
  error: string | null;

  // actions
  refresh: () => Promise<void>;
  createTournament: (payload: NewTournamentPayload) => Promise<void>;
  deleteTournament: (id: number) => Promise<void>;
};

const TournamentsContext = createContext<TournamentsContextValue | undefined>(undefined);

export function TournamentsProvider({ children }: { children: React.ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await TournamentsRepository.loadAll();
      setTournaments(list);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Не удалось загрузить турниры");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createTournament = useCallback(
    async (payload: NewTournamentPayload) => {
      if (!payload.name.trim()) return;

      // оптимистично добавим черновик
      const tempId = -(Date.now());
      const optimistic: Tournament = new Tournament(
        tempId,
        payload.name.trim(),
        "round_robin",
        payload.status ?? "draft",
        payload.tournament_type,
        payload.start_date,
        payload.end_date,
      );

      setTournaments((prev) => [optimistic, ...prev]);
      try {
        await TournamentsRepository.create({
          name: optimistic.name,
          tournament_type: optimistic.tournament_type,
          start_date: optimistic.start_date,
          end_date: optimistic.end_date,
          status: optimistic.status,
          format: optimistic.format
        });
        await refresh();
      } catch (e) {
        console.error(e);
        setTournaments((prev) => prev.filter((t) => t.id !== tempId));
        throw e;
      }
    },
    [refresh]
  );

  const deleteTournament = useCallback(
    async (id: number) => {
      const prev = tournaments;
      setTournaments((list) => list.filter((t) => t.id !== id));
      try {
        await TournamentsRepository.delete(id);
      } catch (e) {
        console.error(e);
        // откат
        setTournaments(prev);
        throw e;
      }
    },
    [tournaments]
  );

  const value = useMemo(
    () => ({ tournaments, loading, error, refresh, createTournament, deleteTournament }),
    [tournaments, loading, error, refresh, createTournament, deleteTournament]
  );

  return <TournamentsContext.Provider value={value}>{children}</TournamentsContext.Provider>;
}

export function useTournaments() {
  const ctx = useContext(TournamentsContext);
  if (!ctx) throw new Error("useTournaments must be used within <TournamentsProvider>");
  return ctx;
}