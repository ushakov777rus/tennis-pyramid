"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import "./FreeTournamentWizard.css";

import { CustomSelect } from "@/app/components/controls/CustomSelect";
import { CancelIconButton, SaveIconButton } from "@/app/components/controls/IconButtons";
import { AddMatchCard } from "@/app/components/AddMatchCard";
import { ParticipantsView } from "@/app/components/ParticipantsView";
import { FormatView } from "@/app/tournaments/[slug]/TournamentClient";
import { useOptionalTournament } from "@/app/tournaments/[slug]/TournamentProvider";
import { useUser } from "@/app/components/UserContext";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import {
  TournamentFormat,
  TournamentStatus,
  TournamentType,
  FORMAT_OPTIONS,
  TYPE_OPTIONS,
} from "@/app/models/Tournament";
import { Match, PhaseType } from "@/app/models/Match";
import type { Participant } from "@/app/models/Participant";

const steps = ["Основное", "Участники", "Матчи"] as const;

function parseStep(value: string | null | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildSearch(nextStep: number, searchParams: URLSearchParams) {
  if (nextStep <= 0) {
    searchParams.delete("step");
  } else {
    searchParams.set("step", String(nextStep));
  }
  return searchParams.toString() ? `?${searchParams.toString()}` : "";
}

function mapParticipantsToOptions(participants: Participant[]) {
  return participants.map((participant) => ({
    value: participant.getId,
    label: participant.displayName(false),
  }));
}

function computeWinnerIds(scores: [number, number][], attackerId: number, defenderId: number) {
  const [winnerId, loserId] = Match.getWinnerId(scores, attackerId, defenderId);
  return {
    winnerId: winnerId || null,
    loserId: loserId || null,
  };
}

type Props = {
  initialStep?: number;
};

export default function FreeTournamentWizard({ initialStep = 0 }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { user } = useUser();
  const tournamentCtx = useOptionalTournament();
  const tournament = tournamentCtx?.tournament ?? null;
  const participants = tournamentCtx?.participants ?? [];
  const matches = tournamentCtx?.matches ?? [];
  const playersPool = tournamentCtx?.players ?? [];
  const tournamentSlug = tournamentCtx?.tournament?.slug ?? tournamentCtx?.tournamentSlug ?? "";

  const hasTournament = !!tournament;

  const queryStep = parseStep(searchParams?.get("step") ?? undefined, hasTournament ? initialStep || 1 : 0);

  const [step, setStep] = useState<number>(hasTournament ? Math.max(queryStep, 1) : 0);
  const [name, setName] = useState("");
  const [type, setType] = useState<TournamentType>(TournamentType.Single);
  const [format, setFormat] = useState<TournamentFormat>(TournamentFormat.Pyramid);
  const [basicsError, setBasicsError] = useState<string | null>(null);
  const [savingBasics, setSavingBasics] = useState(false);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [matchDate, setMatchDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [matchScore, setMatchScore] = useState("");
  const [matchError, setMatchError] = useState<string | null>(null);
  const [formatSelection, setFormatSelection] = useState<number[]>([]);

  useEffect(() => {
    if (hasTournament) {
      setName(tournament?.name ?? "");
      setType(tournament?.tournament_type ?? TournamentType.Single);
      setFormat(tournament?.format ?? TournamentFormat.Pyramid);
    }
  }, [hasTournament, tournament?.name, tournament?.tournament_type, tournament?.format]);

  useEffect(() => {
    if (hasTournament) {
      setStep(Math.max(queryStep, 1));
    }
  }, [hasTournament, queryStep]);

  const updateStepInUrl = (nextStep: number) => {
    if (!hasTournament) return;
    const params = new URLSearchParams(searchParams?.toString());
    const search = buildSearch(nextStep, params);
    router.replace(`${pathname}${search}`, { scroll: false });
  };

  const canGoNextFromBasics = name.trim().length > 0;
  const canGoNextFromPlayers = hasTournament ? participants.length >= (tournament?.isDouble() ? 2 : 2) : false;

  const handleCreateTournament = async () => {
    if (!canGoNextFromBasics || savingBasics) return;
    setBasicsError(null);
    try {
      setSavingBasics(true);
      const created = await TournamentsRepository.createNewTournament({
        name: name.trim(),
        format,
        tournament_type: type,
        start_date: null,
        end_date: null,
        status: TournamentStatus.Draft,
        creator_id: user?.id ?? null,
        is_public: false,
        club: null,
        settings: {},
      });
      router.push(`/freetournament/${created.slug}?step=1`);
    } catch (error) {
      console.error("Failed to create tournament", error);
      setBasicsError("Не удалось создать турнир. Попробуйте позже.");
    } finally {
      setSavingBasics(false);
    }
  };

  const next = async () => {
    if (step === 0 && !hasTournament) {
      await handleCreateTournament();
      return;
    }
    const nextStep = Math.min(step + 1, steps.length - 1);
    setStep(nextStep);
    updateStepInUrl(nextStep);
  };

  const prev = () => {
    if (step === 0) return;
    const prevStep = Math.max(step - 1, 0);
    setStep(prevStep);
    updateStepInUrl(prevStep);
  };

  const playerOptions = useMemo(() => mapParticipantsToOptions(participants), [participants]);

  const handleAddMatch = async () => {
    if (!tournamentCtx?.addMatchAndMaybeSwap) return;
    if (selectedIds.length < 2) {
      setMatchError("Выберите двух участников");
      return;
    }
    if (!matchScore.trim()) {
      setMatchError("Введите счёт");
      return;
    }

    let parsedScores: [number, number][];
    try {
      parsedScores = Match.parseScoreStringFlexible(matchScore.trim());
    } catch (error) {
      setMatchError((error as Error)?.message ?? "Некорректный формат счёта");
      return;
    }

    const [attackerId, defenderId] = selectedIds;
    const { winnerId, loserId } = computeWinnerIds(parsedScores, attackerId, defenderId);

    try {
      await tournamentCtx.addMatchAndMaybeSwap({
        date: new Date(matchDate),
        type: tournament?.tournament_type ?? TournamentType.Single,
        scores: parsedScores,
        aId: attackerId,
        bId: defenderId,
        winnerId,
        loserId,
        doSwap: tournament?.isPyramid() ?? false,
      });
      setMatchError(null);
      setMatchScore("");
      setSelectedIds([]);
    } catch (error) {
      console.error("Failed to add match", error);
      setMatchError("Не удалось сохранить матч");
    }
  };

  const handleSaveScoreRoundRobin = async (
    _aId: number,
    _bId: number,
    _score: string,
    _meta?: { phase: PhaseType; groupIndex?: number | null; roundIndex?: number | null }
  ) => {
    // В мастере пока не поддерживаем редактирование сетки напрямую
    return Promise.resolve();
  };

  const handleShowHistoryPlayer = (_participant: Participant) => {};

  const goToParticipants = () => {
    setStep(1);
    updateStepInUrl(1);
  };

  const basicsDisabled = hasTournament;

  return (
    <div className="page-container wizard-container">
      <div className="wizard-steps">
        {steps.map((label, index) => (
          <span
            key={label}
            className={`wizard-step ${step === index ? "wizard-step--active" : ""}`}
          >
            {index + 1}. {label}
          </span>
        ))}
      </div>

      <div className="card">
        {step === 0 && (
          <div className="login-form">
            <div className="page-toolbar">
              <input
                className="input input-100"
                type="text"
                placeholder="Название турнира"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={basicsDisabled}
              />

              <CustomSelect
                className="input"
                options={TYPE_OPTIONS.filter((opt) => opt.value !== "")}
                value={type}
                onChange={(val) => setType(val as TournamentType)}
                showSearch={false}
                sort={false}
                disabled={basicsDisabled}
              />

              <CustomSelect
                className="input"
                options={FORMAT_OPTIONS.filter((opt) => opt.value !== "")}
                value={format}
                onChange={(val) => setFormat(val as TournamentFormat)}
                showSearch={false}
                sort={false}
                disabled={basicsDisabled}
              />
            </div>

            {basicsError && <div className="form-error">{basicsError}</div>}
          </div>
        )}

        {step === 1 && hasTournament && tournamentCtx && (
          <ParticipantsView
            mode="tournament"
            initialLoading={tournamentCtx.initialLoading}
            refreshing={tournamentCtx.refreshing}
            mutating={tournamentCtx.mutating}
            isDouble={tournamentCtx.tournament?.isDouble() ?? false}
            participants={participants}
            players={playersPool}
            onAddPlayerToTournament={tournamentCtx.addPlayerToTournament}
            onRemoveParticipant={tournamentCtx.removeParticipant}
            onCreateTeam={
              tournamentCtx.createAndAddTeamToTournament && tournamentCtx.tournamentId
                ? (p1, p2) =>
                    tournamentCtx.createAndAddTeamToTournament!(
                      tournamentCtx.tournamentId!,
                      p1,
                      p2
                    )
                : undefined
            }
          />
        )}

        {step === 2 && hasTournament && (
          <div className="register-form">
            <AddMatchCard
              options={playerOptions}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              matchDate={matchDate}
              setMatchDate={setMatchDate}
              matchScore={matchScore}
              setMatchScore={(value) => {
                setMatchScore(value);
                if (matchError) setMatchError(null);
              }}
              isAnon={false}
              isPlayerWithFixedAttacker={false}
              onAddMatch={handleAddMatch}
            />
            {matchError && <div className="form-error">{matchError}</div>}
          </div>
        )}
      </div>

      <div className="page-toolbar">
        <button
          type="button"
          className="modal-submit-btn"
          onClick={prev}
          disabled={step === 0}
        >
          Назад
        </button>

        {step < steps.length - 1 ? (
          <button
            type="button"
            className="modal-submit-btn"
            onClick={next}
            disabled={
              (step === 0 && (!canGoNextFromBasics || savingBasics)) ||
              (step === 1 && !canGoNextFromPlayers)
            }
          >
            {step === 0 && !hasTournament ? (savingBasics ? "Создаём…" : "Создать турнир") : "Далее"}
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <SaveIconButton
              title="Сохранить турнир"
              onClick={() => router.push(tournamentSlug ? `/tournaments/${tournamentSlug}` : "/tournaments")}
            />
            <CancelIconButton
              title="Вернуться к участникам"
              onClick={goToParticipants}
            />
          </div>
        )}
      </div>

      <div className="summary-card">
        <h4>Итог</h4>
        <p>
          <strong>Турнир:</strong> {name || "—"} ({format})
        </p>
        <p>
          <strong>Игроков:</strong> {participants.length}
        </p>
        <p>
          <strong>Матчей:</strong> {matches.length}
        </p>
        {hasTournament && (
          <div className="summary-bracket">
            <FormatView
              tournament={tournamentCtx?.tournament!}
              participants={participants}
              matches={matches}
              selectedIds={formatSelection}
              onSelect={setFormatSelection}
              onShowHistoryPlayer={handleShowHistoryPlayer}
              onSaveScoreRoundRobin={handleSaveScoreRoundRobin}
              onPositionsChange={tournamentCtx?.updatePositions}
              onGoToParticipants={goToParticipants}
            />
          </div>
        )}
      </div>
    </div>
  );
}
