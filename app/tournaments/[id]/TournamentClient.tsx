"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@/app/components/UserContext";

import { Tournament } from "@/app/models/Tournament";
import { Player } from "@/app/models/Player";
import { Team } from "@/app/models/Team";
import { Match, PhaseType } from "@/app/models/Match";
import { Participant } from "@/app/models/Participant";

import { NavigationBar } from "@/app/components/NavigationBar";
import { TournamentCard } from "@/app/components/TournamentCard";
import { LoggedIn } from "@/app/components/RoleGuard";

import { RatingView } from "@/app/components/RatingView";
import { MatchHistoryModal } from "@/app/components/MatchHistoryModal";
import { MatchHistoryView } from "@/app/components/MatchHistoryView";
import { ParticipantsView } from "@/app/components/ParticipantsView";
import { AddMatchCard } from "@/app/components/AddMatchCard";

import "./Page.css";

import { useTournament } from "./TournamentProvider";

import { PyramidView } from "@/app/components/tournaments/PyramidView";
import { SingleEliminationView } from "@/app/components/tournaments/SingleEliminationView";
import { DoubleEliminationView } from "@/app/components/tournaments/DoubleEliminationView";
import { GroupPlusPlayoffView } from "@/app/components/tournaments/GroupPlusPlayoffView";
import { RoundRobinView } from "@/app/components/tournaments/RoundRobinView";
import { SwissView } from "@/app/components/tournaments/SwissView";

type Tab = "scheme" | "matches" | "participants" | "rating";

const todayISO = new Date().toISOString().split("T")[0];

