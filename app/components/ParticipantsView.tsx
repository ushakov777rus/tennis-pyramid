"use client";

import { useState } from "react";

import { Player } from "@/app/models/Player";

import { TournamentTeamsTable } from "@/app/components/TournamentTeamsTable";
import { TournamentParticipantsView } from "@/app/components/TournamentParticipantsView";

import "@/app/components/ParticipantsView.css";

// 👉 все данные и действия берём из провайдера
import { useTournament } from "@/app/tournaments/[id]/TournamentProvider";
import { useUser } from "./UserContext";
import { canEditTournament } from "../lib/permissions";

export function ParticipantsView() {
  const { user } = useUser();
  const {
    loading,
    tournament,
    players,
    participants,
    teams,
    // действия из провайдера
    addPlayerToTournament,
    removeParticipant,
    createAndAddTeamToTournament,
    removeTeam,
  } = useTournament();

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

  return (
    <div className="history-wrap">
      <TournamentParticipantsView
        isDouble={tournament.tournament_type === "double"}
        availablePlayers={availablePlayers}
        availableTeams={[]}
        tournamentParticipants={participants}
        onAddPlayerToTournament={(id) => addPlayerToTournament?.(id)}
        onAddTeamToTournament={(p1Id, p2Id) =>
          createAndAddTeamToTournament?.(tournament.id, p1Id.id, p2Id.id)
        }
        onRemoveParticipantFromTournament={(id) => removeParticipant?.(id)}
      />
    </div>
  );
}