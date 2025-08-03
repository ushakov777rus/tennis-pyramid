"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Ошибка входа");
      return;
    }

    console.log("Вы залогинены как: ",data.role);

    // ✅ Проверяем роль и редиректим
    if (data.role === "site_admin") {
      router.push("/");
    } else {
      router.push("/"); // для игроков и админов турниров
    }
  }

  return (
    <div style={{ maxWidth: 300, margin: "40px auto" }}>
      <h1>Вход</h1>

      <input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
      />

      <button onClick={handleLogin} style={{ width: "100%" }}>
        Войти
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}