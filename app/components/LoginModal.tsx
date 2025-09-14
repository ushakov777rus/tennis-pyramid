"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Добавьте этот импорт

import { useUser } from "@/app/components/UserContext";

import "./LoginModal.css";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
};

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useUser();
  const router = useRouter(); // Добавьте useRouter

  if (!isOpen) return null;

  async function handleLogin() {
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Ошибка входа");
      return;
    }

    setUser(data.user);
    onClose();
    router.push("/admin/clubs"); // Добавьте редирект после успешного логина
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-login" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Вход</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          autoComplete="email"
          inputMode="email"
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
              onSwitchToRegister?.();
            }}
          >
            Зарегистрируйтесь
          </a>
        </p>
      </div>
    </div>
  );
}