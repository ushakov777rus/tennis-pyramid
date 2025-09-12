"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ClubsRepository, ClubCreateInput } from "@/app/repositories/ClubRepository";
import { Club } from "../models/Club";

type ClubsContextValue = {
  clubs: Club[];
  loading: boolean;
  error: string | null;
  refresh: (opts?: { background?: boolean }) => Promise<void>;
  createClub: (p: ClubCreateInput) => Promise<void>;
  deleteClub: (id: number) => Promise<void>;
};

const ClubsContext = createContext<ClubsContextValue | undefined>(undefined);

export function ClubsProvider({ children }: { children: React.ReactNode }) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const refresh = useCallback(async (opts?: { background?: boolean }) => {
    const bg = !!opts?.background && initialLoaded;
    if (!bg) setLoading(true);
    setError(null);
    try {
      const list = await ClubsRepository.loadAll();
      setClubs(list);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Не удалось загрузить клубы");
    } finally {
      if (!bg) setLoading(false);
      setInitialLoaded(true);
    }
  }, [initialLoaded]);

  useEffect(() => { void refresh(); }, [refresh]);

  const createClub = useCallback(async (p: ClubCreateInput) => {
    // простой optimistic: добавим заглушку
    const tmpId = -Math.floor(Math.random() * 1e9);
    const optimistic: Club = {
      id: tmpId,
      slug: p.name, //TODO нужно что то сделать
      name: p.name,
      description: p.description ?? null,
      city: p.city ?? null,
      logo_url: p.logo_url ?? null,
      members_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setClubs(prev => [optimistic, ...prev]);
    try {
      const real = await ClubsRepository.create(p);
      setClubs(prev => [real, ...prev.filter(c => c.id !== tmpId)]);
    } catch (e) {
      console.error("createClub error:", e);
      setClubs(prev => prev.filter(c => c.id !== tmpId));
      throw e;
    }
  }, []);

  const deleteClub = useCallback(async (id: number) => {
    const snap = clubs;
    setClubs(prev => prev.filter(c => c.id !== id));
    try {
      await ClubsRepository.delete(id);
    } catch (e) {
      console.error("deleteClub error:", e);
      setClubs(snap); // откат
      throw e;
    }
  }, [clubs]);

  const value = useMemo(() => ({
    clubs, loading, error, refresh, createClub, deleteClub
  }), [clubs, loading, error, refresh, createClub, deleteClub]);

  return <ClubsContext.Provider value={value}>{children}</ClubsContext.Provider>;
}

export function useClubs() {
  const ctx = useContext(ClubsContext);
  if (!ctx) throw new Error("useClubs must be used within <ClubsProvider>");
  return ctx;
}