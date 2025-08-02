"use client";

import { Match } from "@/app/models/Match";
import { formatDate } from "@/app/components/Utils";
import "./MatchHistoryView.css";

type MatchHistoryViewProps = {
  matches: Match[];
};

export function MatchHistoryView({ matches }: MatchHistoryViewProps) {
  if (matches.length === 0) {
    return <p>Матчей пока нет</p>;
  }

  // сортировка (новые → старые)
  const sortedMatches = [...matches].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <table className="matches-table">
      <thead>
        <tr>
          <th>Дата</th>
          <th>Игрок 1</th>
          <th>Игрок 2</th>
          <th>Счёт</th>
        </tr>
      </thead>
      <tbody>
        {sortedMatches.map((m) => (
          <tr key={m.id}>
            <td>{formatDate(m.date)}</td>
            <td>{m.player1?.name || m.team1?.name || "??"}</td>
            <td>{m.player2?.name || m.team2?.name || "??"}</td>
            <td>{m.formatResult()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}