export default function TournamentClient() {
  const {
    tournament,
    participants,
    matches,
    reload,
    addMatch,
    updateMatch,
    deleteMatch,
    updatePositions,
    addMatchAndMaybeSwap,
  } = useTournament();

  const { user } = useUser();

  const [activeTab, setActiveTab] = useState<Tab>("scheme");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyParticipant, setHistoryParticipant] = useState<Participant | undefined>(undefined);

  const [matchDate, setMatchDate] = useState<string>(todayISO);
  const [matchScore, setMatchScore] = useState<string>("");

  // если игрок залогинен и участвует — закрепляем как нападающего
  useEffect(() => {
    const isSingle =
      typeof tournament?.isSingle === "function" ? tournament.isSingle() : tournament?.tournament_type === "single";

    if (user?.role === "player" && user.player_id && isSingle) {
      const isInTournament = participants.some((p) => p.player?.id === user.player_id);
      setSelectedIds(isInTournament ? [user.player_id] : []);
    } else {
      setSelectedIds([]);
    }
  }, [user?.role, user?.player_id, tournament?.tournament_type, participants, tournament]);

  // Доступные для выбора — только участники турнира
  const selectableItems = useMemo(() => {
    if (!tournament) return [] as Array<Player | Team>;
    const isSingle = tournament.isSingle();
    const items = participants
      .map((p) => (isSingle ? p.player : p.team))
      .filter((x): x is Player | Team => !!x);
    const uniq = new Map<number, Player | Team>();
    for (const it of items) uniq.set(it.id, it);
    return Array.from(uniq.values());
  }, [tournament, participants]);

  const options = useMemo(
    () =>
      selectableItems.map((item) => ({
        value: item.id,
        label: item.displayName(false),
      })),
    [selectableItems]
  );

  /** Универсально определяем победителя и проигравшего по счёту и id A/B. */
  const determineWinnerLoser = useCallback(
    (scores: [number, number][], aId: number, bId: number) => {
      const [winner, loser] = Match.getWinnerId(scores, aId, bId);
      if (!winner) return { winnerId: null, loserId: null };
      return { winnerId: winner, loserId: loser };
    },
    []
  );

  /** Быстрое добавление «ручного» матча (карточка сверху) + автосвап для пирамиды. */
  const handleAddMatch = useCallback(async () => {
    if (!tournament) return;
    if (selectedIds.length < 2 || !matchDate) {
      alert("Выбери двух игроков и дату матча");
      return;
    }

    try {
      const scores = Match.parseScoreStringFlexible(matchScore);
      const [aId, bId] = selectedIds;
      const { winnerId, loserId } = determineWinnerLoser(scores, aId, bId);

      await addMatchAndMaybeSwap({
        date: new Date(matchDate),
        type: tournament.tournament_type,
        scores,
        aId,
        bId,
        winnerId,
        loserId,
        doSwap: tournament.isPyramid() && !!winnerId && !!loserId,
      });

      // только UI-сброс
      setMatchDate(todayISO);
      setMatchScore("");
      setSelectedIds(user?.role === "player" && user.player_id ? [user.player_id] : []);
    } catch (e) {
      console.error(e);
      alert("Не удалось добавить матч");
    }
  }, [
    tournament,
    selectedIds,
    matchDate,
    matchScore,
    user?.role,
    user?.player_id,
    addMatchAndMaybeSwap,
    determineWinnerLoser,
  ]);

  /** Сохранение счёта из схем (RR/SE/DE/Groups+PO/Swiss/…) */
  const handleSaveScore = useCallback(
    async (
      aId: number,
      bId: number,
      score: string,
      meta?: { phase: PhaseType; groupIndex?: number | null; roundIndex?: number | null }
    ) => {
      if (!tournament) return;

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
          const date = new Date(todayISO);
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

  const handleEditMatchSave = useCallback(
    async (updatedMatch: Match) => {
      try {
        await updateMatch(updatedMatch);
      } catch (err) {
        console.error("Ошибка при обновлении матча:", err);
        alert("Не удалось обновить матч");
      }
    },
    [updateMatch]
  );

  const handleDeleteMatch = useCallback(
    async (match: Match) => {
      try {
        await deleteMatch(match);
      } catch (err) {
        console.error("Ошибка при удалении матча:", err);
        alert("Не удалось удалить матч");
      }
    },
    [deleteMatch]
  );

  const handleShowHistoryPlayer = useCallback((participant: Participant) => {
    setHistoryParticipant(participant);
    setHistoryOpen(true);
  }, []);

  if (!tournament) return <p>Загрузка...</p>;

  const isAnon = user?.role === undefined;
  const isPlayerWithFixedAttacker = user?.role === "player" && !!user?.player_id;

  return (
    <div className="page-container">
      <NavigationBar />
      <h1 className="page-title">{tournament.name}</h1>

      <div className="page-content-container">
        <div className="card-grid">
          <TournamentCard
            tournament={tournament}
            participantsCount={participants.length}
            matchesCount={matches.length}
            displayName={false}
          />
        </div>

        {/* Табы */}
        <div className="card card-tabs">
          <button
            className={activeTab === "scheme" ? "card-btn tabs-button card-btn-act" : "card-btn tabs-button"}
            onClick={() => setActiveTab("scheme")}
          >
            Схема
          </button>
          <button
            className={activeTab === "matches" ? "card-btn tabs-button card-btn-act" : "card-btn tabs-button"}
            onClick={() => setActiveTab("matches")}
          >
            Матчи
          </button>
          <button
            className={activeTab === "participants" ? "card-btn tabs-button card-btn-act" : "card-btn tabs-button"}
            onClick={() => setActiveTab("participants")}
          >
            Участники
          </button>
          <button
            className={activeTab === "rating" ? "card-btn tabs-button card-btn-act" : "card-btn tabs-button"}
            onClick={() => setActiveTab("rating")}
          >
            Результаты
          </button>
        </div>

        {/* Добавление матча — карточка */}
        {activeTab !== "participants" && activeTab !== "rating" && tournament.isPyramid() && (
          <LoggedIn>
            <AddMatchCard
              options={options}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              matchDate={matchDate}
              setMatchDate={setMatchDate}
              matchScore={matchScore}
              setMatchScore={setMatchScore}
              isAnon={isAnon}
              isPlayerWithFixedAttacker={isPlayerWithFixedAttacker}
              onAddMatch={handleAddMatch}
            />
          </LoggedIn>
        )}

        {/* Контент вкладок */}
        <div>
          {activeTab === "scheme" && (
            <FormatView
              tournament={tournament}
              participants={participants}
              matches={matches}
              selectedIds={selectedIds}
              onSelect={setSelectedIds}
              onShowHistoryPlayer={handleShowHistoryPlayer}
              onSaveScoreRoundRobin={handleSaveScore}
              onPositionsChange={updatePositions}
            />
          )}

          {activeTab === "matches" && (
            <MatchHistoryView matches={matches} onEditMatch={handleEditMatchSave} onDeleteMatch={handleDeleteMatch} />
          )}

          {activeTab === "participants" && <ParticipantsView />}

          {activeTab === "rating" && (
            <RatingView
              onShowHistory={(participant) => {
                if (participant?.player !== undefined) {
                  setHistoryParticipant(participant);
                  setHistoryOpen(true);
                }
              }}
              matches={matches}
            />
          )}
        </div>

        {/* Модалка истории */}
        {historyParticipant && (
          <MatchHistoryModal
            isOpen={historyOpen}
            onClose={() => setHistoryOpen(false)}
            participant={historyParticipant}
            matches={matches}
            onEditMatch={handleEditMatchSave}
            onDeleteMatch={handleDeleteMatch}
          />
        )}
      </div>
    </div>
  );
}

// Вспомогательный мемо-компонент для схемы
const FormatView = React.memo(function FormatView({
  tournament,
  participants,
  matches,
  selectedIds,
  onSelect,
  onShowHistoryPlayer,
  onSaveScoreRoundRobin,
  onPositionsChange,
}: {
  tournament: Tournament;
  participants: Participant[];
  matches: Match[];
  selectedIds: number[];
  onSelect: (ids: number[]) => void;
  onShowHistoryPlayer: (participant: Participant) => void;
  onSaveScoreRoundRobin: (
    aId: number,
    bId: number,
    score: string,
    meta?: { phase: PhaseType; groupIndex?: number | null; roundIndex?: number | null }
  ) => void;
  onPositionsChange: (next: Participant[]) => Promise<void> | void;
}) {
  const handleShowHistory = useCallback(
    (participant?: Participant) => {
      if (participant) onShowHistoryPlayer(participant);
    },
    [onShowHistoryPlayer]
  );

  if (tournament.isRoundRobin()) {
    return <RoundRobinView participants={participants} matches={matches} onSaveScore={onSaveScoreRoundRobin} />;
  }

  if (tournament.isSingleElimination()) {
    return <SingleEliminationView participants={participants} matches={matches} onSaveScore={onSaveScoreRoundRobin} />;
  }

  if (tournament.isDoubleElimination()) {
    return <DoubleEliminationView participants={participants} matches={matches} onSaveScore={onSaveScoreRoundRobin} />;
  }

  if (tournament.isGroupsPlayoff()) {
    return (
      <GroupPlusPlayoffView
        participants={participants}
        matches={matches}
        onSaveScore={onSaveScoreRoundRobin}
        groupsCount={tournament.settings.groupsplayoff.groupsCount}
      />
    );
  }

  if (tournament.isSwiss()) {
    return <SwissView participants={participants} matches={matches} onSaveScore={onSaveScoreRoundRobin} roundsCount={5} />;
  }

  // "pyramid" и fallback используют один и тот же обработчик
  return (
    <PyramidView
      participants={participants}
      selectedIds={selectedIds}
      onSelect={onSelect}
      onShowHistory={handleShowHistory}
      matches={matches}
      onPositionsChange={onPositionsChange}
      maxLevel={tournament.settings.pyramid.maxLevel}
    />
  );
});