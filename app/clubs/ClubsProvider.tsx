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
import type { Club } from "@/app/models/Club";
import { useUser } from "@/app/components/UserContext";
import { UserRole } from "@/app/models/Users";

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

export function ClubsProvider({ children }: { children: React.ReactNode }) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);

  // берём текущего пользователя из контекста
  const { user } = useUser();

  /**
   * Загружаем список клубов.
   * Если передан { background: true } — не показываем общий лоадер (для тихих обновлений).
   * Источник данных зависит от роли пользователя:
   * - TournamentAdmin → клубы, созданные этим пользователем
   * - Player → клубы, в которых состоит игрок
   * - гость/прочее → все клубы
   */
  const refresh = useCallback(
    async (opts?: { background?: boolean }) => {
      const bg = !!opts?.background;
      if (!bg) setLoading(true);
      setError(null);

      try {
        let loadedClubs: Club[] | Club | null = [];

        if (user?.role === UserRole.TournamentAdmin) {
          // клубы, которые создал организатор
          loadedClubs = await ClubsRepository.getByCreatorId(user.id);
        } else if (user?.role === UserRole.Player && user.player?.id) {
          // клубы, в которых состоит игрок
          loadedClubs = await ClubsRepository.loadClubsForPlayer(user.player.id);
        } else {
          // гость или другая роль — показать все клубы
          loadedClubs = await ClubsRepository.loadAll();
        }

        // нормализуем к массиву
        const clubsList: Club[] = Array.isArray(loadedClubs)
          ? loadedClubs
          : loadedClubs
          ? [loadedClubs]
          : [];

        setClubs(clubsList);
      } catch (e: any) {
        console.error("ClubsProvider.refresh error:", e);
        setError(e?.message ?? "Не удалось загрузить клубы");
      } finally {
        if (!bg) setLoading(false);
        setInitialLoaded(true);
      }
    },
    // Зависим от user: при смене пользователя или его роли — перезагружаем
    [user]
  );

  // Загружаем при маунте и при смене user/роли
  useEffect(() => {
    void refresh();
  }, [refresh]);

  /**
   * Создать клуб с оптимистичным апдейтом.
   * director_id проставляем из текущего пользователя.
   */
  const createClub = useCallback(
    async (p: ClubCreateInput): Promise<Club> => {
      if (!user) throw new Error("Нужно войти в систему, чтобы создать клуб.");

      const payload: ClubCreateInput = { ...p, director_id: user.id };

      // оптимистичная карточка
      const tmpId = -Math.floor(Math.random() * 1e9);
      const optimistic: Club = {
        id: tmpId,
        director_id: user.id,
        slug: p.name, // TODO: нормализовать slug (транслит/кириллица)
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

  /** Удалить клуб с откатом при ошибке */
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