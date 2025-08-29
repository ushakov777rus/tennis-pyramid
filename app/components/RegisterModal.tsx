"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/components/UserContext";
import { CustomSelect } from "@/app/components/CustomSelect";
import "./RegisterModal.css";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
  onRegistered?: () => void;
  /** Роль, с которой модалка откроется по умолчанию */
  initialRole?: "player" | "tournament_admin";
};

export function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  onRegistered,
  initialRole: defaultRole = "player",
}: RegisterModalProps) {
  const { setUser } = useUser();

  const [role, setRole] = useState<"player" | "tournament_admin">(defaultRole);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [ntrp, setNTRP] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  // При каждом открытии сбрасываем форму и устанавливаем роль
  useEffect(() => {
    if (isOpen) {
      setRole(defaultRole);
      setFullName("");
      setPhone("");
      setNTRP("");
      setNickname("");
      setPassword("");
      setPassword2("");
      setError("");
      setPending(false);
    }
  }, [isOpen, defaultRole]);

  // Закрытие по Esc
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, pending]);

  if (!isOpen) return null;

  async function handleRegister() {
    setError("");

    if (!fullName.trim()) return setError("Укажите имя и фамилию");
    if (!nickname.trim()) return setError("Укажите никнейм для входа");
    if (!password) return setError("Введите пароль");
    if (password !== password2) return setError("Пароли не совпадают");
    // NTRP требуем только у игрока
    if (role === "player" && !ntrp.trim()) {
      return setError("Укажите NTRP или 0.0, если не знаете");
    }

    try {
      setPending(true);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          ntrp: role === "player" ? ntrp.trim() : null, // у организатора не отправляем
          nickname: nickname.trim(),
          password,
          role,
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
    <div
      className="modal-overlay"
      onClick={!pending ? onClose : undefined}
      aria-hidden="true"
    >
      <div
        className="modal-content modal-content-login"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
      >
        <h2 id="register-title" className="modal-title">
          Регистрация пользователя
        </h2>

        {/* выбор роли */}
        <CustomSelect
          className="input"
          options={[
            { value: "player", label: "Игрок" },
            { value: "tournament_admin", label: "Организатор" },
          ]}
          value={role}
          onChange={(val) => setRole(val as "player" | "tournament_admin")}
          placeholder="Выберите роль"
          disabled={pending}
          showSearch={false}
          sort={false}
        />

        <input
          type="text"
          placeholder="Фамилия и Имя"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="input"
          disabled={pending}
          autoComplete="name"
        />

        <input
          type="tel"
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input"
          disabled={pending}
          autoComplete="tel"
          inputMode="tel"
        />

        {/* NTRP показываем только для роли 'Игрок' */}
        {role === "player" && (
          <input
            type="text"
            placeholder="NTRP (например 3.5)"
            value={ntrp}
            onChange={(e) => setNTRP(e.target.value)}
            className="input"
            disabled={pending}
          />
        )}

        <input
          type="text"
          placeholder="Никнейм (для входа)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="input"
          disabled={pending}
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          disabled={pending}
          autoComplete="new-password"
        />

        <input
          type="password"
          placeholder="Повтор пароля"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          className="input"
          disabled={pending}
          autoComplete="new-password"
        />

        {error && <p className="form-error">{error}</p>}

        <button
          onClick={handleRegister}
          className="modal-submit-btn"
          disabled={pending}
        >
          {pending ? "Регистрируем…" : "Зарегистрироваться"}
        </button>

        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Закрыть"
          disabled={pending}
        >
          ✖
        </button>

        <p className="login-footer">
          Уже есть аккаунт?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!pending) onSwitchToLogin?.();
            }}
          >
            Войдите
          </a>
        </p>
      </div>
    </div>
  );
}