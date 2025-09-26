"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AddTournamentModal } from "@/app/components/AddTournamentModal";
import { useUser } from "@/app/components/UserContext";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { TournamentCreateInput, TournamentStatus } from "@/app/models/Tournament";
import { OWNER_TOKEN_PREFIX } from "./constants";

export default function FreeTournamentModalLauncher() {
  const router = useRouter();
  const { user } = useUser();

  const [isOpen, setIsOpen] = useState(true);
  const [, setIsCreating] = useState(false);
  const creatingRef = useRef(false);

  const setCreating = useCallback((next: boolean) => {
    creatingRef.current = next;
    setIsCreating(next);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (!creatingRef.current) {
      router.push("/tournaments");
    }
  }, [router]);

  const handleCreate = useCallback(async (payload: TournamentCreateInput & { settings?: any }) => {
    const anonymousToken = user?.id
      ? null
      : typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

    setCreating(true);

    try {
      const created = await TournamentsRepository.createNewTournament({
        name: payload.name.trim(),
        format: payload.format,
        tournament_type: payload.tournament_type,
        start_date: payload.start_date ?? null,
        end_date: payload.end_date ?? null,
        status: TournamentStatus.Draft,
        creator_id: user?.id ?? null,
        is_public: false,
        club: null,
        settings: payload.settings ?? {},
        owner_token: anonymousToken,
      });

      if (!created?.slug) {
        throw new Error("Tournament slug is missing");
      }

      if (!user?.id && anonymousToken && typeof window !== "undefined") {
        window.localStorage.setItem(`${OWNER_TOKEN_PREFIX}${created.slug}`, anonymousToken);
      }

      router.push(`/freetournament/${created.slug}?step=1`);
    } catch (error) {
      console.error("Failed to create free tournament", error);
      alert("Не удалось создать турнир. Попробуйте позже.");
      setIsOpen(true);
    } finally {
      setCreating(false);
    }
  }, [router, user?.id, setCreating]);

  return (
    <AddTournamentModal
      isOpen={isOpen}
      club={null}
      onClose={handleClose}
      onCreate={handleCreate}
    />
  );
}
