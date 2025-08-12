"use client";

import { useEffect, useState } from "react";
import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { MatchRepository } from "@/app/repositories/MatchRepository";
import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";
import { NavigationBar } from "@/app/components/NavigationBar";

import "@/app/components/MatchHistory.css"; // реюзим стили

export default function PlayerListView() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<Record<number, { matches: number; wins: number }>>({});
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({ name: "", ntrp: "" });

  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Player>>({});
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
  const list = await PlayersRepository.loadAll();

  const matches: Match[] = await MatchRepository.loadAll();
  const s = Player.getPlayerStats(matches);
  setStats(s);

  // сортировка по матчам и winrate
  const sorted = [...list].sort((a, b) => {
      const sa = s[a.id] || { matches: 0, wins: 0 };
      const sb = s[b.id] || { matches: 0, wins: 0 };

      if (sb.matches !== sa.matches) {
        return sb.matches - sa.matches; // сначала по матчам
      }

      const wrA = sa.matches ? sa.wins / sa.matches : 0;
      const wrB = sb.matches ? sb.wins / sb.matches : 0;

      return wrB - wrA; // потом по winrate
    });

    setPlayers(sorted);
  };

  const winrate = (id: number) => {
    const st = stats[id];
    if (!st || !st.matches) return "0%";
    return ((st.wins / st.matches) * 100).toFixed(1) + "%";
  };

  const addPlayer = async () => {
    if (!newPlayer.name?.trim()) return;
    await PlayersRepository.add(newPlayer);
    setNewPlayer({ name: "", ntrp: "" });
    loadPlayers();
  };

  const startEdit = (p: Player) => {
    setEditId(p.id);
    setEditData({ name: p.name, ntrp: p.ntrp });
    setOpenMenuId(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    if (!editId || !editData.name?.trim()) return;
    await PlayersRepository.update(editId, editData);
    cancelEdit();
    loadPlayers();
  };

  const deletePlayer = async (id: number) => {
    setOpenMenuId(null);
    if (typeof window === "undefined" || window.confirm("Удалить игрока? Это действие необратимо.")) {
      await PlayersRepository.delete(id);
      loadPlayers();
    }
  };

  return (
    <div className="page-container">
      <NavigationBar />
      <h1 className="page-title">Рейтинг игроков</h1>

      <div className="history-wrap">
        <div className="chip chip-margin-bottom">Список игроков</div>

        <table className="history-table">
          <thead className="history-table-head">
            <tr>
              <th>Игрок</th>
              <th className="hide-sm">NTRP</th>
              <th className="hide-sm">Игры</th>
              <th className="hide-sm">Победы</th>
              <th className="score-col">Winrate</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => {
              const isEditing = editId === p.id;
              return (
                <tr key={p.id} className={isEditing ? "editing" : ""}>
                  {/* Имя */}
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        className="inline-input"
                        placeholder="Имя"
                        value={editData.name || ""}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                    ) : (
                      <span className="chip" title="Игрок">
                        {p.name}
                      </span>
                    )}
                    {/* Для мобилок — бейдж NTRP под именем */}
                    <div className="show-sm-only" style={{ marginTop: 6 }}>
                      <span className="chip" title="NTRP">
                        {p.ntrp || "—"}
                      </span>
                    </div>
                  </td>

                  {/* NTRP (десктоп-колонка) */}
                  <td className="hide-sm">
                    {isEditing ? (
                      <input
                        type="text"
                        className="inline-input"
                        placeholder="NTRP"
                        value={editData.ntrp || ""}
                        onChange={(e) => setEditData({ ...editData, ntrp: e.target.value })}
                      />
                    ) : (
                      p.ntrp || "—"
                    )}
                  </td>

                  {/* Игр / Побед (десктоп) */}
                  <td className="hide-sm">{stats[p.id]?.matches ?? 0}</td>
                  <td className="hide-sm">{stats[p.id]?.wins ?? 0}</td>

                  {/* Winrate + действия */}
                  <td className="score-col">
                    {isEditing ? (
                      <div className="score-edit-wrap">
                        <div className="row-actions always-visible">
                          <button
                            className="icon-btn save"
                            onClick={saveEdit}
                            aria-label="Сохранить"
                            title="Сохранить"
                          >
                            {/* check */}
                            <svg width="18" height="18" viewBox="0 0 24 24">
                              <path
                                d="M20 6L9 17l-5-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            className="icon-btn cancel"
                            onClick={cancelEdit}
                            aria-label="Отмена"
                            title="Отмена"
                          >
                            {/* x */}
                            <svg width="18" height="18" viewBox="0 0 24 24">
                              <path
                                d="M18 6L6 18M6 6l12 12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="score-readonly">
                        <span>{winrate(p.id)}</span>

                        <div className="row-actions">
                          {/* Десктоп: кнопки сразу */}
                          <button
                            className="icon-btn hide-sm"
                            onClick={() => startEdit(p)}
                            aria-label="Редактировать"
                            title="Редактировать"
                          >
                            {/* pencil */}
                            <svg width="18" height="18" viewBox="0 0 24 24">
                              <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              <path
                                d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            className="icon-btn hide-sm danger"
                            onClick={() => deletePlayer(p.id)}
                            aria-label="Удалить"
                            title="Удалить"
                          >
                            {/* trash */}
                            <svg width="18" height="18" viewBox="0 0 24 24">
                              <path
                                d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>

                          {/* Мобилки: кебаб-меню */}
                          <div className="menu-wrap">
                            <button
                              className="icon-btn kebab show-sm-only"
                              aria-haspopup="true"
                              aria-expanded={openMenuId === p.id}
                              aria-label="Меню строки"
                              onClick={() =>
                                setOpenMenuId((id) => (id === p.id ? null : p.id))
                              }
                              title="Действия"
                            >
                              &#8942;
                            </button>
                            {openMenuId === p.id && (
                              <div
                                className="menu"
                                role="menu"
                                onBlur={(e) => {
                                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                    setOpenMenuId(null);
                                  }
                                }}
                              >
                                <button role="menuitem" onClick={() => startEdit(p)}>
                                  Редактировать
                                </button>
                                <button
                                  role="menuitem"
                                  className="danger"
                                  onClick={() => deletePlayer(p.id)}
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

            {/* Добавление игрока */}
            <tr className="add-row">
              <td>
                <input
                  type="text"
                  className="inline-input"
                  placeholder="Имя"
                  value={newPlayer.name || ""}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                />
              </td>
              <td className="hide-sm">
                <input
                  type="text"
                  className="inline-input"
                  placeholder="NTRP"
                  value={newPlayer.ntrp || ""}
                  onChange={(e) => setNewPlayer({ ...newPlayer, ntrp: e.target.value })}
                />
              </td>
              <td className="hide-sm" colSpan={2} />
              <td className="score-col">
                <div className="row-actions always-visible">
                  <button
                    className="icon-btn save"
                    onClick={addPlayer}
                    aria-label="Добавить"
                    title="Добавить"
                  >
                    {/* plus */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        d="M12 5v14M5 12h14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}