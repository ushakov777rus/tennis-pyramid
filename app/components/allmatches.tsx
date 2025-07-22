"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Player = { id: number; name: string };
type Match = {
  id: number;
  winner_id: number;
  loser_id: number;
  date: string;
  score: string[] | null; // массив сетов
};

export function AllMatchesHistory() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const [playersRes, matchesRes] = await Promise.all([
        supabase.from("players").select("id, name"),
        supabase
          .from("matches")
          .select("*")
          .order("date", { ascending: false }),
      ]);

      if (!playersRes.error && playersRes.data) setPlayers(playersRes.data);
      if (!matchesRes.error && matchesRes.data) setMatches(matchesRes.data);

      setLoading(false);
    }

    fetchData();
  }, []);

  function getPlayerName(id: number) {
    return players.find((p) => p.id === id)?.name ?? "??";
  }

  type SetScore = { winner: string; loser: string };

  function parseScore(score: unknown): SetScore[] | null {
    if (!score) return null;

    // Если уже массив
    if (Array.isArray(score)) return score as SetScore[];

    // Если Supabase вернул строку JSON
    if (typeof score === "string") {
      try {
        return JSON.parse(score) as SetScore[];
      } catch {
        return null;
      }
    }

    return null;
  }

  function formatScore(score: unknown): string {
    const parsed = parseScore(score);
    if (!parsed || parsed.length === 0) return "-";
    return parsed.map((s) => `${s.winner}–${s.loser}`).join(", ");
  }

  if (loading) return <p>Загрузка истории матчей...</p>;

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">История всех матчей</h3>

      {matches.length === 0 ? (
        <p className="text-gray-500">Матчей пока нет</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Дата</th>
                <th className="p-2 border">Победитель</th>
                <th className="p-2 border">Проигравший</th>
                <th className="p-2 border">Счёт</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m) => {
                const date = new Date(m.date).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });

                const winnerName = getPlayerName(m.winner_id);
                const loserName = getPlayerName(m.loser_id);
                const matchScore = formatScore(m.score);

                return (
                  <tr key={m.id} className="text-center hover:bg-gray-50">
                    <td className="p-2 border">{date}</td>
                    <td className="p-2 border text-green-600 font-semibold">
                      ✅ {winnerName}
                    </td>
                    <td className="p-2 border text-red-500">
                      ❌ {loserName}
                    </td>
                    <td className="p-2 border font-medium">
                      {matchScore}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}