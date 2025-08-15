"use client";

import React from "react";
import { Player } from "@/app/models/Player";
import { Team } from "@/app/models/Team";
import "./TeamsTable.css";

// ✅ унифицированные кнопки
import { DeleteIconButton, CreateTeamIconButton, CheckBoxIconButton } from "@/app/components/IconButtons";

type Props = {
  // Левая сторона
  availablePlayers: Player[];
  selectedPlayers: Player[];
  onTogglePlayer: (p: Player) => void;
  onCreateTeam: () => void;

  // Правая сторона (пары уже в турнире)
  allTeams: Team[]; // список команд в турнире
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
  const maxRows = Math.max(
    availablePlayers.length,
    tournamentTeams.length ? tournamentTeams.length : 0
  );

  // последний выбранный (второй) игрок
  const lastSelectedId =
    selectedPlayers.length > 0
      ? selectedPlayers[selectedPlayers.length - 1].id
      : undefined;

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

          const isSelected =
            !!player && selectedPlayers.some((sp) => sp.id === player.id);

          const showCreateHere =
            !!player &&
            selectedPlayers.length === 2 &&
            player.id === lastSelectedId &&
            isSelected;

          return (
            <tr key={i}>
              {/* Свободные игроки: чип */}
              <td>{player ? <span className="chip">{player.name}</span> : ""}</td>

              {/* Кнопка выбора игрока */}
              <td className="score-col">
                {player && (
                  <div
                    className={`row-actions ${
                      isSelected ? "always-visible" : ""
                    } create-inline-wrap`}
                  >
                  <CheckBoxIconButton
                    title={isSelected ? "Снять выделение" : "Выбрать игрока"}
                    aria-label={isSelected ? "Снять выделение" : "Выбрать игрока"}
                    isSelected={isSelected}
                    className={isSelected ? "active" : undefined}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePlayer(player);
                    }}
                  />
                  </div>
                )}
              </td>

              {/* Инлайновая кнопка "создать команду" (рядом с последним выбранным) */}
              <td className="score-col">
                {player && (
                  <div
                    className={`row-actions ${
                      isSelected ? "always-visible" : ""
                    } create-inline-wrap`}
                  >
                    {showCreateHere && (
                      <CreateTeamIconButton
                        title="Создать команду из выбранных"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCreateTeam();
                        }}
                      />
                    )}
                  </div>
                )}
              </td>

              {/* Пары в турнире: чип */}
              <td>
                {team ? (
                  <span className="chip">
                    {(team.player1?.name ?? "??")} + {(team.player2?.name ?? "??")}
                  </span>
                ) : (
                  ""
                )}
              </td>

              {/* Кнопка удаления команды */}
              <td className="score-col">
                {team && (
                  <div className="row-actions">
                    <DeleteIconButton
                      title="Удалить команду"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTeamFromTournament(team.id);
                      }}
                    />
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