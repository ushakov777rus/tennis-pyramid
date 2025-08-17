"use client";

import { useMemo, useState } from "react";
import { useUser } from "@/app/components/UserContext";

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
  player: Player | null; // если передали — показываем только его матчи
  matches: Match[];
  onEditMatch?: (match: Match) => void;
  onDeleteMatch?: (match: Match) => void;
  mask: boolean;
  showTournament?: boolean;
};

export function MatchHistoryView({
  player,
  matches,
  onEditMatch,
  onDeleteMatch,
  mask: boolean,
  showTournament = false,
}: MatchHistoryViewProps) {
  const { user } = useUser();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState<string>("");
  const [editScore, setEditScore] = useState<string>("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // ===== фильтры =====
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [tournamentQ, setTournamentQ] = useState<string>("");
  const [playersQ, setPlayersQ] = useState<string>("");
  const [scoreQ, setScoreQ] = useState<string>("");

  // из пропса player — предварительная фильтрация
  const displayMatches = player
    ? matches.filter((m) => m.player1?.id === player.id || m.player2?.id === player.id)
    : matches;


  // сортировка по дате ↓
  const sortedMatches = useMemo(
    () =>
      [...displayMatches].sort(
        (a, b) => new Date(b.date as any).getTime() - new Date(a.date as any).getTime()
      ),
    [displayMatches]
  );

  const playersLine = (m: Match) => `${getSideName(m, 1, user?.role !== "site_admin")} — ${getSideName(m, 2, user?.role !== "site_admin")}`;

  // применяем фильтры
  const filteredMatches = useMemo(() => {
    const fromTs = dateFrom ? new Date(dateFrom + "T00:00:00").getTime() : null;
    const toTs = dateTo ? new Date(dateTo + "T23:59:59").getTime() : null;

    const tq = tournamentQ.trim().toLowerCase();
    const pq = playersQ.trim().toLowerCase();
    const sq = scoreQ.trim().toLowerCase();

    return sortedMatches.filter((m) => {
      const ts = new Date(m.date as any).getTime();

      if (fromTs && ts < fromTs) return false;
      if (toTs && ts > toTs) return false;

      if (tq && showTournament) {
        const name = (m.tournament?.name ?? "").toLowerCase();
        if (!name.includes(tq)) return false;
      }

      if (pq) {
        const line = playersLine(m).toLowerCase();
        if (!line.includes(pq)) return false;
      }

      if (sq) {
        const res = (m.formatResult?.() ?? "").toLowerCase();
        if (!res.includes(sq)) return false;
      }

      return true;
    });
  }, [sortedMatches, dateFrom, dateTo, tournamentQ, playersQ, scoreQ, showTournament]);



  if (matches.length === 0) return <p className="history-empty">Матчей пока нет</p>;



  const getSideName = (m: Match, side: 1 | 2, mask: boolean) => {
    if (m.type === "double") {
      return side === 1 ? m.team1?.displayName(mask) ?? "??" : m.team2?.displayName(mask) ?? "??";
    }
    return side === 1 ? m.player1?.displayName(mask) ?? "??" : m.player2?.displayName(mask) ?? "??";
  };


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
          {/* строка фильтров — первая в tbody */}
          <tr>
            {/* дата */}
            <td className="date-cell">
              <div className="filter-dates">
              </div>
              {showTournament && (
                <div className="badge show-sm-only" style={{ marginTop: 6 }}>
                  {/* просто занимаем место, чтобы не прыгало */}
                </div>
              )}
            </td>

            {/* турнир (десктоп) */}
            {showTournament && (
              <td className="tournament-cell hide-sm">
              </td>
            )}

            {/* игроки */}
            <td>
              <input
                type="text"
                className="inline-input"
                placeholder="Фильтр: игроки/пары"
                value={playersQ}
                onChange={(e) => setPlayersQ(e.target.value)}
                aria-label="Фильтр игроков"
              />
            </td>

            {/* счёт */}
            <td className="score-col">
            </td>
          </tr>

          {/* данные */}
          {filteredMatches.length === 0 ? (
            <tr>
              <td colSpan={showTournament ? 4 : 3} style={{ textAlign: "center", opacity: 0.7, padding: 12 }}>
                Ничего не найдено
              </td>
            </tr>
          ) : (
            filteredMatches.map((m) => {
              const isEditing = editingId === m.id;
              const winnerId = m.getWinnerId();

              return (
                <tr key={m.id} className={isEditing ? "editing" : ""}>
                  {/* дата */}
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

                  {/* турнир (desktop) */}
                  {showTournament && (
                    <td className="tournament-cell hide-sm">
                      {m.tournament?.name ?? "—"}
                    </td>
                  )}

                  {/* игроки */}
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
                        {getSideName(m, 1, user?.role !== "site_admin")}
                      </span>

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
                        {getSideName(m, 2, user?.role !== "site_admin")}
                      </span>
                    </div>
                  </td>

                  {/* счёт + действия */}
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

                            {/* Kebab для мобилок */}
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
            })
          )}
        </tbody>
      </table>
    </div>
  );
}