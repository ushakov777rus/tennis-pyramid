"use client";

import { useMemo, useState } from "react";
import { Player } from "@/app/models/Player";
import { Team } from "@/app/models/Team";
import { Participant } from "@/app/models/Participant";

import "./TeamsTable.css"; // реюз тех же таблиц/кнопок/чипов
import { DeleteIconButton, PlusIconButton } from "./IconButtons";
import { AdminOnly } from "./RoleGuard";

type TournamentParticipantsViewProps = {
  availablePlayers: Player[];           // слева (игроки, если есть)
  availableTeams: Team[];               // слева (пары, если игроков нет)
  tournamentParticipants: Participant[]; // справа (участники турнира)

  onAddPlayerToTournament: (playerId: number) => void;
  onAddTeamToTournament: (teamId: number) => void;
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
  // ===== фильтры по колонкам (первая строка tbody) =====
  const [leftFilter, setLeftFilter] = useState("");   // фильтр для свободных (игроки/пары)
  const [rightFilter, setRightFilter] = useState(""); // фильтр для участников турнира

  const lf = leftFilter.trim().toLowerCase();
  const rf = rightFilter.trim().toLowerCase();

  // фильтрация слева
  const filteredPlayers = useMemo(
    () => (lf ? availablePlayers.filter(p => p.name.toLowerCase().includes(lf)) : availablePlayers),
    [availablePlayers, lf]
  );

  const filteredTeams = useMemo(
    () => (lf ? availableTeams.filter(t => (t.name || "").toLowerCase().includes(lf)) : availableTeams),
    [availableTeams, lf]
  );

  // показываем слева игроков, если они есть в принципе; иначе — пары
  const usePlayersLeft = availablePlayers.length > 0;
  const leftList: (Player | Team)[] = usePlayersLeft ? filteredPlayers : filteredTeams;

  // фильтрация справа
  const filteredParticipants = useMemo(
    () => (rf ? tournamentParticipants.filter(p => p.displayName.toLowerCase().includes(rf)) : tournamentParticipants),
    [tournamentParticipants, rf]
  );

  const maxRows = Math.max(leftList.length, filteredParticipants.length);

  return (
    <table className="history-table">
      <thead className="history-table-head">
        <tr>
          <th colSpan={2}>{usePlayersLeft ? "Свободные игроки" : "Свободные пары"}</th>
          <th colSpan={2}>Участники турнира</th>
        </tr>
      </thead>

      <tbody>
        {/* строка фильтров (в начале tbody, всегда показываем) */}
        <tr>
          <td>
            <input
              type="text"
              className="inline-input"
              placeholder={usePlayersLeft ? "Фильтр: игрок" : "Фильтр: пара"}
              value={leftFilter}
              onChange={(e) => setLeftFilter(e.target.value)}
              aria-label="Фильтр свободных игроков/пар"
            />
          </td>
          <td className="score-col">{/* под действия */}</td>
          <td>
            <input
              type="text"
              className="inline-input"
              placeholder="Фильтр: участник турнира"
              value={rightFilter}
              onChange={(e) => setRightFilter(e.target.value)}
              aria-label="Фильтр участников турнира"
            />
          </td>
          <td className="score-col">{/* под действия */}</td>
        </tr>

        {/* контент */}
        {maxRows === 0 ? (
          <tr>
            <td colSpan={4} style={{ textAlign: "center", opacity: 0.7, padding: 12 }}>
              Ничего не найдено
            </td>
          </tr>
        ) : (
          Array.from({ length: maxRows }).map((_, i) => {
            const free = leftList[i] as Player | Team | undefined;
            const part = filteredParticipants[i];

            return (
              <tr key={i}>
                {/* Свободные: чип + добавить */}
                <td>{free ? <span className="chip">{(free as any).name}</span> : ""}</td>
                <td className="score-col">
                  {free && (
                    <div className="row-actions always-visible">
                      <AdminOnly>
                        <PlusIconButton
                          title="Добавить в турнир"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (usePlayersLeft) onAddPlayerToTournament((free as Player).id);
                            else onAddTeamToTournament((free as Team).id);
                          }}
                        />
                      </AdminOnly>
                    </div>
                  )}
                </td>

                {/* Уже в турнире: чип + удалить */}
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
          })
        )}
      </tbody>
    </table>
  );
}