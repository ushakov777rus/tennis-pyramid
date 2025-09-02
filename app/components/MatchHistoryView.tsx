"use client";

import { useMemo, useState } from "react";

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
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const sortedMatches = useMemo(
    () => [...matches].sort((a, b) => new Date(b.date as any).getTime() - new Date(a.date as any).getTime()),
    [matches]
  );

  const getSideName = (m: Match, side: 1 | 2) => {
    if (m.type === "double") {
      return side === 1 ? m.team1?.displayName(false) ?? "??" : m.team2?.displayName(false) ?? "??";
    }
    return side === 1 ? m.player1?.displayName(false) ?? "??" : m.player2?.displayName(false) ?? "??";
  };

  if (matches.length === 0) return <p className="history-empty">Матчей пока нет</p>;

  const startEditing = (m: Match) => {
    setEditingId(m.id);
    setEditDate(new Date(m.date as any).toISOString().split("T")[0]);
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
      {/* Контейнер с вертикальным скроллингом и закрепленным header */}
      <div className="match-history-scroll-container">
        <table className="table match-history">
          <colgroup>
            <col className="col-date" />
            <col className="col-players" />
            <col className="col-score" />
            <col className="col-actions" />
          </colgroup>

          {/* Header таблицы */}
          <thead className="match-history-header">
            <tr>
              <th>Дата</th>
              <th>Игроки</th>
              <th className="score-col">Счёт</th>
              <th></th>
            </tr>
          </thead>

          {/* Тело таблицы с прокруткой */}
          <tbody className="match-history-body">
            {sortedMatches.map((m) => {
              const isEditing = editingId === m.id;
              const winnerId = m.getWinnerId();

              return (
                <tr key={m.id} className={isEditing ? "editing" : ""}>
                  <td className="date-cell">
                    {isEditing ? (
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="input"
                      />
                    ) : (
                      <span className="date">{formatDate(m.date)}</span>
                    )}
                    <div className="badge">{m.tournament?.name ?? "—"}</div>
                  </td>

                  <td>
                    <div className="players">
                      <span
                        className={!winnerId ? "player" : winnerId === (m.player1?.id ?? m.team1?.id) ? "player win" : "player"}
                      >
                        {getSideName(m, 1)}
                      </span>
                      <span
                        className={!winnerId ? "player" : winnerId === (m.player2?.id ?? m.team2?.id) ? "player win" : "player"}
                      >
                        {getSideName(m, 2)}
                      </span>
                    </div>
                  </td>

                  <td className="score-col">
                    {isEditing ? (
                      <div className="score-edit-wrap">
                        <input
                          type="text"
                          value={editScore}
                          onChange={(e) => setEditScore(e.target.value)}
                          placeholder="напр.: 6-4, 4-6, 10-8"
                          className="input"
                        />
                      </div>
                    ) : (
                      <span>{m.formatResult()}</span>
                    )}
                  </td>

                  <td className="actions-col">
                    {isEditing ? (
                      <div className="row-actions always-visible">
                        <SaveIconButton title="Сохранить" onClick={() => saveEditing(m)} />
                        <CancelIconButton title="Отмена" onClick={cancelEditing} />
                      </div>
                    ) : (
                      <AdminOnly>
                        <div>
                          <EditIconButton
                            title="Редактировать"
                            className="row-actions hide-sm"
                            onClick={() => startEditing(m)}
                          />
                          <DeleteIconButton
                            title="Удалить"
                            className="row-actions hide-sm"
                            onClick={() => confirmDelete(m)}
                          />

                          <div className="menu-wrap">
                            <KebabIconButton
                              title="Действия"
                              className="kebab show-sm-only"
                              onClick={() =>
                                setOpenMenuId((id) => (id === m.id ? null : m.id))
                              }
                            />
                            {openMenuId === m.id && (
                              <div className="menu" role="menu">
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
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}