"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

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