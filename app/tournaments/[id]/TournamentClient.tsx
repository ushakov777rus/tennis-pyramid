"use client";

import { useEffect, useMemo, useState } from "react";
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

function FormatView({
  tournament,
  participants,
  matches,
  maxLevel,
  selectedIds,
  setSelectedIds,
  setHistoryPlayer,
  setHistoryOpen,
}: {
  tournament: Tournament;
  participants: Participant[];
  matches: Match[];
  maxLevel: number;
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  setHistoryPlayer: (p?: Player) => void;
  setHistoryOpen: (v: boolean) => void;
}) {
  const format = tournament.format ?? "pyramid";

  switch (format) {
    case "pyramid":
      return (
        <PyramidView
          participants={participants}
          maxLevel={maxLevel}
          selectedIds={selectedIds}
          onSelect={setSelectedIds}
          onShowHistory={(participant) => {
            if (participant?.player) {
              setHistoryPlayer(participant.player);
              setHistoryOpen(true);
            }
          }}
          matches={matches}
        />
      );

    case "round_robin":
      return <RoundRobinView participants={participants} matches={matches} />;

    default:
      return (
        <div style={{ padding: 12 }}>
          Неизвестный формат «{String(format)}». Показана пирамида по умолчанию.
          <PyramidView
            participants={participants}
            maxLevel={maxLevel}
            selectedIds={selectedIds}
            onSelect={setSelectedIds}
            onShowHistory={(participant) => {
              if (participant?.player) {
                setHistoryPlayer(participant.player);
                setHistoryOpen(true);
              }
            }}
            matches={matches}
          />
        </div>
      );
  }
}

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

  const [activeTab, setActiveTab] = useState<Tab>("scheme");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyPlayer, setHistoryPlayer] = useState<Player | undefined>(undefined);

  const today = new Date().toISOString().split("T")[0];
  const [matchDate, setMatchDate] = useState<string>(today);
  const [matchScore, setMatchScore] = useState<string>("");

  const maxLevel = useMemo(
    () => (participants.length ? participants.reduce((max, p) => Math.max(max, p.level ?? 0), 0) : 15),
    [participants]
  );

  const { mostPlayed, mostWins } = useMemo(() => calcTopPlayers(matches), [matches]);

  // закрепляем игрока как нападающего, если он залогинен
// закрепляем игрока как нападающего, если он залогинен
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
  // ✅ фиксированный по размеру массив зависимостей
}, [
  user?.role,
  user?.player_id,
  tournament?.tournament_type, // или tournament?.id, если тип не меняется
  participants,                // можно заменить на participants.length, если нужно реже триггерить
]);
  // Опции для кастомного селекта
// ЗАМЕНИ ЭТО:
// const allItems = tournament?.isSingle() ? players : teams;
// const options = useMemo(
//   () => allItems.map((item: any) => ({
//     value: item.id,
//     label: (item as Player).name ?? (item as { id: number; name: string }).name,
//   })), [allItems]
// );

// НА ЭТО:
const selectableItems = useMemo(() => {
  if (!tournament) return [] as Array<Player | Team>;
  const isSingle = tournament.isSingle();

  // Берём только участников турнира
  const items = participants
    .map((p) => (isSingle ? p.player : p.team))
    .filter((x): x is Player | Team => !!x);

  // Убираем дубликаты на случай, если модель допускает повтор
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

  const handleAddMatch = async () => {
    if (!tournament) return;
    if (selectedIds.length < 2 || !matchDate) {
      alert("Выбери двух игроков и дату матча");
      return;
    }
    try {
      const scores = matchScore
        .split(",")
        .map((set) => set.trim().split("-").map(Number)) as [number, number][];

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

      setMatchDate(today);
      setMatchScore("");
      setSelectedIds(user?.role === "player" && user.player_id ? [user.player_id] : []);
      await reload();
    } catch (err) {
      console.error("Ошибка при добавлении матча:", err);
      alert("Не удалось добавить матч");
    }
  };

  const handleEditMatchSave = async (updatedMatch: Match) => {
    try {
      await updateMatch(updatedMatch);
    } catch (err) {
      console.error("Ошибка при обновлении матча:", err);
      alert("Не удалось обновить матч");
    }
  };

  const handleDeleteMatch = async (match: Match) => {
    try {
      await deleteMatch(match);
    } catch (err) {
      console.error("Ошибка при удалении матча:", err);
      alert("Не удалось удалить матч");
    }
  };

  if (!tournament) return <p>Загрузка...</p>;

  const isAnon = user?.role === undefined;
  const isPlayerWithFixedAttacker = user?.role === "player" && !!user?.player_id;

  return (
    <div className="page-container">
      <NavigationBar />
      <h1 className="page-title">{tournament.name}</h1>

      <div className="page-content-container">
        <TournamentCard
          tournament={tournament}
          participantsCount={participants.length}
          matchesCount={matches.length}
          mostMatches={mostPlayed?.player}
          mostMatchesCnt={mostPlayed?.games ?? 0}
          mostWins={mostWins?.player}
          mostWinsCnt={mostWins?.wins ?? 0}
        />

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

        {/* добавление матча (кроме вкладок участники/звания) */}
        {activeTab !== "participants" && activeTab !== "rating" && (
          <LoggedIn>
            <div className="card card-tabs card-tabs-wrap">
              {/* Нападение */}
              <CustomSelect
                className="card-input card-input-add-match"
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
                className="card-input card-input-add-match"
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
                className="card-input card-input-add-match"
              />

              <input
                type="text"
                placeholder="6-4, 4-6, 11-8"
                value={matchScore}
                onChange={(e) => setMatchScore(e.target.value)}
                className="card-input card-input-add-match"
              />

              <button onClick={handleAddMatch} className="card-btn card-btn-act">
                Добавить
              </button>
            </div>
          </LoggedIn>
        )}

        {/* контент вкладок */}
        <div>
          {activeTab === "scheme" && (
            <FormatView
              tournament={tournament}
              participants={participants}
              matches={matches}
              maxLevel={maxLevel}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              setHistoryPlayer={setHistoryPlayer}
              setHistoryOpen={setHistoryOpen}
            />
          )}

          {activeTab === "matches" && (
            <MatchHistoryView
              player={null}
              matches={matches}
              onEditMatch={(updated) => handleEditMatchSave(updated)}
              onDeleteMatch={(m) => handleDeleteMatch(m)}
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

        {/* модалка истории */}
        {historyPlayer && (
          <MatchHistoryModal
            isOpen={historyOpen}
            onClose={() => setHistoryOpen(false)}
            player={historyPlayer}
            matches={matches}
            onEditMatch={(m) => handleEditMatchSave(m)}
            onDeleteMatch={(m) => handleDeleteMatch(m)}
          />
        )}
      </div>
    </div>
  );
}