"use client";

import { useEffect, useState } from "react";
import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { MatchRepository } from "@/app/repositories/MatchRepository";
import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";
import { NavigationBar } from "@/app/components/NavigationBar";
import "./page.css";

export default function PlayerListView() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({ name: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Player>>({});
  const [stats, setStats] = useState<Record<number, { matches: number; wins: number }>>({});

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    const list = await PlayersRepository.loadAll();
    setPlayers(list);

    const matches = await MatchRepository.loadAll();
    const s = Player.getPlayerStats(matches);
    setStats(s);
  };

  const addPlayer = async () => {
    if (!newPlayer.name?.trim()) return;
    await PlayersRepository.add(newPlayer);
    setNewPlayer({ name: "" });
    loadPlayers();
  };

  const deletePlayer = async (id: number) => {
    if (!confirm("Удалить игрока?")) return;
    await PlayersRepository.delete(id);
    loadPlayers();
  };

  const saveEdit = async () => {
    if (!editId || !editData.name) return;
    await PlayersRepository.update(editId, editData);
    setEditId(null);
    setEditData({});
    loadPlayers();
  };

  return (
    <div className="page-container">
      <NavigationBar />

      <h1 className="page-title">Рейтинг игроков</h1>

      <div className="page-content-container">

      <table className="player-table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>NTRP</th>
            <th>И</th>
            <th>П</th>
            <th>Winrate %</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) =>
            editId === p.id ? (
              <tr key={p.id} className="edit-row">
                <td>
                  <input
                    type="text"
                    value={editData.name || ""}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editData.ntrp || ""}
                    onChange={(e) => setEditData({ ...editData, ntrp: e.target.value })}
                  />
                </td>
                <td>
                  <button onClick={saveEdit}>💾</button>
                  <button onClick={() => setEditId(null)}>✖️</button>
                </td>
              </tr>
            ) : (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.ntrp || "-"}</td>
                <td>{stats[p.id]?.matches || 0}</td>
                <td>{stats[p.id]?.wins || 0}</td>
                <td>
                  {stats[p.id]?.matches
                    ? ((stats[p.id].wins / stats[p.id].matches) * 100).toFixed(1) + "%"
                    : "0%"}
                </td>
                <td>
                  <button onClick={() => { setEditId(p.id); setEditData(p); }}>✏️</button>
                  <button onClick={() => deletePlayer(p.id)}>🗑</button>
                </td>
              </tr>
            )
          )}

          <tr className="add-row">
            <td>
              <input
                type="text"
                placeholder="Имя"
                value={newPlayer.name || ""}
                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Уровень"
                value={newPlayer.ntrp || ""}
                onChange={(e) => setNewPlayer({ ...newPlayer, ntrp: e.target.value })}
              />
            </td>
            <td>
              <button onClick={addPlayer}>➕</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
    
  );
}