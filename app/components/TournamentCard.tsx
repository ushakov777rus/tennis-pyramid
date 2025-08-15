"use client";

import { formatDate } from "@/app/components/Utils";

import { Tournament } from "@/app/models/Tournament";
import { Player } from "@/app/models/Player";

import "./TournamentCard.css"

type TournamentCardProps = {
  tournament: Tournament;
  participantsCount: number;
  matchesCount: number;
  onClick?: () => void;
};

export function TournamentCard({
  tournament,
  participantsCount,
  matchesCount,
  onClick,
}: TournamentCardProps) {
  return (
    <div 
      className={`card card-with-status ${onClick ? "clickable" : ""}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
   >
      <div className="tournament-header">
        {onClick ? (
          <h2>{tournament.name}</h2>
        ) : null}

        <div className="tournament-status" style={{ minWidth: 80, display: "flex", justifyContent: "flex-end" }}>
          <span className={`status ${tournament.status}`}>
            {tournament.getStatus()}
          </span>
        </div>
      </div>
      <div className="tournament-details" style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <table>
          <tbody>
            <tr>
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
                {tournament.start_date
                  ? formatDate(new Date(tournament.start_date))
                  : "—"}
                {tournament.end_date &&
                  ` → ${formatDate(new Date(tournament.end_date))}`}
              </td>
            </tr>
            <tr>
              <td>👫</td>
              <td>Количество участников:</td>  
              <td>{participantsCount}</td>
            </tr>
            <tr>
              <td>🎾</td> 
              <td>Количество игр:</td> 
              <td>{matchesCount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}