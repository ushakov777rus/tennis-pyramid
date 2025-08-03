"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";

import { Player } from "@/app/models/Player";
import { Participant } from "@/app/models/Participant";

export function ParticipantsView() {
  const params = useParams<{ id: string }>();
  const tournamentId = Number(params?.id);

  const [players, setPlayers] = useState<Player[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);

    const [allPlayers, tournamentParticipants] = await Promise.all([
      PlayersRepository.loadAll(),
      TournamentsRepository.loadParticipants(tournamentId),
    ]);

    setPlayers(allPlayers);
    setParticipants(tournamentParticipants);
    setLoading(false);
  }

  async function addToTournament(playerId: number) {
    await TournamentsRepository.addPlayer(
      tournamentId,
      playerId,
      15, // дефолтный уровень
    );
    await loadData();
  }

  async function removeFromTournament(participantId: number) {
    await TournamentsRepository.removeParticipant(participantId);
    await loadData();
  }

  useEffect(() => {
    if (tournamentId) loadData();
  }, [tournamentId]);

  if (loading) return <p>Загрузка...</p>;

  const participantIds = new Set(
    participants.map((p) => p.player?.id).filter(Boolean)
  );

  const availablePlayers = players.filter((p) => !participantIds.has(p.id));

  return (
    <div style={{ display: "flex", gap: "40px", marginTop: "20px" }}>
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
    </div>
  );
}