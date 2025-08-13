"use client";

import { Player } from "@/app/models/Player";
import { Team }  from "@/app/models/Team";
import { Participant } from "@/app/models/Participant";

import "./TeamsTable.css"; // реюз тех же таблиц/кнопок/чипов

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
                    <button
                      className="icon-btn lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        availablePlayers.length ? onAddPlayerToTournament(free.id) : onAddTeamToTournament(free.id);
                      }}
                      title="Добавить в турнир"
                      aria-label="Добавить в турнир"
                    >
                      {/* plus-square */}
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 8v8M8 12h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                )}
              </td>

              {/* Уже в турнире: чип + действие (удалить) */}
              <td>{part ? <span className="chip">{part.displayName}</span> : ""}</td>
              <td className="score-col">
                {part && (
                  <div className="row-actions always-visible">
                    <button
                      className="icon-btn danger lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveParticipantFromTournament(part.id);
                      }}
                      title="Убрать из турнира"
                      aria-label="Убрать из турнира"
                    >
                      {/* trash */}
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
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
  );
}