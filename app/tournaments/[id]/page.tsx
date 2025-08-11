"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { Tournament } from "@/app/models/Tournament";
import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";
import { Participant } from "@/app/models/Participant";

import { NavigationBar } from "@/app/components/NavigationBar";
import { TournamentCard } from "@/app/components/TournamentCard";
import { useUser } from "@/app/components/UserContext";

import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { TeamsRepository } from "@/app/repositories/TeamsRepository";
import { MatchRepository } from "@/app/repositories/MatchRepository";

import { PyramidView } from "@/app/components/PyramidView";
import { MatchHistoryModal } from "@/app/components/MatchHistoryModal";
import { MatchHistoryView } from "@/app/components/MatchHistoryView";
import { ParticipantsView } from "@/app/components/ParticipantsView";

import { calcTopPlayers } from "@/app/utils/calcTopPlayers";

import "./Page.css";
import { LoggedIn } from "@/app/components/RoleGuard";
import { ViewportDebug } from "@/app/components/ViewportDebug";

// ⬇⬇⬇ ДОБАВЛЕНО: наш кастомный селект
import { CustomSelect } from "@/app/components/CustomSelect"; // <-- скорректируй путь при необходимости
import "@/app/components/CustomSelect.css";

export default function TournamentPage() {
  const params = useParams<{ id: string }>();
  const tournamentId = parseInt(params?.id ?? "", 10);

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [maxLevel, setMaxLevel] = useState<number | 15>(15);
  const [matches, setMatches] = useState<Match[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [allTeams, setAllTeams] = useState<{ id: number; name: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"pyramid" | "matches" | "participants">("pyramid");

  const today = new Date().toISOString().split("T")[0];
  const [matchDate, setMatchDate] = useState<string>(today);
  const [matchScore, setMatchScore] = useState<string>("");

  // единый массив выбранных id: [нападающий, защитник]
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyPlayer, setHistoryPlayer] = useState<Player>();

  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const { user } = useUser();

  const { mostPlayed, mostWins } = calcTopPlayers(matches);

  // если игрок залогинен — фиксируем его как selectedIds[0]
  useEffect(() => {
    if (user?.role == "player" && user.player_id) {
      setSelectedIds([user.player_id]); // ставим игрока первым
    } else if (user?.role == undefined) {
      setSelectedIds([]);
    }
  }, [user]);

  useEffect(() => {
    async function load() {
      if (!tournamentId) return;

      const allT = await TournamentsRepository.loadAll();
      const t = allT.find((x) => x.id === tournamentId);
      setTournament(t || null);

      const parts = await TournamentsRepository.loadParticipants(tournamentId);
      setParticipants(parts);

      if (!parts?.length) return;
      setMaxLevel(parts.reduce((max, p) => Math.max(max, p.level ?? 0), 0));

      const m = await MatchRepository.loadMatches(tournamentId);
      setMatches(m);

      if (t?.isSingle()) {
        setAllPlayers(await PlayersRepository.loadAll());
      } else {
        setAllTeams(await TeamsRepository.loadAll());
      }
    }
    load();
  }, [tournamentId]);

  // ⬇⬇⬇ Готовим список опций для CustomSelect
  const allItems = tournament?.tournament_type === "single" ? allPlayers : allTeams;

  const options = useMemo(
    () =>
      allItems.map((item) => ({
        value: item.id,
        label: (item as Player).name ?? (item as { id: number; name: string }).name,
      })),
    [allItems]
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

      const team1 = [selectedIds[0]];
      const team2 = [selectedIds[1]];

      await MatchRepository.addMatch(
        new Date(matchDate),
        tournament.tournament_type,
        scores,
        team1,
        team2,
        tournament.id
      );

      // сброс полей
      setMatchDate(today);
      setMatchScore("");
      setSelectedIds(user?.role == "player" && user.player_id ? [user.player_id] : []);

      // перезагрузка
      const m = await MatchRepository.loadMatches(tournamentId);
      setMatches(m);
      const parts = await TournamentsRepository.loadParticipants(tournamentId);
      setParticipants(parts);
    } catch (err) {
      console.error("Ошибка при добавлении матча:", err);
      alert("Не удалось добавить матч");
    }
  };

  const handleEditMatchSave = async (updatedMatch: Match) => {
    try {
      await MatchRepository.updateMatch(updatedMatch);
      const m = await MatchRepository.loadMatches(tournamentId);
      setMatches(m);
      setEditingMatch(null);
    } catch (err) {
      console.error("Ошибка при обновлении матча:", err);
      alert("Не удалось обновить матч");
    }
  };

  const handleDeleteMatch = async (match: Match) => {
    try {
      await MatchRepository.deleteMatch(match);
      const m = await MatchRepository.loadMatches(tournamentId);
      setMatches(m);
    } catch (err) {
      console.error("Ошибка при удалении матча:", err);
      alert("Не удалось удалить матч");
    }
  };

  if (!tournament) return <p>Загрузка...</p>;

  // ⬇⬇⬇ Условия блокировки (как у вас было с <select>)
  const isAnon = user?.role == undefined;
  const isPlayerWithFixedAttacker = user?.role == "player" && !!user?.player_id;

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
          mostMatchesCnt={mostPlayed?.games ? mostPlayed?.games : 0}
          mostWins={mostWins?.player}
          mostWinsCnt={mostWins?.wins ? mostWins?.wins : 0}
        />

        <div className="card card-tabs">
          <button
            className={activeTab === "pyramid" ? "card-btn tabs-button card-btn-act" : "card-btn tabs-button"}
            onClick={() => setActiveTab("pyramid")}
          >
            Пирамида
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
        </div>

        {/* --- добавление матча --- */}
        {activeTab !== "participants" && (
          <LoggedIn>
            <ViewportDebug />
            <div className="card card-tabs card-tabs-wrap">
              {/* ⬇⬇⬇ КАСТОМНЫЙ SELECT — Нападение */}
              <CustomSelect
                className="card-input card-input-add-match"
                options={options}
                value={selectedIds[0] ?? null}
                placeholder="-- Нападение --"
                disabled={isAnon || isPlayerWithFixedAttacker} // если игрок, нельзя менять нападающего
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

              {/* ⬇⬇⬇ КАСТОМНЫЙ SELECT — Защита */}
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

        {/* --- контент вкладок --- */}
        <div>
          {activeTab === "pyramid" && (
            <PyramidView
              participants={participants}
              maxLevel={maxLevel}
              selectedIds={selectedIds}
              onSelect={setSelectedIds}
              onShowHistory={(participant) => {
                if (participant?.player !== undefined) {
                  setHistoryPlayer(participant?.player);
                  setHistoryOpen(true);
                }
              }}
              matches={matches}
            />
          )}

          {activeTab === "matches" && (
            <MatchHistoryView
              player={null}
              matches={matches}
              onEditMatch={(updated) => {
                MatchRepository.updateMatch(updated);
              }}
              onDeleteMatch={(m) => {
                MatchRepository.deleteMatch(m);
              }}
            />
          )}

          {activeTab === "participants" && <ParticipantsView />}
        </div>

        {/* модалка истории */}
        {historyPlayer && (
          <MatchHistoryModal
            isOpen={historyOpen}
            onClose={() => setHistoryOpen(false)}
            matches={matches}
            player={historyPlayer}
            onEditMatch={(m) => handleEditMatchSave(m)}
            onDeleteMatch={(m) => handleDeleteMatch(m)}
          />
        )}
      </div>
    </div>
  );
}