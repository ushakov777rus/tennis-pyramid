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
import { ClubsRepository } from "@/app/repositories/ClubsRepository";
import { type ClubPlain } from "@/app/models/Club";
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
  mutating: boolean;        // зарезервировано под будущие мутации

  clubId: number | null;
  slug: string;

  // данные
  club: Club | null;

  // действия
  reload: (opts?: { silent?: boolean }) => Promise<void>;
};

const ClubContext = createContext<ClubContextShape | null>(null);

/** Локальный helper: собираем модель из plain-объекта */
function toModelFromPlain(plain: ClubPlain | null | undefined): Club | null {
  if (!plain) return null;
  return new ClubModel({
    id: plain.id,
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
  const { loading: userLoading } = useUser(); // вдруг нужны будут права позже
  const { slug, clubPlain } = initial;

  // state
  const [club, setClub] = useState<Club | null>(toModelFromPlain(clubPlain));
  const clubId = club?.id ?? null;

  const needInitialFetch = !clubPlain;

  // флаги загрузки
  const [initialLoading, setInitialLoading] = useState<boolean>(needInitialFetch);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [mutating] = useState<boolean>(false); // оставляем для единообразия API

  /** Перезагрузка по slug: тянем plain и превращаем в модель на клиенте */
  const reload = useCallback(
    async (opts?: { silent?: boolean }) => {
      const silent = !!opts?.silent;
      silent ? setRefreshing(true) : setInitialLoading(true);
      try {
        const plain = await ClubsRepository.getBySlug(slug); // ожидается ClubPlain | null
        const next = toModelFromPlain(plain);
        setClub(next);
      } finally {
        silent ? setRefreshing(false) : setInitialLoading(false);
      }
    },
    [slug]
  );

  // первичная загрузка, если с сервера не пришёл clubPlain
  useEffect(() => {
    if (needInitialFetch && !userLoading) {
      void reload();
    }
  }, [needInitialFetch, userLoading, reload]);

  const value = useMemo<ClubContextShape>(
    () => ({
      loading: initialLoading,
      initialLoading,
      refreshing,
      mutating,

      clubId,
      slug,

      club,

      reload,
    }),
    [initialLoading, refreshing, mutating, clubId, slug, club, reload]
  );

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
}

export function useClub(): ClubContextShape {
  const ctx = useContext(ClubContext);
  if (!ctx) throw new Error("useClub must be used within ClubProvider");
  return ctx;
}