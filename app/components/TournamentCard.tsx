"use client";

import { formatDate } from "@/app/components/Utils";
import { Tournament } from "@/app/models/Tournament";
import { DeleteIconButton } from "./IconButtons";

import "./TournamentCard.css";

type TournamentCardProps = {
  tournament: Tournament | null;
  participantsCount: number;
  matchesCount: number;
  displayName: boolean;
  onClick?: () => void;
  onDelete?: (tournamentId: number) => void;
};

export function TournamentCard({
  tournament,
  participantsCount,
  matchesCount,
  displayName = true,
  onClick,
  onDelete
}: TournamentCardProps) {
  const className = `card card-with-status ${onClick ? "clickable" : ""}`;
  const style: React.CSSProperties = {
    cursor: onClick ? "pointer" : "default",
  };

// Пустая карточка-скелет, если турнира нет (null/undefined)
if (tournament == null) {
  return (
    <div className={className} onClick={onClick} style={style}>
      <div className="card-add">
        +
      </div>
    </div>
  );
}

  return (
    <div className={className} onClick={onClick} style={style}>
      <div className="tournament-header">
        {displayName && (
          <h3>{tournament.name}</h3>
        )}
        <div
          className="tournament-status"
          style={{ minWidth: 80, display: "flex", justifyContent: "flex-end" }}
        >
          <span className={`status ${tournament.status}`}>{tournament.getStatus()}</span>
        </div>
      </div>

      <div
        className="tournament-details"
      >
        <table className="tournament-card-table">
          <tbody className="tournament-card-table-body">
            <tr  >
              <td>🏆</td>
              <td>Тип:</td>
              <td>{tournament.getType()}</td>
            </tr>
            <tr>
              <td>🏆</td>
              <td>Формат:</td>
              <td>{tournament.getFormat()}</td>
            </tr>
            <tr>
              <td>📅</td>
              <td>Даты:</td>
              <td>
                {tournament.start_date ? formatDate(new Date(tournament.start_date)) : "—"}
                {tournament.end_date && ` → ${formatDate(new Date(tournament.end_date))}`}
              </td>
            </tr>
            <tr>
              <td>👫</td>
              <td>Участников:</td>
              <td>{participantsCount}</td>
            </tr>
            <tr>
              <td>🎾</td>
              <td>Игр:</td>
              <td>{matchesCount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {onDelete && (
        <DeleteIconButton
          title="Удалить турнир"
          className="bucket"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(tournament.id);
          }}
        />
      )}
      
    </div>
  );
}