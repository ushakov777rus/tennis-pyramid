"use client";

import React from "react";
import { Player } from "@/app/models/Player";
import { Team } from "@/app/models/Team";

import "@/app/components/ParticipantsView.css";

// ✅ унифицированные кнопки
import { DeleteIconButton, CreateTeamIconButton } from "@/app/components/IconButtons";
import { AdminOnly } from "./RoleGuard";

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

export function TournamentTeamsTable({
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
    <table className="participants-table">
      <colgroup>
        <col style={{ width: "33%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "47%" }} />
        <col style={{ width: "10%" }} />
      </colgroup>

      <thead>
        <tr>
          <th colSpan={2} style={{ width: "50%" }}>Игроки</th>
          <th colSpan={2} style={{ width: "50%" }}>Команды</th>
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
              {/* Свободные игроки: чип (кликабельный) */}
              <td>
                {player ? (
                  <span
                    className={`chip clickable ${isSelected ? "active" : ""}  cell-2lines`}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    title={isSelected ? "Снять выделение" : "Выбрать игрока"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePlayer(player);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onTogglePlayer(player);
                      }
                    }}
                  >
                    {player.name}
                  </span>
                ) : (
                  ""
                )}
              </td>

              {/* Инлайновая кнопка "создать команду" (рядом с последним выбранным) */}
              <td>
                {player && (
                  <div
                    className={`${
                      isSelected ? "always-visible" : ""
                    } create-inline-wrap`}
                  >
                    {showCreateHere && (
                      <AdminOnly>
                        <CreateTeamIconButton
                          title="Создать команду из выбранных"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCreateTeam();
                          }}
                        />
                      </AdminOnly>
                    )}
                  </div>
                )}
              </td>

              {/* Пары в рамках турнира: чип */}
              <td>
                {team ? (
                  <span className="chip  cell-2lines">
                    {(team.player1?.name ?? "??")} {(team.player2?.name ?? "??")}
                  </span>
                ) : (
                  ""
                )}
              </td>

              {/* Кнопка удаления команды */}
              <td>
                {team && (
                  <AdminOnly>
                    <div>
                      <DeleteIconButton
                        title="Удалить команду"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveTeamFromTournament(team.id);
                        }}
                      />
                    </div>
                  </AdminOnly>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}