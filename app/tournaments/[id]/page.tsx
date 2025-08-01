"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TournamentsRepository } from "../../repositories/TournamentsRepository";
import { PlayersRepository } from "../../repositories/PlayersRepository";
import { TeamsRepository } from "../../repositories/TeamsRepository";
import { MatchRepository } from "../../repositories/MatchRepository";
import { Tournament } from "@/app/models/Tournament";
import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";
import { Participant } from "@/app/models/Participant";
import { PyramidView } from "./PyramidView";
import { MatchHistoryModal } from "./MatchHistoryModal";

import "./Page.css";

export default function TournamentPage() {
  const params = useParams<{ id: string }>();
  const tournamentId = parseInt(params?.id ?? "", 10);

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [allTeams, setAllTeams] = useState<{ id: number; name: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"pyramid" | "matches">("pyramid");

  const [matchDate, setMatchDate] = useState<string>("");
  const [participant1Id, setParticipant1Id] = useState<number | null>(null);
  const [participant2Id, setParticipant2Id] = useState<number | null>(null);
  const [matchScore, setMatchScore] = useState<string>("");

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyPlayerId, setHistoryPlayerId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      if (!tournamentId) return;

      const allT = await TournamentsRepository.loadAll();
      const t = allT.find((x) => x.id === tournamentId);
      setTournament(t || null);

      const parts = await TournamentsRepository.loadParticipants(tournamentId);
      setParticipants(parts);

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
    if (!participant1Id || !participant2Id || !matchDate || !tournament) {
      alert("Заполни все поля");
      return;
    }

    try {
      const scores = matchScore
        .split(",")
        .map((set) => set.trim().split("-").map(Number)) as [number, number][];

      const team1 = [participant1Id];
      const team2 = [participant2Id];

      await MatchRepository.addMatch(
        new Date(matchDate),
        tournament.tournament_type,
        scores,
        team1,
        team2,
        tournament.id
      );

      setMatchDate("");
      setMatchScore("");
      setParticipant1Id(null);
      setParticipant2Id(null);

      const m = await MatchRepository.loadMatches(tournamentId);
      setMatches(m);
    } catch (err) {
      console.error("Ошибка при добавлении матча:", err);
      alert("Не удалось добавить матч");
    }
  };

  if (!tournament) return <p>Загрузка...</p>;

  const allItems = tournament.tournament_type === "single" ? allPlayers : allTeams;

  return (
    <div className="container">
      {/* --- карточка турнира --- */}
      <div className="tournament-card">
        <div className="tournament-header">
          <h1>{tournament.name}</h1>
          <span className={`status ${tournament.status}`}>
            {tournament.status === "draft"
              ? "Черновик"
              : tournament.status === "ongoing"
              ? "В процессе"
              : "Завершен"}
          </span>
        </div>

        <div className="tournament-details">
          <p>
            🏆 Тип:{" "}
            {tournament.tournament_type === "single" ? "Одиночный" : "Парный"}
          </p>
          <p>
            📅 {tournament.start_date} → {tournament.end_date || "?"}
          </p>
        </div>
      </div>

      {/* --- блок вкладки + форма добавления матча справа --- */}
      <div className="tabs-row">
        <div className="tabs">
          <button
            className={activeTab === "pyramid" ? "active" : ""}
            onClick={() => setActiveTab("pyramid")}
          >
            Пирамида
          </button>
          <button
            className={activeTab === "matches" ? "active" : ""}
            onClick={() => setActiveTab("matches")}
          >
            Матчи
          </button>

          
            Дата:
            <input
              type="date"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
            />

          <label>
            <select
              onChange={(e) => setParticipant1Id(Number(e.target.value))}
              value={participant1Id || ""}
            >
              <option value="">-- Нападение --</option>
              {allItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <select
              onChange={(e) => setParticipant2Id(Number(e.target.value))}
              value={participant2Id || ""}
            >
              <option value="">-- Защита --</option>
              {allItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <input
              type="text"
              placeholder="Счет, например: 6-4, 4-6, 10-8"
              value={matchScore}
              onChange={(e) => setMatchScore(e.target.value)}
            />
          </label>

          <button onClick={handleAddMatch}>Добавить</button>

          

        </div>
      </div>

      {/* --- контент вкладок --- */}
      <div className="tab-content">
        {activeTab === "pyramid" && (
          <div>
            <PyramidView
              participants={participants}
              selectedId={null}
              onSelect={() => {}}
              onShowHistory={(id) => {
                if (id !== undefined) {
                  setHistoryPlayerId(id);
                  setHistoryOpen(true);
                }
              }}
              matches={matches}
            />
          </div>
        )}

        {activeTab === "matches" && (
          <div>
            {matches.length === 0 ? (
              <p>Матчей пока нет</p>
            ) : (
              <table className="matches-table">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Игрок 1</th>
                    <th>Игрок 2</th>
                    <th>Счёт</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((m) => (
                    <tr key={m.id}>
                      <td>{m.date.toDateString()}</td>
                      <td>{m.player1?.name || m.team1?.name || "??"}</td>
                      <td>{m.player2?.name || m.team2?.name || "??"}</td>
                      <td>{m.scores || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* модалка истории */}
      <MatchHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        matches={matches}
        playerId={historyPlayerId}
        onEditMatch={() => {}}
        onDeleteMatch={() => {}}
      />
    </div>
  );
}