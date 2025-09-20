"use client";

import "./Auth.css";

import { useState } from "react";
import { useUser } from "@/app/components/UserContext";
import { UserRole } from "../models/Users";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
  /** Вызывается при успешном входе, отдаёт роль пользователя */
  onLoggedIn?: (role: UserRole) => void;
};

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
  onLoggedIn,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useUser();

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
    // вместо router.push — отдаём роль родителю
    onLoggedIn?.(data.user.role as UserRole);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-login" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Вход</div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-auth"
          autoComplete="email"
          inputMode="email"
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-auth"
        />

        <button onClick={handleLogin} className="modal-submit-btn">
          Войти
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={onClose} className="modal-close-btn">✖</button>

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