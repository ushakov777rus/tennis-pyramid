"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Club as ClubModel } from "@/app/models/Club";
import type { Club } from "@/app/models/Club";
import type { ClubPlain } from "@/app/models/Club";

import { ClubsRepository } from "@/app/repositories/ClubsRepository";
import { PlayersRepository } from "@/app/repositories/PlayersRepository";

import { Player } from "@/app/models/Player";
import { useUser } from "@/app/components/UserContext";


/** Исходные данные из сервера/роутера */
type InitialData = {
  slug: string;                 // роутим по slug
  clubPlain?: ClubPlain | null; // POJO клуба (опционально)
};

/** Публичный интерфейс контекста клуба */
export type ClubContextShape = {
  // meta
  loading: boolean;         // общий флаг загрузки (синоним initialLoading)
  initialLoading: boolean;  // первичная загрузка
  refreshing: boolean;      // фоновый рефреш
  mutating: boolean;        // мутации (добавление/удаление)

  clubId: number | null;
  slug: string;

  // данные
  club: Club | null;
  members: Player[];  // члены клуба
  players: Player[];  // доступные игроки (каталог игроков для добавления)

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
  const { user, loading: userLoading } = useUser();
  const { slug, clubPlain } = initial;

  // state
  const [club, setClub] = useState<Club | null>(toModelFromPlain(clubPlain));
  const clubId = club?.id ?? null;

  const [members, setMembers] = useState<Player[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  const needInitialFetch=true;//!clubPlain;

  // флаги загрузки
  const [initialLoading, setInitialLoading] = useState<boolean>(needInitialFetch);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [mutating, setMutating] = useState<boolean>(false);

  /** Перезагрузка по slug: тянем club + членов клуба + доступных игроков */
  const reload = useCallback(
    async (opts?: { silent?: boolean }) => {
      const silent = !!opts?.silent;
      silent ? setRefreshing(true) : setInitialLoading(true);
      try {
        // 1) сам клуб
        console.log("ClubProvider.reload", slug);
        const plain = await ClubsRepository.getBySlug(slug); // ожидается ClubPlain | null
        const next = toModelFromPlain(plain);
        setClub(next);

        // 2) если есть клуб — грузим членов и каталог игроков
        if (next?.id) {
          const [membersNext, allPlayers] = await Promise.all([
            // предполагаемые методы реп — замени на свои, если отличаются
            ClubsRepository.loadMembers(next.id),                       // -> Player[]
            PlayersRepository.loadAll() //loadAccessiblePlayers(user?.id, user?.role), // -> Player[]
          ]);

          console.log("ClubProvider.reload", membersNext, allPlayers);

          setMembers(membersNext ?? []);
          setPlayers(allPlayers ?? []);
        } else {
          setMembers([]);
          setPlayers([]);
        }
      } finally {
        silent ? setRefreshing(false) : setInitialLoading(false);
      }
    },
    [slug, user?.id, user?.role]
  );

  // первичная загрузка, если с сервера не пришёл clubPlain
  useEffect(() => {
    if (needInitialFetch && !userLoading) {
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
      members,
      players,

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
      members,
      players,
      reload,
      addMember,
      removeMember,
    ]
  );

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
}

export function useClub(): ClubContextShape {
  const ctx = useContext(ClubContext);
  if (!ctx) throw new Error("useClub must be used within ClubProvider");
  return ctx;
}