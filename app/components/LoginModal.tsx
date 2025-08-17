"use client";

import { useState } from "react";

import { useUser } from "@/app/components/UserContext";

import "./LoginModal.css";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void; // есть в типе
};

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,       // <-- деструктурируем
}: LoginModalProps) {
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

    if (!res.ok) {
      setError(data.error || "Ошибка входа");
      return;
    }

    setUser(data.user);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Вход</h2>

        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />

        <button onClick={handleLogin} className="modal-submit-btn">
          Войти
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={onClose} className="modal-close-btn">
          ✖
        </button>

        <p className="login-footer">
          Нет аккаунта?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToRegister?.(); // теперь доступен
            }}
          >
            Зарегистрируйтесь
          </a>
        </p>
      </div>
    </div>
  );
}