"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/components/UserContext";
import { CustomSelect } from "@/app/components/controls/CustomSelect";
import "./RegisterModal.css";
import { UserRole } from "../models/Users";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
  /** Успешная регистрация — отдаём роль наружу */
  onRegistered?: (role: UserRole) => void;
  initialRole?: UserRole.Player | UserRole.TournamentAdmin;
};

export function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  onRegistered,
  initialRole: defaultRole = UserRole.Player,
}: RegisterModalProps) {
  const { setUser, refresh } = useUser();

  const [role, setRole] = useState<UserRole>(defaultRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ntrp, setNTRP] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRole(defaultRole);
      setFullName("");
      setEmail("");
      setPhone("");
      setNTRP("");
      setPassword("");
      setPassword2("");
      setError("");
      setPending(false);
    }
  }, [isOpen, defaultRole]);

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
    if (!email.trim()) return setError("Укажите email");
    if (!isValidEmail(email)) return setError("Укажите корректный email");
    if (!password) return setError("Введите пароль");
    if (password.length < 6) return setError("Пароль должен содержать не менее 6 символов");
    if (password !== password2) return setError("Пароли не совпадают");
    if (role === "player" && !ntrp.trim()) return setError("Укажите NTRP или 0.0, если не знаете");

    try {
      setPending(true);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          ntrp: role === UserRole.Player ? ntrp.trim() : null,
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
      await refresh();

      // вместо onClose здесь — отдаём роль родителю
      onRegistered?.(role);
    } catch {
      setError("Сеть недоступна или сервер не отвечает");
    } finally {
      setPending(false);
    }
  }

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="modal-overlay" onClick={!pending ? onClose : undefined} aria-hidden="true">
      <div className="modal-content modal-content-login" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="register-title">
        <h2 id="register-title" className="modal-title">Регистрация пользователя</h2>

        <CustomSelect
          className="input"
          options={[
            { value: "player", label: "Игрок" },
            { value: "tournament_admin", label: "Организатор" },
          ]}
          value={role}
          onChange={(val) => setRole(val as UserRole)}
          placeholder="Выберите роль"
          disabled={pending}
          showSearch={false}
          sort={false}
        />
        <input type="text" placeholder="Фамилия и Имя" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" disabled={pending} autoComplete="name" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" disabled={pending} autoComplete="email" inputMode="email" />
        <input type="tel" placeholder="Телефон (необязательно)" value={phone} onChange={(e) => setPhone(e.target.value)} className="input" disabled={pending} autoComplete="tel" inputMode="tel" />

        {role === "player" && (
          <input type="text" placeholder="NTRP (например 3.5)" value={ntrp} onChange={(e) => setNTRP(e.target.value)} className="input" disabled={pending} />
        )}

        <input type="password" placeholder="Пароль (минимум 6 символов)" value={password} onChange={(e) => setPassword(e.target.value)} className="input" disabled={pending} autoComplete="new-password" />
        <input type="password" placeholder="Повтор пароля" value={password2} onChange={(e) => setPassword2(e.target.value)} className="input" disabled={pending} autoComplete="new-password" />

        {error && <p className="form-error">{error}</p>}

        <button onClick={handleRegister} className="modal-submit-btn" disabled={pending}>
          {pending ? "Регистрируем…" : "Зарегистрироваться"}
        </button>

        <button onClick={onClose} className="modal-close-btn" aria-label="Закрыть" disabled={pending}>✖</button>

        <p className="login-footer">
          Уже есть аккаунт?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); if (!pending) onSwitchToLogin?.(); }}>
            Войдите
          </a>
        </p>
      </div>
    </div>
  );
}