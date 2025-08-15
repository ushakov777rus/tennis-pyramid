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

import { PyramidView } from "@/app/components/PyramidView";
import { RoundRobinView } from "@/app/components/RoundRobinView";
import { RatingView } from "@/app/components/RatingView";
import { MatchHistoryModal } from "@/app/components/MatchHistoryModal";
import { MatchHistoryView } from "@/app/components/MatchHistoryView";
import { ParticipantsView } from "@/app/components/ParticipantsView";

import { calcTopPlayers } from "@/app/utils/calcTopPlayers";
import "./Page.css";
import { CustomSelect } from "@/app/components/CustomSelect";
import "@/app/components/CustomSelect.css";

import { useTournament } from "./TournamentProvider";

type Tab = "scheme" | "matches" | "participants" | "rating";

// ──────────────────────────────────────────────────────────────────────────────
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ/ФУНКЦИИ
// ──────────────────────────────────────────────────────────────────────────────

const todayISO = new Date().toISOString().split("T")[0];

const FormatView = React.memo(function FormatView({
  tournament,
  participants,
  matches,
  maxLevel,
  selectedIds,
  onSelect,
  onShowHistoryPlayer,
  onSaveScoreRoundRobin,
}: {
  tournament: Tournament;
  participants: Participant[];
  matches: Match[];
  maxLevel: number;
  selectedIds: number[];
  onSelect: (ids: number[]) => void;
  onShowHistoryPlayer: (p?: Player) => void;
  onSaveScoreRoundRobin: (aId: number, bId: number, score: string) => void;
}) {
  const format = tournament.format ?? "pyramid";

  if (format === "pyramid") {
    const handleShowHistory = useCallback(
      (participant?: Participant) => {
        if (participant?.player) onShowHistoryPlayer(participant.player);
      },
      [onShowHistoryPlayer]
    );

    return (
      <PyramidView
        participants={participants}
        maxLevel={maxLevel}
        selectedIds={selectedIds}
        onSelect={onSelect}                // setState — стабильная ссылка
        onShowHistory={handleShowHistory}  // useCallback
        matches={matches}
      />
    );
  }

  if (format === "round_robin") {
    return (
      <RoundRobinView
        participants={participants}
        matches={matches}
        onSaveScore={onSaveScoreRoundRobin}
      />
    );
  }

  // Fallback
  return (
    <div style={{ padding: 12 }}>
      Неизвестный формат «{String(format)}». Показана пирамида по умолчанию.
      <PyramidView
        participants={participants}
        maxLevel={maxLevel}
        selectedIds={selectedIds}
        onSelect={onSelect}
        onShowHistory={(participant) => {
          if (participant?.player) onShowHistoryPlayer(participant.player);
        }}
        matches={matches}
      />
    </div>
  );
});

