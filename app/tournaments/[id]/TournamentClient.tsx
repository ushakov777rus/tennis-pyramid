"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/app/components/UserContext";

import { Tournament } from "@/app/models/Tournament";
import { Player } from "@/app/models/Player";
import { Team } from "@/app/models/Team";
import { Match } from "@/app/models/Match";
import { Participant } from "@/app/models/Participant";

import { NavigationBar } from "@/app/components/NavigationBar";
import { TournamentCard } from "@/app/components/TournamentCard";
import { LoggedIn } from "@/app/components/RoleGuard";

import { RatingView } from "@/app/components/RatingView";
import { MatchHistoryModal } from "@/app/components/MatchHistoryModal";
import { MatchHistoryView } from "@/app/components/MatchHistoryView";
import { ParticipantsView } from "@/app/components/ParticipantsView";
import { AddMatchCard } from "@/app/components/AddMatchCard";

import { calcTopPlayers } from "@/app/utils/calcTopPlayers";
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
    players,
    participants,
    teams,
    matches,
    reload,
    addMatch,
    updateMatch,
    deleteMatch,
    updatePositions,
  } = useTournament();
  const { user } = useUser();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("scheme");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyPlayer, setHistoryPlayer] = useState<Player | undefined>(undefined);

  const [matchDate, setMatchDate] = useState<string>(todayISO);
  const [matchScore, setMatchScore] = useState<string>("");

  // (если где-то используешь)
  const { mostPlayed, mostWins } = useMemo(() => calcTopPlayers(matches), [matches]);

  // если игрок залогинен и участвует — закрепляем как нападающего
  useEffect(() => {
    const isSingle = typeof tournament?.isSingle === "function"
      ? tournament.isSingle()
      : tournament?.tournament_type === "single";

    if (user?.role === "player" && user.player_id && isSingle) {
      const isInTournament = participants.some((p) => p.player?.id === user.player_id);
      setSelectedIds(isInTournament ? [user.player_id] : []);
    } else {
      setSelectedIds([]);
    }
  }, [user?.role, user?.player_id, tournament?.tournament_type, participants]);

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
        label: (item as Player).name ?? (item as { id: number; name: string }).name,
      })),
    [selectableItems]
  );

  // Колбэки
  const handleAddMatch = useCallback(async () => {
    console.log("const handleAddMatch = useCallback(async () => {");
    if (!tournament) return;
    if (selectedIds.length < 2 || !matchDate) {
      alert("Выбери двух игроков и дату матча");
      return;
    }
    try {
      const scores = Match.parseScoreStringFlexible(matchScore);

      let player1: number | null = null;
      let player2: number | null = null;
      let team1: number | null = null;
      let team2: number | null = null;

      if (tournament.isSingle()) {
        player1 = selectedIds[0];
        player2 = selectedIds[1];
      } else {
        team1 = selectedIds[0];
        team2 = selectedIds[1];
      }

      await addMatch({
        date: new Date(matchDate),
        type: tournament.tournament_type,
        scores,
        player1,
        player2,
        team1,
        team2,
        tournamentId: tournament.id,
      });

      setMatchDate(todayISO);
      setMatchScore("");
      setSelectedIds(user?.role === "player" && user.player_id ? [user.player_id] : []);
      await reload();
    } catch (err) {
      console.error("Ошибка при добавлении матча:", err);
      alert("Не удалось добавить матч");
    }
  }, [tournament, selectedIds, matchDate, matchScore, addMatch, user?.role, user?.player_id, reload]);

  const handleEditMatchSave = useCallback(async (updatedMatch: Match) => {
    try {
      await updateMatch(updatedMatch);
    } catch (err) {
      console.error("Ошибка при обновлении матча:", err);
      alert("Не удалось обновить матч");
    }
  }, [updateMatch]);

  const handleDeleteMatch = useCallback(async (match: Match) => {
    try {
      await deleteMatch(match);
    } catch (err) {
      console.error("Ошибка при удалении матча:", err);
      alert("Не удалось удалить матч");
    }
  }, [deleteMatch]);

  const handleSaveScore = useCallback(async (aId: number, bId: number, score: string) => {
    if (!tournament) return;

    try {
      const scores = Match.parseScoreStringFlexible(score);

      const existing = matches.find((m) => {
        const id1 = m.player1?.id ?? m.team1?.id;
        const id2 = m.player2?.id ?? m.team2?.id;
        return (id1 === aId && id2 === bId) || (id1 === bId && id2 === aId);
      });

      const isSingle =
        typeof tournament.isSingle === "function"
          ? tournament.isSingle()
          : tournament.tournament_type === "single";

      if (existing) {
        const updated = { ...existing, scores } as Match;
        await updateMatch(updated);
      } else {
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
        });
      }

      await reload();
    } catch (err) {
      console.error("Ошибка при сохранении счёта:", err);
      alert(err instanceof Error ? err.message : "Не удалось сохранить счёт");
    }
  }, [tournament, matches, updateMatch, addMatch, reload]);

  const handleShowHistoryPlayer = useCallback((p?: Player) => {
    if (!p) return;
    setHistoryPlayer(p);
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
            Звания
          </button>
        </div>

        {/* Добавление матча — вынесено в отдельный компонент */}
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
            <MatchHistoryView
              player={null}
              matches={matches}
              onEditMatch={handleEditMatchSave}
              onDeleteMatch={handleDeleteMatch}
            />
          )}

          {activeTab === "participants" && <ParticipantsView />}

          {activeTab === "rating" && (
            <RatingView
              onShowHistory={(participant) => {
                if (participant?.player !== undefined) {
                  setHistoryPlayer(participant.player);
                  setHistoryOpen(true);
                }
              }}
              matches={matches}
            />
          )}
        </div>

        {/* Модалка истории */}
        {historyPlayer && (
          <MatchHistoryModal
            isOpen={historyOpen}
            onClose={() => setHistoryOpen(false)}
            player={historyPlayer}
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
  onShowHistoryPlayer: (p?: Player) => void;
  onSaveScoreRoundRobin: (aId: number, bId: number, score: string) => void;
  onPositionsChange: (next:Participant[]) => Promise<void> | void;
}) {
  // ✅ Хук вызывается всегда, неусловно
  const handleShowHistory = useCallback(
    (participant?: Participant) => {
      if (participant?.player) onShowHistoryPlayer(participant.player);
    },
    [onShowHistoryPlayer]
  );

  if (tournament.isRoundRobin()) {
    return (
      <RoundRobinView
        participants={participants}
        matches={matches}
        onSaveScore={onSaveScoreRoundRobin}
      />
    );
  }

  if (tournament.isSingleElimination()) {
    return (
      <SingleEliminationView
        participants={participants}
        matches={matches}
        onSaveScore={onSaveScoreRoundRobin}
      />
    );
  }

  if (tournament.isDoubleElimination()) {
    return (
      <DoubleEliminationView
        participants={participants}
        matches={matches}
        onSaveScore={onSaveScoreRoundRobin}
      />
    );
  }

  if (tournament.isGroupsPlayoff()) {
    return (
      <GroupPlusPlayoffView
        participants={participants}
        matches={matches}
        onSaveScore={onSaveScoreRoundRobin}
      />
    );
  }

  if (tournament.isSwiss()) {
    return (
      <SwissView
        participants={participants}
        matches={matches}
        onSaveScore={onSaveScoreRoundRobin}
        roundsCount={5}
      />
    );
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
    />
  );
});