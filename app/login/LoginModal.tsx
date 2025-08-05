"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/app/components/UserContext";

import "./LoginModal.css";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useUser();

  if (!isOpen) return null;

  async function handleLogin() {
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    const data = await res.json();
    console.log("Ответ от /api/login:", data);

    if (!res.ok) {
      setError(data.error || "Ошибка входа");
      return;
    }

    console.log("Вы залогинены как: ", data.role);

    // ✅ редирект по роли
    router.push("/");

    setUser(data.user); // ✅ обновляем глобально
    console.log("После setUser, user =", data.user)
    onClose(); // закрыть модалку
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Вход</h2>

        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="login-input"
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <button onClick={handleLogin} className="login-btn">
          Войти
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={onClose} className="close-btn">
          ✖
        </button>
      </div>
    </div>
  );
}