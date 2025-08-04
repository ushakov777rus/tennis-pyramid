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
    await TournamentsRepository.addPlayer(tournamentId, playerId, 15);
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
    <div style={{ display: "flex", gap: "40px", marginTop: "20px" }}>
      {tournament.tournament_type === "single" ? (
        <>
          {/* Игроки вне турнира */}
          <div>
            <h3>Доступные игроки</h3>
            {availablePlayers.length === 0 ? (
              <p>Все игроки уже в турнире</p>
            ) : (
              <ul>
                {availablePlayers.map((p) => (
                  <li key={p.id}>
                    {p.name}{" "}
                    <button onClick={() => addToTournament(p.id)}>➕ Добавить</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Игроки в турнире */}
          <div>
            <h3>Участники турнира</h3>
            {participants.length === 0 ? (
              <p>Пока нет участников</p>
            ) : (
              <ul>
                {participants.map((p) => (
                  <li key={p.id}>
                    {p.player?.name ?? `Игрок #${p.player?.id}`}{" "}
                    <button onClick={() => removeFromTournament(p.id)}>❌ Убрать</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Доступные игроки */}
          <div>
            <h3>Доступные игроки</h3>
            {availablePlayers.length === 0 ? (
              <p>Нет свободных игроков</p>
            ) : (
              <ul>
                {availablePlayers.map((p) => (
                  <li key={p.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedPlayers.includes(p)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPlayers((prev) =>
                              prev.length < 2 ? [...prev, p] : prev
                            );
                          } else {
                            setSelectedPlayers((prev) =>
                              prev.filter((id) => id !== p)
                            );
                          }
                        }}
                      />{" "}
                      {p.name}
                    </label>
                  </li>
                ))}
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