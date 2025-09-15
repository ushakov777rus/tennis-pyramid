"use client";

import { useEffect, useMemo, useState } from "react";
import { ClubsClient } from "@/app/clubs/ClubsClient";
import { useUser } from "@/app/components/UserContext";
import { UserRole } from "@/app/models/Users";
import { useClubs } from "@/app/clubs/ClubsProvider";
import { ClubsRepository } from "@/app/repositories/ClubsRepository";
import { ClubProvider } from "@/app/clubs/[slug]/ClubProvider";
import ClubClient from "@/app/clubs/[slug]/ClubClient";

type ClubInitial = { slug: string; clubPlain: any }; // подставь свой тип

export function TournamentAdminClientPage() {
  const { user } = useUser();
  const isAdmin = user?.role === UserRole.TournamentAdmin;

  const { clubs, loading, error } = useClubs();
  const [initial, setInitial] = useState<ClubInitial | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (loading || error) return;
      if (!clubs || clubs.length === 0) return;

      const slug = clubs[0].slug;
      setBusy(true);
      try {
        const clubPlain = await ClubsRepository.getBySlug(slug); // <-- await!
        if (!cancelled) setInitial({ slug, clubPlain });
      } finally {
        if (!cancelled) setBusy(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [loading, error, clubs]);

  if (!isAdmin) {
    return <div>Залогиньтесь под администратором!</div>;
  }

  // пока грузим список клубов или произошла ошибка — покажем общий клиент
  if (loading) return <ClubsClient />;
  if (error) return <div>Ошибка: {String(error)}</div>;
  if (!clubs || clubs.length === 0) return <ClubsClient />;

  // клуб выбран, но его данные ещё едет — лоадер
  if (busy || !initial) {
    return <div>Загружаем данные клуба…</div>;
  }

  return (
    <ClubProvider initial={initial}>
      <ClubClient />
    </ClubProvider>
  );
}