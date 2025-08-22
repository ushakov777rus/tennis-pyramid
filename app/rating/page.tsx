"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useUser } from "@/app/components/UserContext";
import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { MatchRepository } from "@/app/repositories/MatchRepository";
import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";
import { NavigationBar } from "@/app/components/NavigationBar";

import {
  SaveIconButton,
  CancelIconButton,
  EditIconButton,
  DeleteIconButton,
  PlusIconButton,
  KebabIconButton,
} from "@/app/components/IconButtons";

import "@/app/components/MatchHistory.css";
import { AdminOnly, SiteAdminOnly } from "../components/RoleGuard";
import { OrganizerContactsRepository } from "@/app/repositories/OrganizerContactRepository";
import { CustomSelect } from "../components/CustomSelect";

export default function PlayerListView() {
  const { user } = useUser();
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<Record<number, { matches: number; wins: number }>>({});
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({ name: "", ntrp: "" });

  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Player>>({});
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // карта: playerId -> является ли "моим" (true/false). undefined = ещё не проверяли
  const [myMap, setMyMap] = useState<Record<number, boolean | undefined>>({});

  // === Пагинация ===
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    const list = await PlayersRepository.loadAll();
    const matches: Match[] = await MatchRepository.loadAll();
    const s = Player.getPlayerStats(matches);
    setStats(s);

    const sorted = [...list].sort((a, b) => {
      const sa = s[a.id] || { matches: 0, wins: 0 };
      const sb = s[b.id] || { matches: 0, wins: 0 };
      if (sb.matches !== sa.matches) return sb.matches - sa.matches;
      const wrA = sa.matches ? sa.wins / sa.matches : 0;
      const wrB = sb.matches ? sb.wins / sb.matches : 0;
      return wrB - wrA;
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
    await PlayersRepository.add(newPlayer, user?.id);
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

  const addToMyPlayers = async (id: number) => {
    if (!user?.id) return;
    await OrganizerContactsRepository.addVisiblePlayer(user.id, id);
    setMyMap((m) => ({ ...m, [id]: true }));
  };

  const removeFromMyPlayers = async (id: number) => {
    if (!user?.id) return;
    await OrganizerContactsRepository.removeVisiblePlayer(id, user.id);
    setMyMap((m) => ({ ...m, [id]: false }));
  };

  // при открытии меню по игроку — проверяем, «мой» ли он
  const ensureMyStatus = async (playerId: number) => {
    if (myMap[playerId] !== undefined) return;
    const res = await OrganizerContactsRepository.isMyPlayer(playerId, user?.id);
    setMyMap((m) => ({ ...m, [playerId]: res }));
  };

  // === Поиск (через отложенное значение, чтобы не тормозил ввод)
  const searchText = newPlayer.name ?? "";
  const deferredSearch = useDeferredValue(searchText);

  const filteredPlayers = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    if (!q) return players;
    return players.filter((p) => p.name.toLowerCase().includes(q));
  }, [players, deferredSearch]);

  // Если фильтр (или размер страницы) меняется — сбрасываемся на 1-ю страницу
  useEffect(() => {
    setPage(1);
  }, [deferredSearch, pageSize]);

  // Параметры пагинации
  const total = filteredPlayers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  useEffect(() => {
    if (page !== safePage) setPage(safePage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const from = (safePage - 1) * pageSize;
  const to = Math.min(from + pageSize, total);
  const pageItems = filteredPlayers.slice(from, to);

  const goFirst = () => setPage(1);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const goLast = () => setPage(totalPages);

  // простая пагинация с несколькими кнопками-страницами вокруг текущей
  const pageNumbers = useMemo(() => {
    const spread = 1; // сколько страниц слева/справа
    const start = Math.max(1, safePage - spread);
    const end = Math.min(totalPages, safePage + spread);
    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [safePage, totalPages]);

  return (
    <div className="page-container">
      <NavigationBar />
      <h1 className="page-title">Рейтинг игроков</h1>

      <div className="page-content-container">
        <div className="history-wrap">
          <table className="history-table">
            <thead className="history-table-head">
              <tr>
                <th>Игрок</th>
                <th className="hide-sm">NTRP</th>
                <th>Игры</th>
                <th>Победы</th>
                <th>Winrate</th>
                <th className="score-col"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="add-row">
                <td>
                  {/* Поле одновременно для ввода НОВОГО игрока и фильтра списка */}
                  <input
                    type="text"
                    className="inline-input"
                    placeholder="Имя (и поиск)"
                    value={newPlayer.name || ""}
                    onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  />
                </td>
                <AdminOnly>
                  <td className="hide-sm">
                    <input
                      type="text"
                      className="inline-input"
                      placeholder="NTRP"
                      value={newPlayer.ntrp || ""}
                      onChange={(e) => setNewPlayer({ ...newPlayer, ntrp: e.target.value })}
                    />
                  </td>
                  <td colSpan={3} />
                  <td className="score-col">
                    <div className="row-actions always-visible">
                      <PlusIconButton onClick={addPlayer} title="Добавить" />
                    </div>
                  </td>
                </AdminOnly>
              </tr>

              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", opacity: 0.7, padding: 12 }}>
                    Ничего не найдено
                  </td>
                </tr>
              )}

              {pageItems.map((p) => {
                const isEditing = editId === p.id;
                const isMine = myMap[p.id];

                return (
                  <tr key={p.id} className={isEditing ? "editing" : ""}>
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
                        <span className="chip">{p.displayName(false)}</span>
                      )}
                      <div className="show-sm-only" style={{ marginTop: 6 }}>
                        <span className="badge ntrp-badge">NTRP: {p.ntrp || "—"}</span>
                      </div>
                    </td>

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

                    <td>{stats[p.id]?.matches ?? 0}</td>
                    <td>{stats[p.id]?.wins ?? 0}</td>

                    <td>{winrate(p.id)}</td>

                    <AdminOnly>
                      <td className="score-col">
                        {isEditing ? (
                          <div className="row-actions always-visible">
                            <SaveIconButton onClick={saveEdit} title="Сохранить" aria-label="Сохранить" />
                            <CancelIconButton onClick={cancelEdit} title="Отмена" aria-label="Отмена" />
                          </div>
                        ) : (
                          <div className="row-actions">
                            <EditIconButton
                              className="hide-sm"
                              onClick={() => startEdit(p)}
                              title="Редактировать"
                            />
                            <DeleteIconButton
                              className="hide-sm"
                              onClick={() => deletePlayer(p.id)}
                              title="Удалить"
                            />
                            <div className="menu-wrap">
                              <KebabIconButton
                                className="show-sm-only"
                                aria-haspopup="true"
                                aria-expanded={openMenuId === p.id}
                                onClick={async () => {
                                  setOpenMenuId((id) => (id === p.id ? null : p.id));
                                  if (openMenuId !== p.id) {
                                    await ensureMyStatus(p.id);
                                  }
                                }}
                                title="Действия"
                              />
                              {openMenuId === p.id && (
                                <div className="menu" role="menu">
                                  {isMine === false && (
                                    <button role="menuitem" onClick={() => addToMyPlayers(p.id)}>
                                      Добавить в мои
                                    </button>
                                  )}

                                  {isMine === true && (
                                    <button role="menuitem" onClick={() => removeFromMyPlayers(p.id)}>
                                      Удалить из моих
                                    </button>
                                  )}

                                  <SiteAdminOnly>
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
                                  </SiteAdminOnly>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                    </AdminOnly>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Пагинация снизу */}
        <div className="card" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ fontWeight: 500 }}>Показано: {total ? `${from + 1}–${to}` : 0} из {total}</div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <button className="pagination-btn" onClick={goFirst} disabled={safePage === 1} aria-label="Первая страница">«</button>
            <button className="pagination-btn" onClick={goPrev} disabled={safePage === 1} aria-label="Предыдущая страница">‹</button>

            {pageNumbers[0] > 1 && <span style={{ padding: "0 6px" }}>…</span>}
            {pageNumbers.map((n) => (
              <button
                key={n}
                className="pagination-btn"
                onClick={() => setPage(n)}
                aria-current={n === safePage ? "page" : undefined}
                style={{
                  fontWeight: n === safePage ? 700 : 400,
                  textDecoration: n === safePage ? "underline" : "none",
                }}
              >
                {n}
              </button>
            ))}
            {pageNumbers[pageNumbers.length - 1] < totalPages && <span style={{ padding: "0 6px" }}>…</span>}

            <button className="pagination-btn" onClick={goNext} disabled={safePage === totalPages} aria-label="Следующая страница">›</button>
            <button className="pagination-btn" onClick={goLast} disabled={safePage === totalPages} aria-label="Последняя страница">»</button>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
              <label htmlFor="pageSizeSelBottom" style={{ opacity: 0.8 }}>На странице:</label>

              <CustomSelect
                className="input"
                options={[
                  { value: 10, label: "10" },
                  { value: 25, label: "25" },
                  { value: 50, label: "50" },
                  { value: 100, label: "100" },
                ]}
                value={pageSize}
                onChange={(val) => setPageSize(Number(val))}
                disabled={false}
                showSearch={false}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
