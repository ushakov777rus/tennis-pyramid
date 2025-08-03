"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
        const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
        });

        if (!res.ok) {
        let message = "Ошибка регистрации";
        try {
            const text = await res.text();
            if (text) {
            const data = JSON.parse(text);
            message = data.error || message;
            }
        } catch {}
        setError(message);
        return;
        }

        // всё ок — редирект на login
        router.push("/login");
    } catch (err) {
        console.error("Ошибка:", err);
        setError("Ошибка сети");
    }
}

  return (
    <main style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h1>Регистрация</h1>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "10px" }}>
          <label>Имя:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Зарегистрироваться</button>
      </form>
    </main>
  );
}