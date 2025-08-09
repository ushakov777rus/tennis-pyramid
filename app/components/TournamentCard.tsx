"use client";

import { formatDate } from "@/app/components/Utils";

import { Tournament } from "@/app/models/Tournament";
import { Player } from "@/app/models/Player";

import "./TournamentCard.css"

type Props = {
  tournament: Tournament;
  participantsCount: number;
  matchesCount: number;
  mostMatches: Player | undefined;
  mostMatchesCnt: number;
  mostWins: Player | undefined;
  mostWinsCnt: number;
  rightSlot?: React.ReactNode; // опционально: можно передать любые действия справа
};

export function TournamentCard({ tournament, participantsCount, matchesCount, mostMatches, mostMatchesCnt, mostWins, mostWinsCnt, rightSlot }: Props) {
  return (
    <div className="card card-with-status">
      <div className="tournament-status" style={{ minWidth: 80, display: "flex", justifyContent: "flex-end" }}>
        <span className={`status ${tournament.status}`}>
          {tournament.getStatus()}
        </span>
      </div>
      <div className="tournament-details" style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <table>
          <tbody>
            <tr>
              <td>🏆</td>
              <td>Тип:</td>  
              <td>{tournament.tournament_type === "single" ? "Одиночный" : "Парный"}</td>
            </tr>
            <tr>
              <td>📅</td>
              <td>Даты:</td>
              <td>
                {tournament.start_date ? formatDate(new Date(tournament.start_date)) : "—"}
                {" → "}
                {tournament.end_date ? formatDate(new Date(tournament.end_date)) : "?"}
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
            <tr>
              <td>🎾</td>
              <td>Сыграл больше всех игр:</td> 
              <td>{mostMatches?.name} ({mostMatchesCnt})</td>
            </tr>
            <tr>
              <td>🎾</td>
              <td>Больше всего выиграл:</td> 
              <td>{mostWins?.name} ({mostWinsCnt})</td>
            </tr>
          </tbody>
        </table>
      </div>

      {rightSlot && (
        <div style={{ marginTop: 12 }}>
          {rightSlot}
        </div>
      )}
    </div>
  );
}