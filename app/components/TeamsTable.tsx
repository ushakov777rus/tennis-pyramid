"use client";

import { Player } from "@/app/models/Player";
import { Team } from "@/app/models/Team";
import "./TeamsTable.css";

type Props = {
  // Левая сторона
  availablePlayers: Player[];
  selectedPlayers: Player[];
  onTogglePlayer: (p: Player) => void;
  onCreateTeam: () => void;

  // Правая сторона (пары уже в турнире)
  allTeams: Team[]; // 👈 переименовал для ясности
  onRemoveTeamFromTournament: (teamId: number) => void;
};

export function TeamsTable({
  availablePlayers,
  selectedPlayers,
  onTogglePlayer,
  onCreateTeam,
  allTeams: tournamentTeams,
  onRemoveTeamFromTournament,
}: Props) {
  const maxRows = Math.max(availablePlayers.length, tournamentTeams.length ? tournamentTeams.length : 0);

  // последний выбранный (второй) игрок
  const lastSelectedId = selectedPlayers.length ? selectedPlayers[selectedPlayers.length - 1].id : undefined;

  return (
    <table className="history-table">
      <thead className="history-table-head">
        <tr>
          <th colSpan={3}>Свободные игроки</th>
          <th colSpan={2}>Команды</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: maxRows }).map((_, i) => {
          const player = availablePlayers[i];
          const team = tournamentTeams[i];

          const isSelected = !!player && selectedPlayers.some((sp) => sp.id === player.id);
          const showCreateHere =
            !!player &&
            selectedPlayers.length === 2 &&
            player.id === lastSelectedId &&
            isSelected;

          return (
            <tr key={i}>
              {/* Свободные игроки: чип + действие (выбор) */}
              <td>{player ? <span className="chip">{player.name}</span> : ""}</td>
              <td className="score-col">
                {player && (
                  <div className={`row-actions ${isSelected ? "always-visible" : ""} create-inline-wrap`}>
                    <button
                      className={`icon-btn ${isSelected ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePlayer(player);
                      }}
                      title={isSelected ? "Снять выделение" : "Выбрать игрока"}
                      aria-label={isSelected ? "Снять выделение" : "Выбрать игрока"}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
                        {isSelected && (
                          <path
                            d="M7 12l3 3 7-7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        )}
                      </svg>
                    </button>

                  </div>
                )}
              </td>







              <td className="score-col">
                {player && (
                  <div className={`row-actions ${isSelected ? "always-visible" : ""} create-inline-wrap`}>
                    {/* Инлайновая иконка "создать команду" рядом с последним выбранным */}
                    {showCreateHere && (
                    <button
                        className="icon-btn create-icon lg"
                        onClick={(e) => {
                        e.stopPropagation();
                        onCreateTeam();
                        }}
                        title="Создать команду из выбранных"
                        aria-label="Создать команду из выбранных"
                    >
                        {/* users-plus */}
                        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                        {/* Головы */}
                        <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="16.5" cy="9" r="2.5" fill="none" stroke="currentColor" strokeWidth="2"/>

                        {/* Тела (упрощённые дуги-плечи) */}
                        <path d="M4.5 16c0-2.2 2.6-3.5 4.5-3.5S13.5 13.8 13.5 16v1.5H4.5V16z"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M14.5 16.5c0-1.6 1.8-2.6 3-2.6s3 1 3 2.6v1.0"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>

                        {/* Плюсик (создать) */}
                        <path d="M19.5 5.2v3.0M18 6.7h3.0"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                    )}
                  </div>
                )}
              </td>










              {/* Пары в турнире: чип + действие (удалить) */}
              <td>
                {team ? (
                  <span className="chip">
                    {(team.player1?.name ?? "??")} + {(team.player2?.name ?? "??")}
                  </span>
                ) : (
                  ""
                )}
              </td>
              <td className="score-col">
                {team && (
                  <div className="row-actions">
                    <button
                      className="icon-btn danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTeamFromTournament(team.id);
                      }}
                      title="Удалить команду"
                      aria-label="Удалить команду"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24">
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
        {/* Убрали нижнюю общую кнопку */}
      </tbody>
    </table>
  );
}