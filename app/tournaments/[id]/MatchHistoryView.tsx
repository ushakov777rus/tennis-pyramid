"use client";

import { Match } from "@/app/models/Match";
import { formatDate } from "@/app/components/Utils";
import "./MatchHistoryView.css";
import { useState } from "react";

type MatchHistoryViewProps = {
  matches: Match[];
  onEditMatch?: (match: Match) => void;
  onDeleteMatch?: (match: Match) => void;
};

export function MatchHistoryView({
  matches,
  onEditMatch,
  onDeleteMatch,
}: MatchHistoryViewProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState<string>("");
  const [editScore, setEditScore] = useState<string>("");

  if (matches.length === 0) {
    return <p>Матчей пока нет</p>;
  }

  // сортировка (новые → старые)
  const sortedMatches = [...matches].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const startEditing = (m: Match) => {
    setEditingId(m.id);
    setEditDate(m.date.toISOString().split("T")[0]);
    setEditScore(m.formatResult());
  };

  const saveEditing = (m: Match) => {
    const newSets: [number, number][] = editScore.split(",").map((set) => {
      const [a, b] = set.trim().split("-").map(Number);
      return [a, b];
    });

    const updated = new Match(
      m.id,
      m.type,
      new Date(editDate),
      newSets,
      m.tournament,
      m.player1,
      m.player2,
      m.team1,
      m.team2
    );

    onEditMatch?.(updated);
    setEditingId(null);
  };

  return (
    <table className="matches-table">
      <thead>
        <tr>
          <th>Дата</th>
          <th>Игрок 1</th>
          <th>Игрок 2</th>
          <th>Счёт</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {sortedMatches.map((m) => {
          const isEditing = editingId === m.id;

          return (
            <tr key={m.id}>
              <td>
                {isEditing ? (
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                ) : (
                  formatDate(m.date)
                )}
              </td>
              <td>{m.player1?.name || m.team1?.name || "??"}</td>
              <td>{m.player2?.name || m.team2?.name || "??"}</td>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    value={editScore}
                    onChange={(e) => setEditScore(e.target.value)}
                    placeholder="например: 6-4, 4-6, 10-8"
                  />
                ) : (
                  m.formatResult()
                )}
              </td>
              <td>
                {isEditing ? (
                  <>
                    <button onClick={() => saveEditing(m)}>💾</button>
                    <button onClick={() => setEditingId(null)}>🚫</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(m)}>✏️</button>
                    <button onClick={() => onDeleteMatch?.(m)}>🗑️</button>
                  </>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}