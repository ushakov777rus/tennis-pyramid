"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { TeamsRepository } from "@/app/repositories/TeamsRepository";

import { Player } from "@/app/models/Player";
import { Participant } from "@/app/models/Participant";
import { Tournament } from "@/app/models/Tournament";
import { Team } from "@/app/models/Team";

import "./ParticipantsView.css"

export function ParticipantsView() {
  const params = useParams<{ id: string }>();
  const tournamentId = Number(params?.id);

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  async function loadData() {
    setLoading(true);

    const [t, allPlayers, tournamentParticipants, allTeams] = await Promise.all([
      TournamentsRepository.getTournamentById(tournamentId),
      PlayersRepository.loadAll(),
      TournamentsRepository.loadParticipants(tournamentId),
      TeamsRepository.loadAll(),
    ]);

    console.log("TournamentsRepository.loadParticipants:", tournamentParticipants);

    setTournament(t);
    setPlayers(allPlayers);
    setParticipants(tournamentParticipants);
    setTeams(allTeams);
    setSelectedPlayers([]); // сброс выбора
    setLoading(false);
  }

  async function addToTournament(playerId: number) {
    await TournamentsRepository.addPlayer(tournamentId, playerId);
    await loadData();
  }

  async function removeFromTournament(participantId: number) {
    await TournamentsRepository.removeParticipant(participantId);
    await loadData();
  }

  async function addTeamToTournament(teamId: number) {
    await TournamentsRepository.addTeam(tournamentId, teamId, 15);
    await loadData();
  }

  async function removeTeamFromTournament(participantId: number) {
    await TournamentsRepository.removeParticipant(participantId);
    await loadData();
  }

  async function createTeam() {
    if (selectedPlayers.length !== 2) return;
    await TeamsRepository.create(selectedPlayers[0].name + " - " + selectedPlayers[1].name, selectedPlayers[0].id, selectedPlayers[1].id); // создаём пару
    await loadData();
  }

  useEffect(() => {
    if (tournamentId) loadData();
  }, [tournamentId]);

  if (loading) return <p>Загрузка...</p>;
  if (!tournament) return <p>Турнир не найден</p>;

  // одиночки
  const participantIds = new Set(
    participants.map((p) => p.player?.id).filter(Boolean)
  );
  const availablePlayers = players.filter((p) => !participantIds.has(p.id));

  // пары
  const participantTeamIds = new Set(
    participants.map((p) => p.team?.id).filter(Boolean)
  );
  const availableTeams = teams.filter((t) => !participantTeamIds.has(t.id));
  const tournamentTeams = participants.filter((p) => p.team);

  return (
    <div className="history-wrap">
      {tournament.tournament_type === "single" ? (
  <table className="history-table">
    <thead className="history-table-head">
      <tr>
        <th colSpan={2}>Доступные игроки</th>
        <th colSpan={2}>Участники турнира</th>
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: Math.max(availablePlayers.length, participants.length) }).map((_, i) => {
        const avail = availablePlayers[i];
        const part = participants[i];

        return (
          <tr key={i}>
            {/* Доступные */}
            <td>
              {avail ? <span className="chip">{avail.name}</span> : ""}
            </td>
            <td className="score-col">
              {avail && (
                <div className="row-actions">
                  <button
                    className="icon-btn"
                    onClick={() => addToTournament(avail.id)}
                    title="Добавить в турнир"
                    aria-label="Добавить в турнир"
                  >
                    {/* plus */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              )}
            </td>

            {/* Участники */}
            <td>
              {part?.player ? <span className="chip">{part.player.name}</span> : ""}
            </td>
            <td className="score-col">
              {part && (
                <div className="row-actions">
                  <button
                    className="icon-btn danger"
                    onClick={() => removeFromTournament(part.id)}
                    title="Убрать из турнира"
                    aria-label="Убрать из турнира"
                  >
                    {/* trash */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>

      ) : (
        <>
          {/* Доступные игроки */}
          <div>
            <h3>Доступные игроки</h3>
            {availablePlayers.length === 0 ? (
              <p>Нет свободных игроков</p>
            ) : (
                <ul className="players-list">
                {availablePlayers.map((p) => {
                    const isSelected = selectedPlayers.includes(p);

                    // индекс выбранного игрока в массиве
                    const selectedIndex = selectedPlayers.findIndex(sp => sp.id === p.id);

                    return (
                    <div key={p.id}>
                        <li
                        className={`available-player-row ${isSelected ? "selected" : ""}`}
                        onClick={() => {
                            setSelectedPlayers((prev) => {
                            if (isSelected) {
                                return prev.filter((id) => id !== p);
                            } else {
                                return prev.length < 2 ? [...prev, p] : prev;
                            }
                            });
                        }}
                        >
                        <div><input type="checkbox" checked={isSelected} readOnly /></div>
                        <div><span>{p.name.replace(/\s+/g, " ")}</span></div>
                        </li>

                        {/* если это второй выбранный игрок → показываем кнопку сразу под ним */}
                        {selectedIndex === 1 && (
                        <div >
                            <button className="add-team-btn" onClick={createTeam}>👥 Создать пару</button>
                        </div>
                        )}
                    </div>
                    );
                })}
                </ul>
            )}
            {selectedPlayers.length === 2 && (
              <button onClick={createTeam} style={{ marginTop: "10px" }}>
                👥 Создать пару
              </button>
            )}
          </div>

          {/* Доступные пары */}
          <div>
            <h3>Доступные пары</h3>
            {availableTeams.length === 0 ? (
              <p>Нет доступных пар</p>
            ) : (
              <ul>
                {availableTeams.map((t) => (
                  <li key={t.id}>
                    {t.player1?.name} + {t.player2?.name}{" "}
                    <button onClick={() => addTeamToTournament(t.id)}>
                      ➕ Добавить пару
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Пары в турнире */}
          <div>
            <h3>Пары в турнире</h3>
            {tournamentTeams.length === 0 ? (
              <p>Пока нет пар</p>
            ) : (
              <ul>
                {tournamentTeams.map((p) => (
                  <li key={p.id}>
                    {p.team?.player1?.name} + {p.team?.player2?.name}{" "}
                    <button onClick={() => removeTeamFromTournament(p.id)}>❌ Убрать</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}