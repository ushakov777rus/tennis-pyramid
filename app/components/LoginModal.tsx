"use client";

import "./Auth.css";

import { useState } from "react";
import { useUser } from "@/app/components/UserContext";
import { UserRole } from "../models/Users";
import { useDictionary } from "@/app/components/LanguageProvider";

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
  const { auth, common } = useDictionary();
  const { login } = auth;
  const loginErrors = login.errors as Record<string, string>;

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
      const code = data?.errorCode;
      const key = typeof code === "string" ? code.split(".").pop() ?? code : undefined;
      setError((key && loginErrors[key]) || login.errorFallback);
      return;
    }

    setUser(data.user);
    // вместо router.push — отдаём роль родителю
    onLoggedIn?.(data.user.role as UserRole);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-login modal-content-login--register" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{login.title}</h3>

        <div className="login-form">
          <div className="login-form__fields">
            <input
              type="email"
              placeholder={login.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-100"
              autoComplete="email"
              inputMode="email"
            />

            <input
              type="password"
              placeholder={login.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-100"
            />
          </div>

          <button onClick={handleLogin} className="modal-submit-btn">
            {login.submit}
          </button>

          {error && <p className="form-error">{error}</p>}

          <p className="login-footer">
            {login.noAccountPrefix}{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToRegister?.();
              }}
            >
              {login.registerLink}
            </a>
          </p>
        </div>

        <button onClick={onClose} className="modal-close-btn" aria-label={common.close}>
          ✖
        </button>
      </div>
    </div>
  );
}
