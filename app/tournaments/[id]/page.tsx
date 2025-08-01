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
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [matchDate, setMatchDate] = useState<string>("");
  const [participant1Id, setParticipant1Id] = useState<number | null>(null);
  const [participant2Id, setParticipant2Id] = useState<number | null>(null);
  const [matchScore, setMatchScore] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<number>(15); // по умолчанию на 15 уровень
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyPlayerId, setHistoryPlayerId] = useState<number | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  useEffect(() => {
    async function load() {
      
      if (!tournamentId) {
        console.log("Tournament id: ", tournamentId)
        return; // null или NaN — не грузим
      }

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

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addParticipants = async () => {
    if (!selectedIds.length || !tournament) return;

    for (const id of selectedIds) {
      if (tournament.tournament_type === "single") {
        await TournamentsRepository.addPlayer(tournamentId, id, selectedLevel);
      } else {
        await TournamentsRepository.addTeam(tournamentId, id, selectedLevel);
      }
    }

    const parts = await TournamentsRepository.loadParticipants(tournamentId);
    setParticipants(parts);
    setSelectedIds([]);
  };

  const removeParticipant = async (id: number) => {
    await TournamentsRepository.removeParticipant(id);
    const parts = await TournamentsRepository.loadParticipants(tournamentId);
    setParticipants(parts);
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

  const handleDeleteMatch = async (matchId: number) => {
    try {
      await MatchRepository.deleteMatch(matchId);
      const m = await MatchRepository.loadMatches(tournamentId);
      setMatches(m);
    } catch (err) {
      console.error("Ошибка при удалении матча:", err);
      alert("Не удалось удалить матч");
    }
  };

  const handleAddMatch = async () => {
    if (!participant1Id || !participant2Id || !matchDate || !tournament) {
      alert("Заполни все поля");
      return;
    }

    try {
      // преобразуем строку "6-4, 4-6, 10-8" → [[6,4],[4,6],[10,8]]
      const scores = matchScore
        .split(",")
        .map((set) => set.trim().split("-").map(Number)) as [number, number][];

      // одиночный турнир → по 1 id в каждой "команде"
      const team1 = [participant1Id];
      const team2 = [participant2Id];

      await MatchRepository.saveMatch(
        new Date(matchDate),
        tournament.tournament_type,
        scores,
        team1,
        team2,
        tournament.id
      );

      // очистка формы
      setMatchDate("");
      setMatchScore("");
      setParticipant1Id(null);
      setParticipant2Id(null);

      // обновляем список матчей
      const m = await MatchRepository.loadMatches(tournamentId);
      setMatches(m);
    } catch (err) {
      console.error("Ошибка при добавлении матча:", err);
      alert("Не удалось добавить матч");
    }
  };

  if (!tournament) return <p>Загрузка...</p>;

  // Все доступные участники (игроки или команды)
  const allItems = tournament.tournament_type === "single" ? allPlayers : allTeams;

  // Список id уже добавленных участников
  const existingIds = participants.map((p) => p.player?.id ?? p.team);

  // Оставляем только тех, кого ещё нет в турнире
  const availableItems = allItems.filter((item) => !existingIds.includes(item.id));

  return (
    <div className="container">
      <h1>Турнир: {tournament.name}</h1>

      <div className="tournament-card">
        <div className="tournament-header">
          <h3>{tournament.name}</h3>
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

      <h2>Участники</h2>
      <PyramidView
        participants={participants}
        selectedId={participant1Id}
        onSelect={setParticipant1Id}
        onShowHistory={(id) => {
          if (id !== undefined) {
            setHistoryPlayerId(id);
            setHistoryOpen(true);
          }
        }}
        matches={matches}
      />

      {/* Вставляем модалку */}
      <MatchHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        matches={matches}
        playerId={historyPlayerId}
        onEditMatch={(m) => handleEditMatchSave(m)}        // ✅ передали
        onDeleteMatch={handleDeleteMatch}             // ✅ передали
      />

      <div className="add-participant">
        <h3>Добавить участников</h3>

        <div className="checkbox-list">
          {availableItems.map((item) => (
            <div
              key={item.id}
              className={`checkbox-item ${selectedIds.includes(item.id) ? "selected" : ""}`}
              onClick={() => toggleSelected(item.id)}
            >
              <div>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelected(item.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="player-name">{item.name}</div>
            </div>
          ))}
        </div>

        <div className="add-controls">
          <label>
            Уровень:{" "}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(Number(e.target.value))}
            >
              {Array.from({ length: 15 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </label>

          <button onClick={addParticipants} disabled={selectedIds.length === 0}>
            Добавить выбранных
          </button>
        </div>
      </div>

      <h2>Матчи</h2>
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
                <td>{m.player1?.name || m.team1?.teamName || "??"}</td>
                <td>{m.player2?.name || m.team2?.teamName || "??"}</td>
                <td>{m.scores || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Добавить матч</h3>
      <div className="add-match-form">
        <label>
          Дата:
          <input
            type="date"
            value={matchDate}
            onChange={(e) => setMatchDate(e.target.value)}
          />
        </label>

        <label>
          Участник 1:
          <select onChange={(e) => setParticipant1Id(Number(e.target.value))} value={participant1Id || ""}>
            <option value="">-- Выбери --</option>
            {allItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Участник 2:
          <select onChange={(e) => setParticipant2Id(Number(e.target.value))} value={participant2Id || ""}>
            <option value="">-- Выбери --</option>
            {allItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Счёт:
          <input
            type="text"
            placeholder="например: 6-4, 4-6, 10-8"
            value={matchScore}
            onChange={(e) => setMatchScore(e.target.value)}
          />
        </label>

        <button onClick={handleAddMatch}>Добавить матч</button>
      </div>
    </div>
  );
}