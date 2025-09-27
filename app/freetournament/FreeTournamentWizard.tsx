"use client";

import { useEffect, useMemo, useState } from "react";

import "./FreeTournamentWizard.css";

import { AddMatchCard } from "@/app/components/AddMatchCard";
import { ParticipantsView } from "@/app/components/ParticipantsView";
import { FormatView } from "@/app/tournaments/[slug]/TournamentClient";
import { useOptionalTournament } from "@/app/tournaments/[slug]/TournamentProvider";
import { useUser } from "@/app/components/UserContext";
import { Match, PhaseType } from "@/app/models/Match";
import type { Participant } from "@/app/models/Participant";
import type { Player } from "@/app/models/Player";
import { AuthContainer } from "@/app/components/AuthContainer";
import { OWNER_TOKEN_PREFIX } from "./constants";

const EMPTY_PARTICIPANTS: Participant[] = [];
const EMPTY_MATCHES: Match[] = [];
const EMPTY_PLAYERS: Player[] = [];

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

export default function FreeTournamentWizard() {
  const { user } = useUser();
  const tournamentCtx = useOptionalTournament();
  const tournament = tournamentCtx?.tournament ?? null;
  const participants = tournamentCtx?.participants ?? EMPTY_PARTICIPANTS;
  const matches = tournamentCtx?.matches ?? EMPTY_MATCHES;
  const playersPool = tournamentCtx?.players ?? EMPTY_PLAYERS;
  const tournamentSlug = tournamentCtx?.tournament?.slug ?? tournamentCtx?.tournamentSlug ?? "";

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [matchDate, setMatchDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [matchScore, setMatchScore] = useState<string>("");
  const [matchError, setMatchError] = useState<string | null>(null);
  const [formatSelection, setFormatSelection] = useState<number[]>([]);
  const [localOwnerToken, setLocalOwnerToken] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (!tournamentSlug) return;
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(`${OWNER_TOKEN_PREFIX}${tournamentSlug}`);
    setLocalOwnerToken(stored);
  }, [tournamentSlug]);

  useEffect(() => {
    if (user?.id) {
      setShowBanner(false);
      setAuthOpen(false);
    }
  }, [user?.id]);

  const ownerTokenFromTournament = tournament?.ownerToken ?? null;
  const isOwnedByUser = !!(user?.id && tournament?.creator_id && tournament.creator_id === user.id);
  const hasOwnerTokenMatch =
    !!ownerTokenFromTournament &&
    !!localOwnerToken &&
    localOwnerToken === ownerTokenFromTournament;
  const isOwner = isOwnedByUser || hasOwnerTokenMatch;

  const playerOptions = useMemo(() => mapParticipantsToOptions(participants), [participants]);

  const handleAddMatch = async () => {
    if (!tournamentCtx?.addMatchAndMaybeSwap || !tournament) return;
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
        type: tournament.tournament_type,
        scores: parsedScores,
        aId: attackerId,
        bId: defenderId,
        winnerId,
        loserId,
        doSwap: tournament.isPyramid(),
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
    return Promise.resolve();
  };

  const handleShowHistoryPlayer = (_participant: Participant) => {};

  if (!tournamentCtx) {
    return (
      <div className="page-container">
        <div className="card">Турнир не найден.</div>
      </div>
    );
  }

  if (tournamentCtx.initialLoading && !tournament) {
    return (
      <div className="page-container">
        <div className="card">Загрузка…</div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="page-container">
        <div className="card">Не удалось загрузить турнир.</div>
      </div>
    );
  }

  return (
    <>
      <div className="page-container">
        <h1 className="page-title">{tournament.name}</h1>
        <div className="page-content-container">
          <div className="card">
            <ParticipantsView
              mode="tournament"
              initialLoading={tournamentCtx.initialLoading}
              refreshing={tournamentCtx.refreshing}
              mutating={tournamentCtx.mutating}
              isDouble={tournament.isDouble()}
              participants={participants}
              players={playersPool}
              onAddPlayerToTournament={isOwner ? tournamentCtx.addPlayerToTournament : undefined}
              onRemoveParticipant={isOwner ? tournamentCtx.removeParticipant : undefined}
              onCreateTeam={
                isOwner &&
                tournamentCtx.createAndAddTeamToTournament &&
                tournamentCtx.tournamentId
                  ? (p1, p2) =>
                      tournamentCtx.createAndAddTeamToTournament!(
                        tournamentCtx.tournamentId!,
                        p1,
                        p2
                      )
                  : undefined
              }
              canManage={isOwner}
            />
          </div>

          <div>
            {isOwner ? (
              <>
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
              </>
            ) : (
              <p style={{ opacity: 0.7 }}>
                Добавление матчей доступно только организатору турнира.
              </p>
            )}
          </div>

          <div className="card">
            <FormatView
              tournament={tournament}
              participants={participants}
              matches={matches}
              selectedIds={formatSelection}
              onSelect={setFormatSelection}
              onShowHistoryPlayer={handleShowHistoryPlayer}
              onSaveScoreRoundRobin={handleSaveScoreRoundRobin}
              onPositionsChange={isOwner ? tournamentCtx.updatePositions : undefined}
            />
          </div>
        </div>
      </div>
      {(!user?.id && showBanner) && (
        <div className="floating-register-banner" role="status">
          <span>
            Для сохранения списка турниров и рейтинга игроков&nbsp;
            <button
              type="button"
              className="floating-register-banner__link"
              onClick={() => setAuthOpen(true)}
            >
              зарегистрируйтесь
            </button>
            &nbsp;на платформе.
          </span>
          <button
            type="button"
            className="floating-register-banner__close"
            onClick={() => setShowBanner(false)}
            aria-label="Скрыть уведомление"
          >
            Скрыть
          </button>
        </div>
      )}
      <AuthContainer
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode="register"
      />
    </>
  );
}
