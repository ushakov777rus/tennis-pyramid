// app/clubs/[slug]/ClubProvider.tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Club as ClubModel } from "@/app/models/Club";
import type { Club } from "@/app/models/Club";
import type { ClubPlain } from "@/app/models/Club";

import { ClubsRepository } from "@/app/repositories/ClubsRepository";
import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { UsersRepository } from "@/app/repositories/UsersRepository"; // 👈
import { MatchRepository } from "@/app/repositories/MatchRepository";

import { Player } from "@/app/models/Player";
import { useUser } from "@/app/components/UserContext";
import type { User } from "@/app/models/Users"; // 👈
import type { Match } from "@/app/models/Match";

/** Исходные данные из сервера/роутера */
type InitialData = {
  slug: string;                 // роутим по slug
  clubPlain?: ClubPlain | null; // POJO клуба (опционально)
};

/** Публичный интерфейс контекста клуба */
export type ClubContextShape = {
  // meta
  loading: boolean;
  initialLoading: boolean;
  refreshing: boolean;
  mutating: boolean;

  clubId: number | null;
  slug: string;

  // данные
  club: Club | null;
  director: User | null;        // 👈 добавили
  members: Player[];
  players: Player[];
  matches: Match[];

  // действия
  reload: (opts?: { silent?: boolean }) => Promise<void>;
  addMember: (playerId: number) => Promise<void>;
  removeMember: (playerId: number) => Promise<void>;
};

const ClubContext = createContext<ClubContextShape | null>(null);

/** Локальный helper: собираем модель из plain-объекта */
function toModelFromPlain(plain: ClubPlain | null | undefined): Club | null {
  if (!plain) return null;
  return new ClubModel({
    id: plain.id,
    director_id: plain.director_id,
    slug: plain.slug,
    name: plain.name,
    description: plain.description ?? null,
    city: plain.city ?? null,
    logo_url: plain.logo_url ?? null,
    members_count: plain.members_count ?? null,
    tournaments_count: plain.tournaments_count ?? null,
    created_at: plain.created_at,
    updated_at: plain.updated_at,
  });
}

export function ClubProvider({
  initial,
  children,
}: {
  initial: InitialData;
  children: React.ReactNode;
}) {
  const { loading: userLoading } = useUser();
  const { slug, clubPlain } = initial;

  // state
  const [club, setClub] = useState<Club | null>(toModelFromPlain(clubPlain));
  const clubId = club?.id ?? null;

  const [director, setDirector] = useState<User | null>(null); // 👈
  const [members, setMembers] = useState<Player[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const needInitialFetch = true; // !clubPlain;

  // флаги загрузки
  const [initialLoading, setInitialLoading] = useState<boolean>(needInitialFetch);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [mutating, setMutating] = useState<boolean>(false);

  /** Перезагрузка по slug: тянем club + директора + членов клуба + доступных игроков */
  const reload = useCallback(
    async (opts?: { silent?: boolean }) => {
      const silent = !!opts?.silent;
      silent ? setRefreshing(true) : setInitialLoading(true);
      try {
        // 1) сам клуб
        const plain = await ClubsRepository.getBySlug(slug); // ожидается ClubPlain | null
        const next = toModelFromPlain(plain);
        setClub(next);

        // 2) директор
        if (next?.created_by) {
          try {
            const d = await UsersRepository.findById(next.created_by); // -> User | null
            setDirector(d ?? null);
          } catch (err) {
            console.error("ClubProvider.reload: cannot load director", err);
            setDirector(null);
          }
        } else {
          setDirector(null);
        }

        // 3) члены клуба + каталог игроков
        if (next?.id) {
          const [membersNext, allPlayers, clubMatches] = await Promise.all([
            ClubsRepository.loadMembers(next.id), // -> Player[]
            PlayersRepository.loadAll(),          // -> Player[]
            MatchRepository.loadMatchesForClub(next.id),
          ]);

          setMembers(membersNext ?? []);
          setPlayers(allPlayers ?? []);
          setMatches(clubMatches ?? []);
        } else {
          setMembers([]);
          setPlayers([]);
          setMatches([]);
        }
      } finally {
        silent ? setRefreshing(false) : setInitialLoading(false);
      }
    },
    [slug]
  );

  // первичная загрузка, если с сервера не пришёл clubPlain
  const initialFetchRef = useRef(false);

  useEffect(() => {
    if (initialFetchRef.current) return;
    if (needInitialFetch && !userLoading) {
      initialFetchRef.current = true;
      void reload();
    }
  }, [needInitialFetch, userLoading, reload]);

  /** Добавить члена клуба */
  const addMember = useCallback(
    async (playerId: number) => {
      if (!clubId) {
        await reload({ silent: true });
      }
      if (!clubId && !club?.id) throw new Error("Клуб не загружен");
      setMutating(true);
      try {
        await ClubsRepository.addMember(club?.id ?? clubId!, playerId);
        await reload({ silent: true });
      } finally {
        setMutating(false);
      }
    },
    [clubId, club?.id, reload]
  );

  /** Удалить члена клуба */
  const removeMember = useCallback(
    async (playerId: number) => {
      if (!clubId) {
        await reload({ silent: true });
      }
      if (!clubId && !club?.id) throw new Error("Клуб не загружен");
      setMutating(true);
      try {
        await ClubsRepository.removeMember(club?.id ?? clubId!, playerId);
        await reload({ silent: true });
      } finally {
        setMutating(false);
      }
    },
    [clubId, club?.id, reload]
  );

  const value = useMemo<ClubContextShape>(
    () => ({
      loading: initialLoading,
      initialLoading,
      refreshing,
      mutating,

      clubId,
      slug,

      club,
      director,     // 👈 пробрасываем
      members,
      players,
      matches,

      reload,
      addMember,
      removeMember,
    }),
    [
      initialLoading,
      refreshing,
      mutating,
      clubId,
      slug,
      club,
      director,     // 👈 зависимость
      members,
      players,
      matches,
      reload,
      addMember,
      removeMember,
    ]
  );

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
}

// ✅ Безопасный вариант: вернёт null вместо throw, если провайдера нет
export function useOptionalClub() {
  return useContext(ClubContext) ?? null;
}

export function useClub(): ClubContextShape {
  const ctx = useContext(ClubContext);
  if (!ctx) throw new Error("useClub must be used within ClubProvider");
  return ctx;
}
