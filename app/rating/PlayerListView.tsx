"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useUser } from "@/app/components/UserContext";
import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { MatchRepository } from "@/app/repositories/MatchRepository";
import { Player } from "@/app/models/Player";
import { Match } from "@/app/models/Match";

import {
  PlusIconButton,
} from "@/app/components/controls/IconButtons";

import "@/app/components/matches/MatchHistoryView.css";
import "./page.css";
import { AdminOnly } from "../components/RoleGuard";
import { PlayerCard } from "../components/players/PlayerCard";

type Props = {
  clubId: number | null;
};

export function PlayerListView({clubId = null} : Props) {
  const { user } = useUser();

  // список игроков и мапа статистики
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<Record<number, { matches: number; wins: number; winrate: number }>>({});

  // форма добавления/поиска
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({ name: "", ntrp: "" });

  // редактирование игрока (зарезервировано)
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Player>>({});

  // состояние «мой игрок» (для меню)
  const [myMap, setMyMap] = useState<Record<number, boolean | undefined>>({});

  useEffect(() => {
    void loadPlayers();
  }, []);

  const loadPlayers = async () => {
    let list;
    if (clubId)
      list = await PlayersRepository.loadByClubId(clubId);
    else
      list = await PlayersRepository.loadAll();
    const matches: Match[] = await MatchRepository.loadAll();
    const s = Player.getPlayerStats(matches);
    setStats(s);

    // сортировка: по числу матчей, затем по винрейту
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

  const addPlayer = async () => {
    if (!newPlayer.name?.trim()) return;
    await PlayersRepository.createNewPlayer(newPlayer, clubId, user?.id);
    setNewPlayer({ name: "", ntrp: "" });
    void loadPlayers();
  };

  const startEdit = (p: Player) => {
    setEditId(p.id);
    setEditData({ name: p.name, ntrp: p.ntrp });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    if (!editId || !editData.name?.trim()) return;
    await PlayersRepository.update(editId, editData);
    cancelEdit();
    void loadPlayers();
  };

  const deletePlayer = async (id: number) => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Удалить игрока? Это действие необратимо.");
      if (!confirmed) return;
    }
    await PlayersRepository.delete(id);
    void loadPlayers();
  };

  // поиск (отложенное значение для плавного ввода)
  const searchText = newPlayer.name ?? "";
  const deferredSearch = useDeferredValue(searchText);

  const filteredPlayers = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    if (!q) return players;
    return players.filter((p) => p.name.toLowerCase().includes(q));
  }, [players, deferredSearch]);

  const className = !user ? "page-container" : "page-container-no-padding";

  return (
    <div className={className}>
      {clubId === null && <h1 className="page-title">Рейтинг игроков</h1>}

      <div className="page-content-container">
        {/* Панель добавления + поиск (имя используется и как строка поиска) */}
        <div className="card players-controls page-toolbar">
          <input
            name="player-name"
            type="text"
            className="input"
            placeholder="Имя (и поиск)"
            value={newPlayer.name || ""}
            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
            suppressHydrationWarning
          />
          <AdminOnly>
            <input
              name="ntrp"
              type="text"
              className="input"
              placeholder="NTRP"
              value={newPlayer.ntrp || ""}
              onChange={(e) => setNewPlayer({ ...newPlayer, ntrp: e.target.value })}
              suppressHydrationWarning
            />
            <PlusIconButton onClick={addPlayer} title="Добавить" />
          </AdminOnly>
        </div>

        {/* Грид карточек игроков */}
        <div className="card-grid-one-column">
          {filteredPlayers.map((p) => {
            const playerStats = stats[p.id] ?? { matches: 0, wins: 0, winrate: 0 };
            return (
              <PlayerCard
                key={p.id}
                player={p}
                stats={playerStats} 
                onDelete={() => deletePlayer(p.id)}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}