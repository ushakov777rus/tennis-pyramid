"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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
import { FORMAT_OPTIONS } from "../models/Tournament";

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
  const addMatch = tournamentCtx?.addMatch;
  const updateMatch = tournamentCtx?.updateMatch;
  const reload = tournamentCtx?.reload;

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

  /** Сохранение счёта из схем (RR/SE/DE/Groups+PO/Swiss/…) */
  const handleSaveScore = useCallback(
    async (
      aId: number,
      bId: number,
      score: string,
      meta?: { phase: PhaseType; groupIndex?: number | null; roundIndex?: number | null }
    ) => {
      if (!tournament || !updateMatch || !addMatch || !reload) return;

      try {
        const scores = Match.parseScoreStringFlexible(score);

        // Ищем существующий матч по паре + фазовым полям (если заданы)
        const existing = matches.find((m) => {
          const id1 = m.player1?.id ?? m.team1?.id ?? 0;
          const id2 = m.player2?.id ?? m.team2?.id ?? 0;
          const samePair = (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
          if (!samePair) return false;
          if (!meta) return true; // обратная совместимость (старые матчи без phase)
          const phaseOk = (m as any).phase === meta.phase;
          const groupOk =
            meta.phase === PhaseType.Group ? ((m as any).groupIndex ?? null) === (meta.groupIndex ?? null) : true;
          const roundOk =
            meta.phase === PhaseType.Playoff ? ((m as any).roundIndex ?? null) === (meta.roundIndex ?? null) : true;
          return phaseOk && groupOk && roundOk;
        });

        const isSingle =
          typeof tournament.isSingle === "function"
            ? tournament.isSingle()
            : tournament.tournament_type === "single";

        if (existing) {
          // UPDATE: обновляем счёт + (по возможности) фазовые поля
          const updated = { ...existing, scores } as Match;
          if (meta) {
            (updated as any).phase = meta.phase;
            if (meta.phase === PhaseType.Group) {
              (updated as any).groupIndex = meta.groupIndex ?? null;
              (updated as any).roundIndex = null;
            } else if (meta.phase === PhaseType.Playoff) {
              (updated as any).roundIndex = meta.roundIndex ?? null;
              (updated as any).groupIndex = null;
            }
          }
          await updateMatch(updated);
        } else {
          // INSERT: создаём новый матч и сразу проставляем фазу/индексы
          const date = new Date();
          let player1: number | null = null;
          let player2: number | null = null;
          let team1: number | null = null;
          let team2: number | null = null;

          if (isSingle) {
            player1 = aId;
            player2 = bId;
          } else {
            team1 = aId;
            team2 = bId;
          }

          await addMatch({
            date,
            type: tournament.tournament_type,
            scores,
            player1,
            player2,
            team1,
            team2,
            tournamentId: tournament.id,
            phase: meta?.phase,
            groupIndex: meta?.phase === PhaseType.Group ? meta.groupIndex ?? null : null,
            roundIndex: meta?.phase === PhaseType.Playoff ? meta.roundIndex ?? null : null,
          });
        }

        // NB: тут остаётся reload(), т.к. это общий путь для разных схем.
        await reload({ silent: true });
      } catch (err) {
        console.error("Ошибка при сохранении счёта:", err);
        alert(err instanceof Error ? err.message : "Не удалось сохранить счёт");
      }
    },
    [tournament, matches, updateMatch, addMatch, reload]
  );


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

  const formatLabel =
  FORMAT_OPTIONS.find((opt) => opt.value === tournament.format)?.label ?? "";


  return (
    <>
      <div className="page-container">
        <h1 className="page-title">{tournament.name}</h1>
        <h2 className="page-title">{formatLabel}</h2>
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
            {tournament.isPyramid() && isOwner && (
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
                isPyramid={tournament.isPyramid()}
                isDouble={tournament.isDouble()}
              />
                {matchError && <div className="form-error">{matchError}</div>}
              </>
            )}
          </div>

          <div className="card">
            <FormatView
              loading={tournamentCtx?.loading}
              tournament={tournament}
              participants={participants}
              matches={matches}
              selectedIds={formatSelection}
              onSelect={setFormatSelection}
              onShowHistoryPlayer={handleShowHistoryPlayer}
              onSaveScore={handleSaveScore}
              onPositionsChange={isOwner ? tournamentCtx.updatePositions : undefined}
          />
          </div>
        </div>
      </div>
      {(!user?.id && showBanner) && (
        <div className="floating-register-banner" role="status">
          <span style={{textAlign:"center"}}>
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
          className="modal-close-btn"
          onClick={() => setShowBanner(false)}
          aria-label="Закрыть модальное окно"
        >
          ✖
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
