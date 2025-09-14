// app/clubs/ClubsProvider.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ClubsRepository } from "@/app/repositories/ClubsRepository";
import type { ClubCreateInput } from "@/app/models/Club";
import type { Club } from "../models/Club";
import { useUser } from "../components/UserContext";

type ClubsContextValue = {
  clubs: Club[];
  loading: boolean;
  error: string | null;
  refresh: (opts?: { background?: boolean }) => Promise<void>;
  createClub: (p: ClubCreateInput) => Promise<Club>;
  deleteClub: (id: number) => Promise<void>;
  initialLoaded: boolean;
};

const ClubsContext = createContext<ClubsContextValue | undefined>(undefined);

export function ClubsProvider({
  children,
  creatorId,
}: {
  children: React.ReactNode;
  creatorId: number | null;
}) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const { user } = useUser();

const refresh = useCallback(async (opts?: { background?: boolean }) => {
  const bg = !!opts?.background;
  if (!bg) setLoading(true);
  setError(null);

  try {
    console.log("Загрузка клубов для creatorId:", creatorId);
    const response = creatorId
      ? await ClubsRepository.getByCreatorId(creatorId)
      : await ClubsRepository.loadAll();

    console.log("Загруженные клубы:", response);
    
    // Обрабатываем случай, когда возвращается один объект вместо массива
    let clubsList: Club[] = [];
    if (Array.isArray(response)) {
      clubsList = response;
    } else if (response && typeof response === 'object') {
      // Если возвращается один клуб как объект, создаем массив из него
      clubsList = [response];
    }

    console.log("Преобразованные клубы:", clubsList);
    setClubs(clubsList);
  } catch (e: any) {
    console.error("Ошибка загрузки:", e);
    setError(e?.message ?? "Не удалось загрузить клубы");
  } finally {
    if (!bg) setLoading(false);
    setInitialLoaded(true);
  }
}, [creatorId]);

  // Загружаем при маунте и на смену creatorId
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createClub = useCallback(
    async (p: ClubCreateInput): Promise<Club> => {
      if (!user) throw new Error("Нужно войти в систему, чтобы создать клуб.");

      const payload: ClubCreateInput = { ...p, director_id: user.id };

      const tmpId = -Math.floor(Math.random() * 1e9);
      const optimistic: Club = {
        id: tmpId,
        director_id: user.id,
        slug: p.name, // TODO: нормализовать slug
        name: p.name,
        description: p.description ?? null,
        city: p.city ?? null,
        logo_url: p.logo_url ?? null,
        members_count: 0,
        tournaments_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setClubs((prev) => [optimistic, ...prev]);

      try {
        const real = await ClubsRepository.createNewClub(payload);
        setClubs((prev) => [real, ...prev.filter((c) => c.id !== tmpId)]);
        return real;
      } catch (e) {
        console.error("createClub error:", e);
        setClubs((prev) => prev.filter((c) => c.id !== tmpId));
        throw e;
      }
    },
    [user]
  );

  const deleteClub = useCallback(
    async (id: number) => {
      const snapshot = clubs;
      setClubs((prev) => prev.filter((c) => c.id !== id));
      try {
        await ClubsRepository.delete(id);
      } catch (e) {
        console.error("deleteClub error:", e);
        setClubs(snapshot);
        throw e;
      }
    },
    [clubs]
  );

  const value = useMemo<ClubsContextValue>(
    () => ({
      clubs,
      loading,
      error,
      refresh,
      createClub,
      deleteClub,
      initialLoaded,
    }),
    [clubs, loading, error, refresh, createClub, deleteClub, initialLoaded]
  );

  return <ClubsContext.Provider value={value}>{children}</ClubsContext.Provider>;
}

export function useClubs() {
  const ctx = useContext(ClubsContext);
  if (!ctx) throw new Error("useClubs must be used within <ClubsProvider>");
  return ctx;
}