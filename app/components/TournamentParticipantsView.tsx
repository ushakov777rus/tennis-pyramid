"use client";

import { Player } from "@/app/models/Player";
import { Team }  from "@/app/models/Team";
import { Participant } from "@/app/models/Participant";

import "./TeamsTable.css"; // реюз тех же таблиц/кнопок/чипов
import { DeleteIconButton, PlusIconButton } from "./IconButtons";
import { AdminOnly } from "./RoleGuard";

type TournamentParticipantsViewProps = {
  // Левая сторона — игроки или команды, которых ещё нет в турнире
  availablePlayers: Player[];
  availableTeams: Team[];
  // Правая сторона — игроки, уже добавленные в турнир
  tournamentParticipants: Participant[];

  onAddPlayerToTournament: (playerId: number) => void;
  onAddTeamToTournament: (playerId: number) => void;
  onRemoveParticipantFromTournament: (participantId: number) => void;
};

export function TournamentParticipantsView({
  availablePlayers,
  availableTeams,
  tournamentParticipants,
  onAddPlayerToTournament,
  onAddTeamToTournament,
  onRemoveParticipantFromTournament,
}: TournamentParticipantsViewProps) {
  const maxRows = Math.max(availablePlayers.length, availableTeams.length, tournamentParticipants.length);

  return (
    <table className="history-table">
      <thead className="history-table-head">
        <tr>
          <th colSpan={2}>Свободные игроки</th>
          <th colSpan={2}>Участники турнира</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: maxRows }).map((_, i) => {
          const free = availablePlayers.length ? availablePlayers[i] : availableTeams[i];
          const part = tournamentParticipants[i];

          return (
            <tr key={i}>
              {/* Свободные игроки: чип + действие (добавить) */}
              <td>{free ? <span className="chip">{free.name}</span> : ""}</td>
              <td className="score-col">
                {free && (
                  <div className="row-actions always-visible">
                    <AdminOnly>
                      <PlusIconButton
                        title="Добавить в турнир"
                        onClick={(e) => {
                          e.stopPropagation();
                          availablePlayers.length ? onAddPlayerToTournament(free.id) : onAddTeamToTournament(free.id);
                        }}
                      />
                    </AdminOnly>
                  </div>
                )}
              </td>

              {/* Уже в турнире: чип + действие (удалить) */}
              <td>{part ? <span className="chip">{part.displayName}</span> : ""}</td>
              <td className="score-col">
                {part && (
                  <div className="row-actions always-visible">
                    <AdminOnly>
                      <DeleteIconButton
                        title="Убрать из турнира"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveParticipantFromTournament(part.id);
                        }}
                      />
                    </AdminOnly>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}