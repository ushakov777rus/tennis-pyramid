"use client";

import "@/app/components/ParticipantsView.css";

// 👉 все данные и действия берём из провайдера
import { useTournament } from "@/app/tournaments/[id]/TournamentProvider";
import { useUser } from "./UserContext";
import { canEditTournament } from "../lib/permissions";
import { useMemo, useState } from "react";
import { Player } from "../models/Player";
import { CreateTeamIconButton, DeleteIconButton, PlusIconButton } from "./IconButtons";
import { AdminOnly } from "./RoleGuard";

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
  } = useTournament();

  // фильтры
  const [leftFilter, setLeftFilter] = useState("");
  const [rightFilter, setRightFilter] = useState("");
  const lf = leftFilter.trim().toLowerCase();
  const rf = rightFilter.trim().toLowerCase();

  // выбранные игроки для формирования пары
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const filteredParticipants = useMemo(
    () =>
      rf
        ? participants.filter((p) =>
            p.displayName(false).toLowerCase().includes(rf)
          )
        : participants,
    [participants, rf]
  );

    // одиночки: свободные игроки (не в участниках)
  const participantIds = new Set<number>(
    participants.flatMap((p) => {
      if (p.player) {
        return [p.player.id];
      }
      if (p.team) {
        return [p.team.player1?.id, p.team.player2?.id].filter(
          (id): id is number => !!id
        );
      }
      return [];
    })
  );

  const availablePlayers = players.filter((p) => !participantIds.has(p.id));

  const filteredPlayers = useMemo(
    () =>
      lf
        ? availablePlayers.filter((p) =>
            p.displayName(false).toLowerCase().includes(lf)
          )
        : availablePlayers,
    [availablePlayers, lf]
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
    if (selectedPlayers.length === 2 && tournament?.id) {
      createAndAddTeamToTournament?.(tournament?.id, selectedPlayers[0].id, selectedPlayers[1].id);
      setSelectedPlayers([]);
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (!tournament) return <p>Турнир не найден</p>;

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
            {tournament.isDouble() ? "Игроки (для пар)" : "Игроки"}
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
              placeholder={tournament.isDouble() ? "Фильтр: игрок" : "Фильтр: игрок/пара"}
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
              tournament.isDouble() &&
              free instanceof Player &&
              selectedPlayers.some((sp) => sp.id === free.id);

            const showCreateHere =
              tournament.isDouble() &&
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
                        tournament.isDouble() && free instanceof Player ? "clickable" : ""
                      } ${isSelected ? "active" : ""}`}
                      onClick={() =>
                        tournament.isDouble() && free instanceof Player
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
                    {tournament.isDouble() ? (
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
                          onClick={() => addPlayerToTournament?.((free as Player).id)
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
                        onClick={() => removeParticipant?.(part)}
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