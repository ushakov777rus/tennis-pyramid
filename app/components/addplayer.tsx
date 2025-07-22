"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ffwivirtakoycjmfbdji.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmd2l2aXJ0YWtveWNqbWZiZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjY0NjYsImV4cCI6MjA2ODYwMjQ2Nn0.-COpvUWIacuwXSpOHPi60lhWKwKu7CqUncFKvStw79Y";
const supabase = createClient(supabaseUrl, supabaseKey);

export function AddPlayerForm({ onPlayerAdded }: { onPlayerAdded: () => void }) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(false);

  async function addPlayer() {
    if (!name.trim()) return alert("Введите имя игрока");

    setLoading(true);

    const { error } = await supabase.from("players").insert([
      {
        name,
        level,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Ошибка при добавлении игрока");
    } else {
      onPlayerAdded(); // обновляем пирамиду
    }

    setLoading(false);
  }

  return (
    <div>
      <h3>➕ Добавить игрока</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label>
          Имя игрока:
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите имя"
          />
        </label>

        <label>
          Уровень:
          <input
            type="number"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            min={1}
          />
        </label>

        <button onClick={addPlayer} className="btn btn-primary" disabled={loading}>
          {loading ? "Добавляем..." : "Добавить"}
        </button>
      </div>
    </div>
  );
}