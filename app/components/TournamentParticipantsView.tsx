"use client";

import { useMemo, useState } from "react";
import { useUser } from "@/app/components/UserContext";
import { Player } from "@/app/models/Player";
import { Team } from "@/app/models/Team";
import { Participant } from "@/app/models/Participant";

import {
  DeleteIconButton,
  PlusIconButton,
  CreateTeamIconButton,
} from "./IconButtons";
import { AdminOnly } from "./RoleGuard";

import "@/app/components/ParticipantsView.css";

type TournamentParticipantsViewProps = {
  isDouble: boolean; // 👈 новый флаг: парный или одиночный турнир

  availablePlayers: Player[];
  tournamentParticipants: Participant[];

  onAddPlayerToTournament: (playerId: number) => void;
  onAddTeamToTournament: (player1: Player, player2: Player) => void;
  onRemoveParticipantFromTournament: (participant: Participant) => void;
};

export function TournamentParticipantsView({
  isDouble,
  availablePlayers,
  tournamentParticipants,
  onAddPlayerToTournament,
  onAddTeamToTournament,
  onRemoveParticipantFromTournament,
}: TournamentParticipantsViewProps) {
  const { user } = useUser();

  // фильтры
  const [leftFilter, setLeftFilter] = useState("");
  const [rightFilter, setRightFilter] = useState("");
  const lf = leftFilter.trim().toLowerCase();
  const rf = rightFilter.trim().toLowerCase();

  // выбранные игроки для формирования пары
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const filteredPlayers = useMemo(
    () =>
      lf
        ? availablePlayers.filter((p) =>
            p.displayName(false).toLowerCase().includes(lf)
          )
        : availablePlayers,
    [availablePlayers, lf]
  );

  const filteredParticipants = useMemo(
    () =>
      rf
        ? tournamentParticipants.filter((p) =>
            p.displayName(false).toLowerCase().includes(rf)
          )
        : tournamentParticipants,
    [tournamentParticipants, rf]
  );

  const maxRows = Math.max(filteredPlayers.length, filteredParticipants.length);

  // выбор игроков
  const toggleSelectPlayer = (player: Player) => {
    setSelectedPlayers((sel) => {
      if (sel.some((sp) => sp.id === player.id)) {
        return sel.filter((sp) => sp.id !== player.id);
      }
      if (sel.length === 2) return [player]; // если уже 2 — сбрасываем и выбираем нового
      return [...sel, player];
    });
  };

  const lastSelectedId =
    selectedPlayers.length > 0
      ? selectedPlayers[selectedPlayers.length - 1].id
      : undefined;

  const createTeam = () => {
    if (selectedPlayers.length === 2) {
      onAddTeamToTournament(selectedPlayers[0], selectedPlayers[1]);
      setSelectedPlayers([]);
    }
  };

  return (
    <table className="participants-table">
      <colgroup>
        <col style={{ width: "40%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "40%" }} />
        <col style={{ width: "10%" }} />
      </colgroup>

      <thead>
        <tr>
          <th colSpan={2} style={{ width: "50%" }}>
            {isDouble ? "Игроки (для пар)" : "Игроки"}
          </th>
          <th colSpan={2} style={{ width: "50%" }}>
            Участники турнира
          </th>
        </tr>
      </thead>

      <tbody>
        {/* фильтры */}
        <tr>
          <td>
            <input
              type="text"
              className="input"
              placeholder={isDouble ? "Фильтр: игрок" : "Фильтр: игрок/пара"}
              value={leftFilter}
              onChange={(e) => setLeftFilter(e.target.value)}
            />
          </td>
          <td />
          <td>
            <input
              type="text"
              className="input"
              placeholder="Фильтр: участник"
              value={rightFilter}
              onChange={(e) => setRightFilter(e.target.value)}
            />
          </td>
          <td />
        </tr>

        {/* контент */}
        {maxRows === 0 ? (
          <tr>
            <td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>
              Ничего не найдено
            </td>
          </tr>
        ) : (
          Array.from({ length: maxRows }).map((_, i) => {
            const free = filteredPlayers[i];
            const part = filteredParticipants[i];

            const isSelected =
              isDouble &&
              free instanceof Player &&
              selectedPlayers.some((sp) => sp.id === free.id);

            const showCreateHere =
              isDouble &&
              free instanceof Player &&
              isSelected &&
              free.id === lastSelectedId &&
              selectedPlayers.length === 2;

            return (
              <tr key={i}>
                {/* свободные */}
                <td>
                  {free ? (
                    <span
                      className={`player ${
                        isDouble && free instanceof Player ? "clickable" : ""
                      } ${isSelected ? "active" : ""}`}
                      onClick={() =>
                        isDouble && free instanceof Player
                          ? toggleSelectPlayer(free)
                          : undefined
                      }
                    >
                      {(free as any).displayName(false)}
                    </span>
                  ) : (
                    ""
                  )}
                </td>

                <td>
                  <AdminOnly>
                    {isDouble ? (
                      showCreateHere && (
                        <CreateTeamIconButton
                          title="Создать команду"
                          onClick={createTeam}
                        />
                      )
                    ) : (
                      free && (
                        <PlusIconButton
                          title="Добавить"
                          onClick={() =>
                            onAddPlayerToTournament((free as Player).id)
                          }
                        />
                      )
                    )}
                  </AdminOnly>
                </td>

                {/* уже в турнире */}
                <td>{part ? <span className="player">{part.displayName(false)}</span> : ""}</td>
                <td>
                  {part && (
                    <AdminOnly>
                      <DeleteIconButton
                        title="Убрать"
                        onClick={() => onRemoveParticipantFromTournament(part)}
                      />
                    </AdminOnly>
                  )}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}