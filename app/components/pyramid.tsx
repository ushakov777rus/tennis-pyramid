"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Player = {
  id: number;
  name: string;
  level: number;
};

type Match = {
  id: number;
  winner_id: number;
  loser_id: number;
  date: string;
};

const supabaseUrl = "https://ffwivirtakoycjmfbdji.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmd2l2aXJ0YWtveWNqbWZiZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjY0NjYsImV4cCI6MjA2ODYwMjQ2Nn0.-COpvUWIacuwXSpOHPi60lhWKwKu7CqUncFKvStw79Y";
const supabase = createClient(supabaseUrl, supabaseKey);

export function PyramidWithHistory({refreshKey}:{refreshKey:number}) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    async function fetchPlayers() {
      setLoading(true);
      const { data, error } = await supabase
        .from<Player>("players")
        .select("id, name, level")
        .order("level", { ascending: true });

      if (error) console.error(error);
      setPlayers(data ?? []);
      setLoading(false);
    }
    fetchPlayers();
  }, [refreshKey]);

  async function loadMatches(playerId: number) {
    setLoadingMatches(true);

    const { data, error } = await supabase
      .from<Match>("matches")
      .select("*")
      .or(`winner_id.eq.${playerId},loser_id.eq.${playerId}`)
      .order("date", { ascending: false });

    if (error) console.error(error);
    setMatches(data ?? []);
    setLoadingMatches(false);
  }

  const grouped = new Map<number, Player[]>();
  players.forEach((p) => {
    if (!grouped.has(p.level)) grouped.set(p.level, []);
    grouped.get(p.level)!.push(p);
  });
  const sortedLevels = Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);

  if (loading) return <div>Загрузка игроков...</div>;

  return (
    <div>
      <div className="pyramid">
        {sortedLevels.map(([level, levelPlayers]) => (
          <div key={level} className="level">
            
            <div className="level-label">{level}</div>

            <div className="players-row">
            {levelPlayers.map((player) => (
              <div
                key={player.id}
                className="player"
                style={{
                  background: `hsl(${(player.level * 35) % 360}, 50%, 75%)`,
                }}
              >
                {player.name}
                <br />
                <button
                  className="history-btn"
                  onClick={() => {
                    setSelectedPlayer(player);
                    loadMatches(player.id);
                  }}
                >
                  История матчей
                </button>
              </div>
            ))}
          </div>
          </div>
        ))}
      </div>

      {/* Модалка с историей */}
      {selectedPlayer && (
        <div className="modal">
          <div className="modal-content">
            <h3>История матчей: {selectedPlayer.name}</h3>
            {loadingMatches ? (
              <p>Загрузка...</p>
            ) : matches.length === 0 ? (
              <p>Нет матчей</p>
            ) : (
              <ul>
                {matches.map((m) => {
                  const opponentId =
                    m.winner_id === selectedPlayer.id
                      ? m.loser_id
                      : m.winner_id;
                  const opponent = players.find((p) => p.id === opponentId);
                  const isWinner = m.winner_id === selectedPlayer.id;

                // преобразуем дату
                const dateObj = new Date(m.date);
                const formattedDate = dateObj.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                });


                  return (
                    <li key={m.id}>
                      {formattedDate}: {opponent?.name ?? "??"} –{" "}
                      {isWinner ? "✅ Победа" : "❌ Поражение"}
                    </li>
                  );
                })}
              </ul>
            )}
            <button onClick={() => setSelectedPlayer(null)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}
