"use client";

import { Match } from "@/app/models/Match";
import "./MatchHistoryModal.css";

type MatchHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
  playerId: number | null;
};

export function formatDate(date: Date): string {
  if (!date) return "";
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function MatchHistoryModal({
  isOpen,
  onClose,
  matches,
  playerId,
}: MatchHistoryModalProps) {
  if (!isOpen || playerId === null) return null;

  // Фильтруем только матчи игрока
  const playerMatches = matches.filter(
    (m) => m.player1?.id === playerId || m.player2?.id === playerId
  );

  // Определяем имя игрока (берём из первого матча, где он участвовал)
  const playerName =
    playerMatches[0]?.player1?.id === playerId
      ? playerMatches[0]?.player1?.name
      : playerMatches[0]?.player2?.name;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        {/* 👇 здесь выводим имя */}
        <h3>История матчей {playerName ? `— ${playerName}` : ""}</h3>

        {playerMatches.length === 0 ? (
          <p>Нет матчей</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Соперник</th>
                <th>Результат</th>
                <th>Счёт</th>
              </tr>
            </thead>
            <tbody>
              {playerMatches.map((m) => {
                const isWinner = m.getWinnerId() === playerId;
                const opponentName =
                  m.player1?.id === playerId
                    ? m.player2?.name
                    : m.player1?.name;
                return (
                  <tr key={m.id} className={isWinner ? "win" : "loss"}>
                    <td>{formatDate(m.date)}</td>
                    <td>{opponentName}</td>
                    <td>{isWinner ? "Победа" : "Поражение"}</td>
                    <td>{m.formatResult()}</td>
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