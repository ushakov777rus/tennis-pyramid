"use client";

import { useEffect, useState } from "react";
import { MatchRepository } from "./repositories/MatchRepository";
import { Match } from "./models/Match";
import "./MatchListView.css";

export function MatchListView() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await MatchRepository.loadAll();
      setMatches(list);
      setLoading(false);
    }
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm(`Удалить матч #${id}?`)) return;
    await MatchRepository.deleteMatch(matches.filter((m) => m.id !== id)[0]);
    setMatches(matches.filter((m) => m.id !== id));
  };

  if (loading) return <p>Загрузка матчей...</p>;
  if (!matches.length) return <p>Пока нет матчей</p>;

  return (
    <div className="match-list">
      <h2>Список матчей</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Тип</th>
            <th>Дата</th>
            <th>Счёт</th>
            <th>Победитель</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((m) => {
            const setsWon = m.scores.reduce<[number, number]>(
              ([w1, w2], [s1, s2]) => [
                w1 + (s1 > s2 ? 1 : 0),
                w2 + (s2 > s1 ? 1 : 0),
              ],
              [0, 0]
            );

            let winner = "";
            if (setsWon[0] > setsWon[1]) winner = "Команда 1";
            if (setsWon[1] > setsWon[0]) winner = "Команда 2";

            return (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.type === "single" ? "1×1" : "2×2"}</td>
                <td>{m.date.toLocaleString()}</td>
                <td>
                  {setsWon[0]}–{setsWon[1]}
                </td>
                <td>{winner || "ничья"}</td>
                <td>
                  <a href={`/match/${m.id}`} className="btn btn-view">
                    Смотреть
                  </a>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="btn btn-delete"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}