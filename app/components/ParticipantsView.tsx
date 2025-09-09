"use client";

import "@/app/components/ParticipantsView.css";

import { useTournament } from "@/app/tournaments/[slug]/TournamentProvider";
import { useMemo, useState } from "react";
import { Player } from "../models/Player";
import { CreateTeamIconButton, DeleteIconButton, PlusIconButton } from "./IconButtons";
import { AdminOnly } from "./RoleGuard";

// очень простой inline-спиннер (можете заменить своим компонентом)
function InlineSpinner() {
  return <span className="inline-spinner" aria-label="Loading" />;
}

export function ParticipantsView() {
  const {
    initialLoading, // первая загрузка
    refreshing,     // тихий рефетч
    mutating,       // идёт мутация
    tournament,
    players,
    participants,
    createAndAddTeamToTournament,
    addPlayerToTournament,
    removeParticipant,
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
      if (p.player) return [p.player.id];
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
      if (sel.length === 2) return [player];
      return [...sel, player];
    });
  };

  const lastSelectedId =
    selectedPlayers.length > 0
      ? selectedPlayers[selectedPlayers.length - 1].id
      : undefined;

  const createTeam = () => {
    if (selectedPlayers.length === 2 && tournament?.id) {
      createAndAddTeamToTournament?.(tournament.id, selectedPlayers[0].id, selectedPlayers[1].id);
      setSelectedPlayers([]);
    }
  };

  // показываем сплэш только при первой загрузке
  if (initialLoading || !tournament) {
    return <p>Загрузка...</p>;
  }

  return (
    <table className="participants-table" aria-busy={refreshing || mutating}>
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
          <th colSpan={2} style={{ width: "50%", position: "relative" }}>
            Участники турнира{" "}
            {(refreshing || mutating) ? <InlineSpinner /> : null}
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
              free instanceof Object && // Player
              selectedPlayers.some((sp) => sp.id === (free as Player).id);

            const showCreateHere =
              tournament.isDouble() &&
              free instanceof Object &&
              isSelected &&
              (free as Player).id === lastSelectedId &&
              selectedPlayers.length === 2;

            return (
              <tr key={i}>
                {/* свободные */}
                <td>
                  {free ? (
                    <span
                      className={`player ${tournament.isDouble() ? "clickable" : ""} ${isSelected ? "active" : ""}`}
                      onClick={() =>
                        tournament.isDouble()
                          ? toggleSelectPlayer(free as Player)
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
                          disabled={mutating}
                        />
                      )
                    ) : (
                      free && (
                        <PlusIconButton
                          title="Добавить"
                          onClick={() => addPlayerToTournament?.((free as Player).id)}
                          disabled={mutating}
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
                        disabled={mutating}
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