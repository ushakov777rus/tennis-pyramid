"use client";

import { useState } from "react";

import { Player } from "@/app/models/Player";

import { TournamentTeamsTable } from "@/app/components/TournamentTeamsTable";
import { TournamentParticipantsView } from "@/app/components/TournamentParticipantsView";

import "@/app/components/ParticipantsView.css";

// 👉 все данные и действия берём из провайдера
import { useTournament } from "@/app/tournaments/[id]/TournamentProvider";

export function ParticipantsView() {
  const {
    loading,
    tournament,
    players,
    participants,
    teams,
    // действия из провайдера
    addPlayerToTournament,
    removeParticipant,
    addTeamToTournament,
    removeTeam,
    createTeam,
  } = useTournament();

  console.log("ParticipantsView::players", players);
  console.log("ParticipantsView::participants", participants);
  console.log("ParticipantsView::teams", teams);

  // выбор игроков для создания пары
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  // вкладки только для парного турнира
  const [activeTab, setActiveTab] = useState<"teams" | "parts">("parts");

  if (loading) return <p>Загрузка...</p>;
  if (!tournament) return <p>Турнир не найден</p>;

  // одиночки: свободные игроки (не в участниках)
  const participantIds = new Set(
    participants.map((p) => p.player?.id).filter(Boolean) as number[]
  );
  const availablePlayers = players.filter((p) => !participantIds.has(p.id));

  // пары: свободные команды (не в участниках)
  const participantTeamIds = new Set(
    participants.map((p) => p.team?.id).filter(Boolean) as number[]
  );
  const availableTeams = teams.filter((t) => !participantTeamIds.has(t.id));

  // команды, уже участвующие в турнире (для рендера / если нужно)
  const tournamentTeams = participants
    .filter((p) => p.team)
    .map((p) => p.team!)
    // на случай дублей участников одной и той же команды:
    .filter((team, idx, arr) => arr.findIndex(t => t.id === team.id) === idx);

  // создать команду из выбранных двух игроков
  async function handleCreateTeam() {
    if (selectedPlayers.length !== 2) return;
    const [p1, p2] = selectedPlayers;
    await createTeam?.(`${p1.name} - ${p2.name}`, p1.id, p2.id);
    setSelectedPlayers([]); // локальный сброс выбора
  }

  return (
    <div className="history-wrap">
      {/* Одиночные турниры */}
      {tournament.tournament_type === "single" ? (
        <TournamentParticipantsView
          availablePlayers={availablePlayers}
          availableTeams={[]}
          tournamentParticipants={participants}
          onAddPlayerToTournament={(id) => addPlayerToTournament?.(id)}
          onAddTeamToTournament={(id) => addTeamToTournament?.(id)}
          onRemoveParticipantFromTournament={(id) => removeParticipant?.(id)}
        />
      ) : (
        <>
          <div className="card card-tabs">
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
          </div>

          <div>
            {/* TAB: создание/удаление команд */}
            {activeTab === "teams" && (
              <TournamentTeamsTable
                availablePlayers={availablePlayers}
                selectedPlayers={selectedPlayers}
                onTogglePlayer={(p) => {
                  setSelectedPlayers((prev) => {
                    const isSel = prev.some((sp) => sp.id === p.id);
                    if (isSel) return prev.filter((sp) => sp.id !== p.id);
                    return prev.length < 2 ? [...prev, p] : prev;
                  });
                }}
                onCreateTeam={handleCreateTeam}
                // ⬇ если у тебя в TeamsTable проп называется иначе — смени здесь на свой
                allTeams={availableTeams}
                onRemoveTeamFromTournament={(teamId: number) => {
                  // удаляем саму команду из БД (как было у тебя)
                  removeTeam?.(teamId);
                }}
              />
            )}

            {/* TAB: участники (пары уже в турнире + добавить из доступных) */}
            {activeTab === "parts" && (
              <TournamentParticipantsView
                availablePlayers={[]}
                availableTeams={availableTeams}
                tournamentParticipants={participants}
                onAddPlayerToTournament={(id) => addPlayerToTournament?.(id)}
                onAddTeamToTournament={(id) => addTeamToTournament?.(id)}
                onRemoveParticipantFromTournament={(id) => removeParticipant?.(id)}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}