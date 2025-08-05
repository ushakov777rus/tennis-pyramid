"use client";

import { Match } from "@/app/models/Match";
import { formatDate } from "@/app/components/Utils";
import "./MatchHistoryModal.css";
import { useState } from "react";

type MatchHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
  playerId: number | null;
  onEditMatch?: (match: Match) => void;
  onDeleteMatch?: (match: Match) => void;
};

export function MatchHistoryModal({
  isOpen,
  onClose,
  matches,
  playerId,
  onEditMatch,
  onDeleteMatch,
}: MatchHistoryModalProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState<string>("");
  const [editScore, setEditScore] = useState<string>("");

  if (!isOpen || playerId === null) return null;

  // Фильтруем только матчи игрока
  const playerMatches = matches.filter(
    (m) => m.player1?.id === playerId || m.player2?.id === playerId
  );

  // Сортировка (новые → старые)
  const sortedMatches = [...playerMatches].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Определяем имя игрока
  const playerName =
    playerMatches[0]?.player1?.id === playerId
      ? playerMatches[0]?.player1?.name
      : playerMatches[0]?.player2?.name;

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="match-history-modal" onClick={(e) => e.stopPropagation()}>
        <h3>История матчей {playerName ? `— ${playerName}` : ""}</h3>

        {playerMatches.length === 0 ? (
          <p>Нет матчей</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Соперник</th>
                <th>Счёт</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {sortedMatches.map((m) => {
                const isWinner = m.getWinnerId() === playerId;
                const opponentName =
                  m.player1?.id === playerId ? m.player2?.name : m.player1?.name;

                const isEditing = editingId === m.id;

                return (
                  <tr key={m.id} className={isWinner ? "win" : "loss"}>
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
                    <td>{opponentName}</td>
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
        )}

        <button className="close-btn" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
}