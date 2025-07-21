"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Player = { id: number; name: string };
type Match = {
  id: number;
  winner_id: number;
  loser_id: number;
  date: string;
};

const supabaseUrl = "https://ffwivirtakoycjmfbdji.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmd2l2aXJ0YWtveWNqbWZiZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjY0NjYsImV4cCI6MjA2ODYwMjQ2Nn0.-COpvUWIacuwXSpOHPi60lhWKwKu7CqUncFKvStw79Y";
const supabase = createClient(supabaseUrl, supabaseKey);

export function AllMatchesHistory() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const [playersRes, matchesRes] = await Promise.all([
        supabase.from<Player>("users").select("id, name"),
        supabase.from<Match>("matches").select("*").order("date", { ascending: false }),
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

  if (loading) return <p>Загрузка истории матчей...</p>;

  return (
    <div className="all-matches">
      <h3>История всех матчей</h3>

      {matches.length === 0 ? (
        <p>Матчей пока нет</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Победитель</th>
              <th>Проигравший</th>
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
              const loserName =  getPlayerName(m.loser_id);

              return (
                <tr key={m.id}>
                  <td>{date}</td>
                  <td>✅ {winnerName}</td>
                  <td>❌ {loserName}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}