"use client";

import { Tournament } from "@/app/models/Tournament";
import { formatDate } from "@/app/components/Utils";

type Props = {
  tournament: Tournament;
  participantsCount: number;
  matchesCount: number;
  rightSlot?: React.ReactNode; // опционально: можно передать любые действия справа
};

export function TournamentCard({ tournament, participantsCount, matchesCount, rightSlot }: Props) {
  return (
    <div className="card">
      <div className="tournament-details" style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <div>
          <p>
            🏆 Тип: {tournament.tournament_type === "single" ? "Одиночный" : "Парный"}
          </p>
          <p>
            📅 {tournament.start_date ? formatDate(new Date(tournament.start_date)) : "—"}
            {" → "}
            {tournament.end_date ? formatDate(new Date(tournament.end_date)) : "?"}
          </p>
          <p>👫 Количество участников: {participantsCount}</p>
          <p>🎾 Количество игр: {matchesCount}</p>
        </div>

        <div className="tournament-status" style={{ minWidth: 80, display: "flex", justifyContent: "flex-end" }}>
          <span className={`status ${tournament.status}`}>
            {tournament.getStatus()}
          </span>
        </div>
      </div>

      {rightSlot && (
        <div style={{ marginTop: 12 }}>
          {rightSlot}
        </div>
      )}
    </div>
  );
}