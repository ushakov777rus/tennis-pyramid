"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AddTournamentModal } from "@/app/components/AddTournamentModal";
import { useUser } from "@/app/components/UserContext";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { TournamentCreateInput, TournamentFormat, TournamentStatus } from "@/app/models/Tournament";
import { OWNER_TOKEN_PREFIX } from "./constants";
import { useDictionary, useLanguage } from "@/app/components/LanguageProvider";
import { withLocalePath } from "../i18n/routing";

export default function FreeTournamentModalLauncher() {
  const router = useRouter();
  const { user } = useUser();
  const { freeTournamentModal, tournaments } = useDictionary();
  const { locale } = useLanguage();

  const [status, setStatus] = useState<"loading" | "prompt" | "create">("loading");
  const [candidate, setCandidate] = useState<
    | {
        slug: string;
        name: string;
        format: TournamentFormat | string;
        token: string;
      }
    | null
  >(null);
  const [isOpen, setIsOpen] = useState(false);
  const [, setIsCreating] = useState(false);
  const creatingRef = useRef(false);

  const setCreating = useCallback((next: boolean) => {
    creatingRef.current = next;
    setIsCreating(next);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      setStatus("create");
      setIsOpen(true);
      return;
    }

    const saved: { slug: string; token: string }[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(OWNER_TOKEN_PREFIX)) continue;
      const token = window.localStorage.getItem(key);
      if (!token) continue;
      const slug = key.slice(OWNER_TOKEN_PREFIX.length);
      if (!slug) continue;
      saved.push({ slug, token });
    }

    if (saved.length === 0) {
      setStatus("create");
      setIsOpen(true);
      return;
    }

    // используем последнюю сохранённую запись
    const { slug, token } = saved[saved.length - 1];
    let cancelled = false;

    (async () => {
      try {
        const tournamentPlain = await TournamentsRepository.getBySlug(slug);
        if (cancelled) return;

        if (tournamentPlain && tournamentPlain.owner_token && tournamentPlain.owner_token === token) {
          setCandidate({
            slug,
            name: tournamentPlain.name,
            format: tournamentPlain.format,
            token,
          });
          setStatus("prompt");
        } else {
          setStatus("create");
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Failed to resolve saved free tournament", error);
        if (!cancelled) {
          setStatus("create");
          setIsOpen(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
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
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i += 1) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(OWNER_TOKEN_PREFIX)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => window.localStorage.removeItem(key));
        window.localStorage.setItem(`${OWNER_TOKEN_PREFIX}${created.slug}`, anonymousToken);
      }

      router.push(`/freetournament/${created.slug}?tab=participants`);
    } catch (error) {
      console.error("Failed to create free tournament", error);
      alert(freeTournamentModal.errors.createFailed);
      setIsOpen(true);
    } finally {
      setCreating(false);
    }
  }, [router, user?.id, setCreating, freeTournamentModal.errors.createFailed]);

  const formatLabel = useMemo(() => {
    if (!candidate) return "";
    const format = candidate.format as TournamentFormat;
    switch (format) {
      case TournamentFormat.RoundRobin:
        return tournaments.formatLabels.roundRobin;
      case TournamentFormat.SingleElimination:
        return tournaments.formatLabels.singleElimination;
      case TournamentFormat.DoubleElimination:
        return tournaments.formatLabels.doubleElimination;
      case TournamentFormat.GroupsPlayoff:
        return tournaments.formatLabels.groupsPlayoff;
      case TournamentFormat.Swiss:
        return tournaments.formatLabels.swiss;
      case TournamentFormat.Custom:
        return tournaments.formatLabels.custom;
      case TournamentFormat.Pyramid:
        return tournaments.formatLabels.pyramid;
      default:
        return freeTournamentModal.unknownFormat;
    }
  }, [candidate, tournaments.formatLabels, freeTournamentModal.unknownFormat]);

  const handleRestore = useCallback(() => {
    if (!candidate) return;
    setStatus("loading");
    setIsOpen(false);
    router.push(`/freetournament/${candidate.slug}?tab=participants`);
  }, [candidate, router]);

  const handleDecline = useCallback(() => {
    setCandidate(null);
    setStatus("create");
    setIsOpen(true);
  }, []);

  const handleDismissPrompt = useCallback(() => {
    setCandidate(null);
    setStatus("create");
    setIsOpen(false);
    router.push(withLocalePath(locale, "/"));
  }, []);

  return (
    <>
      {status === "prompt" && candidate && (
        <div className="modal-overlay" aria-hidden={false}>
          <div className="modal-content" role="dialog" aria-modal="true">
            <button
              type="button"
              className="modal-close-btn"
              onClick={handleDismissPrompt}
            >
              ✖
            </button>

            <h3 className="modal-title">{freeTournamentModal.restoreTitle}</h3>
            <p style={{ marginBottom: 16, textAlign: "center" }}>
              {freeTournamentModal.restoreDescription}
              <br />
              <br />
              <strong>{candidate.name}</strong>
              {formatLabel ? ` (${formatLabel})` : ""}. <br />
              <br />
              {freeTournamentModal.restoreQuestion}
            </p>
            <div className="modal-actions" style={{ justifyContent: "flex-end" }}>
              <button type="button" className="modal-submit-btn" onClick={handleRestore}>
                {freeTournamentModal.restoreButton}
              </button>
              <button type="button" className="modal-submit-btn" onClick={handleDecline}>
                {freeTournamentModal.createNewButton}
              </button>
            </div>
          </div>
        </div>
      )}

      <AddTournamentModal
        isOpen={status === "create" && isOpen}
        club={null}
        onClose={handleClose}
        onCreate={handleCreate}
      />
    </>
  );
}
