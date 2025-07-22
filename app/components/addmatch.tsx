"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Player = {
  id: number;
  name: string;
};

const supabaseUrl = "https://ffwivirtakoycjmfbdji.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmd2l2aXJ0YWtveWNqbWZiZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjY0NjYsImV4cCI6MjA2ODYwMjQ2Nn0.-COpvUWIacuwXSpOHPi60lhWKwKu7CqUncFKvStw79Y";
const supabase = createClient(supabaseUrl, supabaseKey);

export function AddMatchForm({ onMatchAdded }: { onMatchAdded: () => void }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [loserId, setLoserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Загружаем список игроков
  useEffect(() => {
    async function fetchPlayers() {
      const { data, error } = await supabase
        .from("players")
        .select("id, name")
        .order("name", { ascending: true });

      
      setPlayers(data ?? []);
      setLoading(false);
    }
    fetchPlayers();
  }, []);


  async function updatePlayerLevel(playerId: number, delta: number) {
    // 1. Получаем текущий уровень
    const { data: playerData, error: fetchError } = await supabase
      .from("players")
      .select("level")
      .eq("id", playerId)
      .single();

    if (fetchError || !playerData) {
      console.error("Ошибка загрузки игрока:", fetchError);
      return;
    }

    const newLevel = playerData.level + delta;

    // 2. Обновляем уровень
    const { error: updateError } = await supabase
      .from("players")
      .update({ level: newLevel })
      .eq("id", playerId);

    if (updateError) {
      console.error("Ошибка обновления уровня:", updateError);
    } else {
      console.log(`✅ Игрок ${playerId} теперь уровень ${newLevel}`);
    }
  }

  // Сохранение матча
  async function saveMatch() {
    if (!winnerId || !loserId) {
      setMessage("Выберите обоих игроков!");
      return;
    }
    if (winnerId === loserId) {
      setMessage("Победитель и проигравший не могут быть одним и тем же!");
      return;
    }

    setSaving(true);

    // Дата сегодняшнего дня
    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("matches").insert([
      {
        winner_id: winnerId,
        loser_id: loserId,
        date: today,
      },
    ]);

    if (error) {
      console.error(error);
      setMessage("Ошибка при сохранении матча");
    } else {
      setMessage("✅ Матч успешно добавлен!");
      setWinnerId(null);
      setLoserId(null);
    }

    setSaving(false);


    // 2. Обновляем уровни игроков:
    await updatePlayerLevel(winnerId, -1);
    await updatePlayerLevel(loserId, +1);

    setLoading(false);
    onMatchAdded();
  }

  if (loading) return <p>Загрузка игроков...</p>;

  return (
    <div className="add-match-form">
      <h3>Добавить матч</h3>

      <label>Победитель:</label>
      <select
        value={winnerId ?? ""}
        onChange={(e) => setWinnerId(Number(e.target.value))}
      >
        <option value="">-- выбери игрока --</option>
        {players.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <label>Проигравший:</label>
      <select
        value={loserId ?? ""}
        onChange={(e) => setLoserId(Number(e.target.value))}
      >
        <option value="">-- выбери игрока --</option>
        {players.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <button onClick={saveMatch} disabled={saving}>
        {saving ? "Сохраняем..." : "Сохранить матч"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}