// ──────────────────────────────────────────────────────────────────────────────
// ОСНОВНОЙ КОМПОНЕНТ
// ──────────────────────────────────────────────────────────────────────────────

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
  } = useTournament();

  const { user } = useUser();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("scheme");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyPlayer, setHistoryPlayer] = useState<Player | undefined>(undefined);

  const [matchDate, setMatchDate] = useState<string>(todayISO);
  const [matchScore, setMatchScore] = useState<string>("");

  // Максимальный уровень пирамиды
  const maxLevel = useMemo(
    () =>
      participants.length
        ? participants.reduce((max, p) => Math.max(max, p.level ?? 0), 0)
        : 15,
    [participants]
  );

  // Топы (если где-то используются в будущем)
  const { mostPlayed, mostWins } = useMemo(() => calcTopPlayers(matches), [matches]);

  // Если игрок залогинен и участвует в одиночном турнире, закрепляем его как "нападающего"
  useEffect(() => {
    const isSingle =
      typeof tournament?.isSingle === "function"
        ? tournament.isSingle()
        : tournament?.tournament_type === "single";

    if (user?.role === "player" && user.player_id && isSingle) {
      const isInTournament = participants.some(
        (p) => p.player?.id === user.player_id
      );
      setSelectedIds(isInTournament ? [user.player_id] : []);
    } else {
      setSelectedIds([]);
    }
  }, [user?.role, user?.player_id, tournament?.tournament_type, participants]);

  // Список доступных для выбора игроков/команд — только участники турнира
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
        label:
          (item as Player).name ?? (item as { id: number; name: string }).name,
      })),
    [selectableItems]
  );

  // ────────────────────────────────────────────────────────────────────────────
  // ХЭНДЛЕРЫ (useCallback, чтобы не трогать лишние ререндеры)
  // ────────────────────────────────────────────────────────────────────────────

  const handleAddMatch = useCallback(async () => {
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

  // Универсальное сохранение счёта для кругового турнира
  const handleSaveScore = useCallback(
    async (aId: number, bId: number, score: string) => {
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
    },
    [tournament, matches, updateMatch, addMatch, reload]
  );

  const handleShowHistoryPlayer = useCallback((p?: Player) => {
    if (!p) return;
    setHistoryPlayer(p);
    setHistoryOpen(true);
  }, []);

  // ────────────────────────────────────────────────────────────────────────────

  if (!tournament) return <p>Загрузка...</p>;

  const isAnon = user?.role === undefined;
  const isPlayerWithFixedAttacker =
    user?.role === "player" && !!user?.player_id;

  return (
    <div className="page-container">
      <NavigationBar />
      <h1 className="page-title">{tournament.name}</h1>

      <div className="page-content-container">
        <TournamentCard
          tournament={tournament}
          participantsCount={participants.length}
          matchesCount={matches.length}
        />

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

        {/* Добавление матча (только для пирамиды и не на вкладках участники/звания) */}
        {activeTab !== "participants" && activeTab !== "rating" && tournament.isPyramid() && (
          <LoggedIn>
            <div className="card card-tabs card-tabs-wrap">
              {/* Нападение */}
              <CustomSelect
                className="input card-input-add-match"
                options={options}
                value={selectedIds[0] ?? null}
                placeholder="-- Нападение --"
                disabled={isAnon || isPlayerWithFixedAttacker}
                onChange={(val) => {
                  const newVal = Number(val);
                  setSelectedIds((prev) => {
                    if (!newVal) return prev;
                    if (prev.includes(newVal)) return prev;
                    if (prev.length === 0) return [newVal];
                    if (prev.length === 1) return [newVal, prev[1]];
                    return [newVal, prev[1]];
                  });
                }}
              />

              {/* Защита */}
              <CustomSelect
                className="input card-input-add-match"
                options={options}
                value={selectedIds[1] ?? null}
                placeholder="-- Защита --"
                disabled={isAnon}
                onChange={(val) => {
                  const newVal = Number(val);
                  setSelectedIds((prev) => {
                    if (!newVal) return prev;
                    if (prev.includes(newVal)) return prev;
                    if (prev.length === 0) return [newVal];
                    if (prev.length === 1) return [...prev, newVal];
                    return [prev[0], newVal];
                  });
                }}
              />

              <input
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                className="input card-input-add-match"
              />

              <input
                type="text"
                placeholder="6-4, 4-6, 11-8"
                value={matchScore}
                onChange={(e) => setMatchScore(e.target.value)}
                className="input card-input-add-match"
              />

              <button onClick={handleAddMatch} className="card-btn card-btn-act">
                Добавить
              </button>
            </div>
          </LoggedIn>
        )}

        {/* Контент вкладок */}
        <div>
          {activeTab === "scheme" && (
            <FormatView
              tournament={tournament}
              participants={participants}
              matches={matches}
              maxLevel={maxLevel}
              selectedIds={selectedIds}
              onSelect={setSelectedIds}
              onShowHistoryPlayer={handleShowHistoryPlayer}
              onSaveScoreRoundRobin={handleSaveScore}
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