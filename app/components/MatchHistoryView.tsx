"use client";

import { useState } from "react";

import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";

import { AdminOnly } from "./RoleGuard";

import { formatDate } from "@/app/components/Utils";

import "@/app/components/MatchHistory.css";
import {
  SaveIconButton,
  CancelIconButton,
  EditIconButton,
  DeleteIconButton,
  KebabIconButton,
} from "@/app/components/IconButtons";

type MatchHistoryViewProps = {
  player: Player | null;                    // Если передаем игрока то историю показыаем только по нему
  matches: Match[];
  onEditMatch?: (match: Match) => void;
  onDeleteMatch?: (match: Match) => void;
  showTournament?: boolean;
};

export function MatchHistoryView({
  player,
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

  // Фильтруем только матчи игрока
  const displayMatches = player
    ? matches.filter((m) => m.player1?.id === player.id || m.player2?.id === player.id)
    : matches;

  const sortedMatches = [...displayMatches].sort(
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
    onDeleteMatch?.(m);
  };

  return (
    <div className="history-wrap">
      {player ? <div className="chip chip-margin-bottom">История матчей {player.name}</div> : ""}
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
                    <div className="badge show-sm-only">
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
                        !winnerId
                          ? "chip"
                          : winnerId === (m.player1?.id ?? m.team1?.id)
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
                        !winnerId
                          ? "chip"
                          : winnerId === (m.player2?.id ?? m.team2?.id)
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
                        <SaveIconButton
                          title="Сохранить"
                          onClick={() => saveEditing(m)}
                        />
                        <CancelIconButton
                          title="Отмена"
                          onClick={cancelEditing}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="score-readonly">
                      <span>{m.formatResult()}</span>

                      <AdminOnly>
                      {/* ховер-тулбар (десктоп) + кнопка меню (мобил) */}
                      <div className="row-actions">
                        <EditIconButton
                          title="Редактировать"
                          className="hide-sm"
                          onClick={() => startEditing(m)}
                        />
                        <DeleteIconButton
                          title="Удалить"
                          className="hide-sm"
                          onClick={() => confirmDelete(m)}
                        />

                        {/* Kebab для мобилок (и клавиатуры) */}
                        <div className="menu-wrap">
                          <KebabIconButton
                            title="Действия"
                            className="kebab show-sm-only"
                            aria-label="Меню строки"
                            onClick={() =>
                              setOpenMenuId((id) => (id === m.id ? null : m.id))
                            }
                          />
                          {openMenuId === m.id && (
                            <div
                              className="menu"
                              role="menu"
                              tabIndex={-1}
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
                      </AdminOnly>
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