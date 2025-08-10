"use client";

import { useState } from "react";
import { Match } from "@/app/models/Match";
import { formatDate } from "@/app/components/Utils";
import "@/app/components/MatchHistory.css";

type MatchHistoryViewProps = {
  matches: Match[];
  onEditMatch?: (match: Match) => void;
  onDeleteMatch?: (match: Match) => void;
  showTournament?: boolean;
};

export function MatchHistoryView({
  matches,
  onEditMatch,
  onDeleteMatch,
  showTournament = false,
}: MatchHistoryViewProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState<string>("");
  const [editScore, setEditScore] = useState<string>("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  if (matches.length === 0) return <p className="history-empty">Матчей пока нет</p>;

  const sortedMatches = [...matches].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getSideName = (m: Match, side: 1 | 2) => {
    if (m.type === "double") {
      return side === 1 ? m.team1?.name ?? "??" : m.team2?.name ?? "??";
    }
    return side === 1 ? m.player1?.name ?? "??" : m.player2?.name ?? "??";
  };

  const startEditing = (m: Match) => {
    setEditingId(m.id);
    setEditDate(m.date.toISOString().split("T")[0]);
    setEditScore(m.formatResult());
    setOpenMenuId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditDate("");
    setEditScore("");
  };

  const saveEditing = (m: Match) => {
    const newSets: [number, number][] = editScore
      .split(",")
      .map((set) => {
        const [a, b] = set.trim().split("-").map((n) => Number(n));
        return [a, b] as [number, number];
      })
      .filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b));

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
    cancelEditing();
  };

  const confirmDelete = (m: Match) => {
    setOpenMenuId(null);
    if (typeof window !== "undefined") {
      if (window.confirm("Удалить матч? Это действие необратимо.")) {
        onDeleteMatch?.(m);
      }
    } else {
      onDeleteMatch?.(m);
    }
  };

  return (
    <div className="history-wrap">
      <table className="history-table">
        <thead className="history-table-head">
          <tr>
            <th>Дата</th>
            {showTournament && <th className="hide-sm">Турнир</th>}
            <th>Игроки</th>
            <th className="score-col">Счёт</th>
          </tr>
        </thead>
        <tbody>
          {sortedMatches.map((m) => {
            const isEditing = editingId === m.id;
            const winnerId = m.getWinnerId();

            return (
              <tr key={m.id} className={isEditing ? "editing" : ""}>
                {/* Дата */}
                <td className="date-cell">
                  {isEditing ? (
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="inline-input"
                    />
                  ) : (
                    <span className="date">{formatDate(m.date)}</span>
                  )}
                  {showTournament && (
                    <div className="tournament-badge show-sm-only">
                      {m.tournament?.name ?? "—"}
                    </div>
                  )}
                </td>

                {/* Турнир (на десктопе отдельная колонка, на мобилке — бейдж под датой) */}
                {showTournament && (
                  <td className="tournament-cell hide-sm">
                    {m.tournament?.name ?? "—"}
                  </td>
                )}

                {/* Игроки */}
                <td>
                  <div className="players">
                    <span
                      className={
                        winnerId === (m.player1?.id ?? m.team1?.id)
                          ? "chip win"
                          : "chip"
                      }
                      title="Сторона 1"
                    >
                      {getSideName(m, 1)}
                    </span>
                    <span className="vs">—</span>
                    <span
                      className={
                        winnerId === (m.player2?.id ?? m.team2?.id)
                          ? "chip win"
                          : "chip"
                      }
                      title="Сторона 2"
                    >
                      {getSideName(m, 2)}
                    </span>
                  </div>
                </td>

                {/* Счёт + действия */}
                <td className="score-col">
                  {isEditing ? (
                    <div className="score-edit-wrap">
                      <input
                        type="text"
                        value={editScore}
                        onChange={(e) => setEditScore(e.target.value)}
                        placeholder="напр.: 6-4, 4-6, 10-8"
                        className="inline-input"
                      />
                      <div className="row-actions always-visible">
                        <button
                          className="icon-btn save"
                          onClick={() => saveEditing(m)}
                          aria-label="Сохранить"
                          title="Сохранить"
                        >
                          {/* check */}
                          <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button
                          className="icon-btn cancel"
                          onClick={cancelEditing}
                          aria-label="Отмена"
                          title="Отмена"
                        >
                          {/* x */}
                          <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="score-readonly">
                      <span>{m.formatResult()}</span>

                      {/* ховер-тулбар (десктоп) + кнопка меню (мобил) */}
                      <div className="row-actions">
                        <button
                          className="icon-btn hide-sm"
                          onClick={() => startEditing(m)}
                          aria-label="Редактировать"
                          title="Редактировать"
                        >
                          {/* pencil */}
                          <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button
                          className="icon-btn hide-sm danger"
                          onClick={() => confirmDelete(m)}
                          aria-label="Удалить"
                          title="Удалить"
                        >
                          {/* trash */}
                          <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>

                        {/* Kebab для мобилок (и клавиатуры) */}
                        <div className="menu-wrap">
                          <button
                            className="icon-btn kebab show-sm-only"
                            aria-haspopup="true"
                            aria-expanded={openMenuId === m.id}
                            aria-label="Меню строки"
                            onClick={() =>
                              setOpenMenuId((id) => (id === m.id ? null : m.id))
                            }
                            title="Действия"
                          >
                            &#8942;
                          </button>
                          {openMenuId === m.id && (
                            <div
                              className="menu"
                              role="menu"
                              onBlur={(e) => {
                                // если фокус ушёл вне меню, закрываем
                                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                  setOpenMenuId(null);
                                }
                              }}
                            >
                              <button role="menuitem" onClick={() => startEditing(m)}>
                                Редактировать
                              </button>
                              <button
                                role="menuitem"
                                className="danger"
                                onClick={() => confirmDelete(m)}
                              >
                                Удалить
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}