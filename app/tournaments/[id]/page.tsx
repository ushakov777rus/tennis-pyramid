"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Tournament } from "@/app/models/Tournament";
import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";
import { Participant } from "@/app/models/Participant";

import { NavigationBar } from "@/app/components/NavigationBar";
import { TournamentCard } from "@/app/components/TournamentCard";
import { useUser } from "@/app/components/UserContext"; // 👈 добавляем

import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { TeamsRepository } from "@/app/repositories/TeamsRepository";
import { MatchRepository } from "@/app/repositories/MatchRepository";

import { PyramidView } from "./PyramidView";
import { MatchHistoryModal } from "./MatchHistoryModal";
import { MatchHistoryView } from "@/app/components/MatchHistoryView";
import { ParticipantsView } from "./ParticipantsView";

import { calcTopPlayers } from "@/app/utils/calcTopPlayers";

import "./Page.css";
import { LoggedIn } from "@/app/components/RoleGuard";

import { ViewportDebug } from "@/app/components/ViewportDebug";



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

  // теперь один массив для выбора
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyPlayerId, setHistoryPlayerId] = useState<number | null>(null);

  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const { user } = useUser(); // 👈 получаем юзера

  const { mostPlayed, mostWins } = calcTopPlayers(matches);

  // если игрок залогинен — фиксируем его как selectedIds[0]
  useEffect(() => {
    console.log("useEffect(() => {", user, "}")
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
 
      if (!parts?.length) return 0;
        setMaxLevel(parts.reduce((max, p) => Math.max(max, p.level ?? 0), 0));

      const m = await MatchRepository.loadMatches(tournamentId);
      setMatches(m);

      if (t?.tournament_type === "single") {
        setAllPlayers(await PlayersRepository.loadAll());
      } else {
        setAllTeams(await TeamsRepository.loadAll());
      }
    }
    load();
  }, [tournamentId]);
  

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

    // 👉 сбрасываем поля
    setMatchDate(today);  // снова текущая дата
    setMatchScore("");
    setSelectedIds([]);

    // 👉 перезагружаем матчи и участников
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

  const allItems = tournament.tournament_type === "single" ? allPlayers : allTeams;

  return (
    <div className="page-container">
      <NavigationBar />

      <h1 className="page-title">{tournament.name}</h1>

      <div className="page-content-container">
        
        {/* --- карточка турнира --- */}
        <TournamentCard 
          tournament={tournament} 
          participantsCount={participants.length} 
          matchesCount={matches.length}
          mostMatches={mostPlayed?.player}
          mostWins={mostWins?.player}
        />

          {/* ---------------------------------------------------- */}
          {/* --- блок вкладки + форма добавления матча справа --- */}
          {/* ---------------------------------------------------- */}
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
          
          {/* ---------------------------------------------------- */}
          {/* --- добавление матча ------------------------------- */}
          {/* ---------------------------------------------------- */}
          {activeTab !== "participants" && (
            
          <LoggedIn>
          <ViewportDebug />
          <div className="card">
        
            <select
              disabled={user?.role == undefined || user?.role == "player" && !!user?.player_id} // 👈 если есть player — нельзя менять
              onChange={(e) =>
                setSelectedIds((prev) => {
                  const newVal = Number(e.target.value);
                  if (!newVal) return prev;
                  if (prev.includes(newVal)) return prev;
                  if (prev.length === 0) return [newVal];
                  if (prev.length === 1) return [newVal, prev[1]];
                  return [newVal, prev[1]];
                })
              }
              value={selectedIds[0] || ""}
              className="card-input card-input-add-match"
            >
              <option value="">-- Нападение --</option>
              {allItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <select
              disabled={user?.role == undefined} 
              onChange={(e) =>
                setSelectedIds((prev) => {
                  const newVal = Number(e.target.value);
                  if (!newVal) return prev;
                  if (prev.includes(newVal)) return prev;
                  if (prev.length === 0) return [newVal];
                  if (prev.length === 1) return [...prev, newVal];
                  return [prev[0], newVal];
                })
              }
              value={selectedIds[1] || ""}
              className="card-input card-input-add-match"
            >
              <option value="">-- Защита --</option>
              {allItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

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

            <button onClick={handleAddMatch} className="card-btn card-btn-act">Добавить</button>
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
              onShowHistory={(id) => {
                if (id !== undefined) {
                  setHistoryPlayerId(id);
                  setHistoryOpen(true);
                }
              }}
              matches={matches}
            />
          )}

          {activeTab === "matches" && (
            <MatchHistoryView
              matches={matches}
              onEditMatch={(updated) => {
                // тут обновляем через MatchRepository
                MatchRepository.updateMatch(updated);
              }}
              onDeleteMatch={(m) => {
                // тут удаляем через MatchRepository
                console.log("Удаление:", m);
                MatchRepository.deleteMatch(m);
              }}
            />
          )}

          {activeTab === "participants" && (
            <ParticipantsView/>
          )}


        </div>

        {/* модалка истории */}
        <MatchHistoryModal
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
          matches={matches}
          playerId={historyPlayerId}
          onEditMatch={(m) => handleEditMatchSave(m)}        // ✅ передали
          onDeleteMatch={(m) => handleDeleteMatch(m)}             // ✅ передали
        />
      </div>
    </div>
  );
}