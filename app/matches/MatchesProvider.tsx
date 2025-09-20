"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Match } from "@/app/models/Match";
import { MatchRepository } from "@/app/repositories/MatchRepository";

type MatchesContextValue = {
  matches: Match[];
  loading: boolean;
  error: string | null;
  initialLoaded: boolean;
  refresh: (opts?: { background?: boolean }) => Promise<void>;
  updateMatch: (match: Match) => Promise<void>;
  deleteMatch: (match: Match) => Promise<void>;
};

const MatchesContext = createContext<MatchesContextValue | undefined>(undefined);

export function MatchesProvider({ children }: { children: React.ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoaded, setInitialLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const matchesRef = useRef<Match[]>([]);
  useEffect(() => {
    matchesRef.current = matches;
  }, [matches]);

  const refresh = useCallback(async (opts?: { background?: boolean }) => {
    const background = !!opts?.background;
    if (!background) setLoading(true);
    setError(null);

    try {
      const list = await MatchRepository.loadAll();
      setMatches(list);
    } catch (e: any) {
      console.error("MatchesProvider.refresh error", e);
      setError(e?.message ?? "Не удалось загрузить матчи");
    } finally {
      if (!background) setLoading(false);
      setInitialLoaded(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateMatch = useCallback(async (updated: Match) => {
    const snapshot = matchesRef.current;
    setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));

    try {
      const saved = await MatchRepository.updateMatch(updated);
      setMatches((prev) => prev.map((m) => (m.id === saved.id ? saved : m)));
    } catch (e) {
      console.error("MatchesProvider.updateMatch error", e);
      setMatches([...snapshot]);
      throw e;
    }
  }, []);

  const deleteMatch = useCallback(async (match: Match) => {
    const snapshot = matchesRef.current;
    setMatches((prev) => prev.filter((m) => m.id !== match.id));

    try {
      const ok = await MatchRepository.deleteMatch(match);
      if (!ok) throw new Error("deleteMatch failed");
    } catch (e) {
      console.error("MatchesProvider.deleteMatch error", e);
      setMatches([...snapshot]);
      throw e;
    }
  }, []);

  const value = useMemo<MatchesContextValue>(
    () => ({ matches, loading, error, initialLoaded, refresh, updateMatch, deleteMatch }),
    [matches, loading, error, initialLoaded, refresh, updateMatch, deleteMatch]
  );

  return <MatchesContext.Provider value={value}>{children}</MatchesContext.Provider>;
}

export function useMatches() {
  const ctx = useContext(MatchesContext);
  if (!ctx) throw new Error("useMatches must be used within <MatchesProvider>");
  return ctx;
}
