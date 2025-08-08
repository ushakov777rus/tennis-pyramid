"use client";

import { useState } from "react";
import { useUser } from "@/app/components/UserContext";
import "./RegisterModal.css";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;   // ✅ есть в типе
  onRegistered?: () => void;      // ✅ добавил, раз ты его вызываешь
};

export function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,              // ✅ деструктурируем, чтобы использовать ниже
  onRegistered,
}: RegisterModalProps) {
  const { setUser } = useUser();

  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (!isOpen) return null;

  async function handleRegister() {
    setError("");

    if (!fullName.trim()) return setError("Укажите имя и фамилию");
    if (!password) return setError("Введите пароль");
    if (password.length < 6) return setError("Пароль должен быть не короче 6 символов");
    if (password !== password2) return setError("Пароли не совпадают");

    try {
      setPending(true);
      const res = await fetch("/api/register-player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          nickname: nickname.trim() || null,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Ошибка регистрации");
        return;
      }

      setUser?.(data.user);
      onRegistered?.();
      onClose();
    } catch {
      setError("Сеть недоступна или сервер не отвечает");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="login-modal-overlay" onClick={!pending ? onClose : undefined}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="login-title">Регистрация игрока</h2>

        <input
          type="text"
          placeholder="Имя и фамилия"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="login-input"
        />
        <input
          type="text"
          placeholder="Никнейм (опционально)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Повтор пароля"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          className="login-input"
        />

        {error && <p style={{ color: "tomato", marginTop: 6 }}>{error}</p>}

        <button onClick={handleRegister} className="login-submit-btn" disabled={pending}>
          {pending ? "Регистрируем…" : "Зарегистрироваться"}
        </button>

        <button onClick={onClose} className="login-close-btn" aria-label="Закрыть" disabled={pending}>
          ✖
        </button>

        <p className="login-footer">
          Уже есть аккаунт?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!pending) onSwitchToLogin?.();   {/* ✅ теперь доступен */}
            }}
          >
            Войдите
          </a>
        </p>
      </div>
    </div>
  );
}