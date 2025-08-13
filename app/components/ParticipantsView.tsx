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

import { TeamsTable } from "@/app/components/TeamsTable";

import "./ParticipantsView.css";
import { TournamentParticipantsView } from "@/app/components/TournamentParticipantsView";

export function ParticipantsView() {
  const params = useParams<{ id: string }>();
  const tournamentId = Number(params?.id);

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [allTeams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // выбор игроков для создания пары
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  // вкладки для парного турнира
  const [activeTab, setActiveTab] = useState<"teams" | "parts">("teams");

  async function loadData() {
    setLoading(true);

    const [t, allPlayers, tournamentParticipants, allTeams] = await Promise.all([
      TournamentsRepository.getTournamentById(tournamentId),
      PlayersRepository.loadAll(),
      TournamentsRepository.loadParticipants(tournamentId),
      TeamsRepository.loadAll(),
    ]);

    setTournament(t);
    setPlayers(allPlayers);
    setParticipants(tournamentParticipants);
    setTeams(allTeams);
    setSelectedPlayers([]); // сброс выбора
    setLoading(false);
  }

  useEffect(() => {
    if (tournamentId) loadData();
  }, [tournamentId]);

  async function addPlayerToTournament(playerId: number) {
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

  async function removeTeam(teamId: number) {
    await TeamsRepository.delete(teamId);
    await loadData();
  }

  async function removeTeamFromTournament(participantId: number) {
    await TournamentsRepository.removeParticipant(participantId);
    await loadData();
  }

  async function createTeam() {
    if (selectedPlayers.length !== 2) return;
    const [p1, p2] = selectedPlayers;
    await TeamsRepository.create(`${p1.name} - ${p2.name}`, p1.id, p2.id);
    await loadData();
  }

  if (loading) return <p>Загрузка...</p>;
  if (!tournament) return <p>Турнир не найден</p>;

  // одиночки
  const participantIds = new Set(
    participants.map((p) => p.player?.id).filter(Boolean) as number[]
  );
  const availablePlayers = players.filter((p) => !participantIds.has(p.id));

  // пары
  const participantTeamIds = new Set(
    participants.map((p) => p.team?.id).filter(Boolean) as number[]
  );

  const availableTeams = allTeams.filter((t) => !participantTeamIds.has(t.id));
  const tournamentTeams = participants.filter((p) => p.team);

  return (
    <div className="history-wrap">

      {/* Одиночные турниры */}
      {tournament.tournament_type === "single" ? (
        <TournamentParticipantsView
          availablePlayers={availablePlayers}
          availableTeams={[]}
          tournamentParticipants={participants} // массив Player уже в турнире
          onAddPlayerToTournament={(id) => addPlayerToTournament(id)}
          onAddTeamToTournament={(id) => addTeamToTournament(id)}
          onRemoveParticipantFromTournament={(id) => removeFromTournament(id)}
        />
      ) : (
        <>
          <div className="card card-tabs">
            <button
              className={
                activeTab === "teams"
                  ? "card-btn tabs-button card-btn-act"
                  : "card-btn tabs-button"
              }
              onClick={() => setActiveTab("teams")}
            >
              Команды
            </button>
            <button
              className={
                activeTab === "parts"
                  ? "card-btn tabs-button card-btn-act"
                  : "card-btn tabs-button"
              }
              onClick={() => setActiveTab("parts")}
            >
              Участники
            </button>
          </div>

          <div>
            {/* TAB: Пары (вынесено в отдельный компонент) */}
            {activeTab === "teams" && (
              <TeamsTable
                availablePlayers={availablePlayers}
                selectedPlayers={selectedPlayers}
                onTogglePlayer={(p) => {
                  setSelectedPlayers((prev) => {
                    const isSel = prev.some((sp) => sp.id === p.id);
                    if (isSel) return prev.filter((sp) => sp.id !== p.id);
                    return prev.length < 2 ? [...prev, p] : prev;
                  });
                }}
                onCreateTeam={createTeam}
                allTeams={allTeams} // если у тебя список Participant — извлеки team
                onRemoveTeamFromTournament={(teamId) => {removeTeam(teamId);}}
              />
            )}

            {/* TAB: Участники (пары в турнире и добавление доступных) */}
            {activeTab === "parts" && (
              <TournamentParticipantsView
                availablePlayers={[]}
                availableTeams={availableTeams}
                tournamentParticipants={participants} // массив Player уже в турнире
                onAddPlayerToTournament={(id) => addPlayerToTournament(id)}
                onAddTeamToTournament={(id) => addTeamToTournament(id)}
                onRemoveParticipantFromTournament={(id) => removeFromTournament(id)}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}