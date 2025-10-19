"use client";

import "./Auth.css";

import { useEffect, useState } from "react";
import { useUser } from "@/app/components/UserContext";
import { CustomSelect } from "@/app/components/controls/CustomSelect";
import { UserRole } from "../models/Users";
import { useDictionary } from "@/app/components/LanguageProvider";

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
  const { auth } = useDictionary();
  const { register } = auth;

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

  useEffect(() => {
    if (role !== UserRole.Player) {
      setNTRP("");
    }
  }, [role]);

  if (!isOpen) return null;

  async function handleRegister() {
    setError("");

    if (!fullName.trim()) return setError(register.errors.nameRequired);
    if (!email.trim()) return setError(register.errors.emailRequired);
    if (!isValidEmail(email)) return setError(register.errors.emailInvalid);
    if (!password) return setError(register.errors.passwordRequired);
    if (password.length < 6) return setError(register.errors.passwordLength);
    if (password !== password2) return setError(register.errors.passwordMismatch);
    if (role === UserRole.Player && !ntrp.trim()) return setError(register.errors.ntrpRequired);

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
        setError(data?.error || register.errors.registrationFailed);
        return;
      }

      setUser?.(data.user);
      await refresh();

      // вместо onClose здесь — отдаём роль родителю
      onRegistered?.(role);
    } catch {
      setError(register.errors.network);
    } finally {
      setPending(false);
    }
  }

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div
      className="modal-overlay"
      onClick={!pending ? onClose : undefined}
      aria-hidden="true"
    >
      <div
        className="modal-content modal-content-login modal-content-login--register"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
      >
        <h2 id="register-title" className="modal-title">
          {register.title}
        </h2>

        <div className="register-form">
          <div className="register-form__fields">
            <CustomSelect
              className="input input-100"
              options={[
                { value: UserRole.Player, label: register.roles.player },
                { value: UserRole.TournamentAdmin, label: register.roles.organizer },
              ]}
              value={role}
              onChange={(val) => setRole(val as UserRole)}
              placeholder={register.rolePlaceholder}
              disabled={pending}
              showSearch={false}
              sort={false}
            />
            <input
              type="text"
              placeholder={register.namePlaceholder}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input input-100"
              disabled={pending}
              autoComplete="name"
            />
            <input
              type="email"
              placeholder={register.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-100"
              disabled={pending}
              autoComplete="email"
              inputMode="email"
            />
            <input
              type="tel"
              placeholder={register.phonePlaceholder}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input input-100"
              disabled={pending}
              autoComplete="tel"
              inputMode="tel"
            />

            {role === UserRole.Player && (
              <input
                type="text"
                placeholder={register.ntrpPlaceholder}
                value={ntrp}
                onChange={(e) => setNTRP(e.target.value)}
                className="input input-100"
                disabled={pending}
              />
            )}

            <input
              type="password"
              placeholder={register.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-100"
              disabled={pending}
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder={register.passwordRepeatPlaceholder}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="input input-100"
              disabled={pending}
              autoComplete="new-password"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            onClick={handleRegister}
            className="modal-submit-btn"
            disabled={pending}
          >
            {pending ? register.submitPending : register.submit}
          </button>

          <p className="login-footer">
            {register.hasAccountPrefix}{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (!pending) onSwitchToLogin?.();
              }}
            >
              {register.loginLink}
            </a>
          </p>
        </div>

        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label={register.closeAria}
          disabled={pending}
        >
          ✖
        </button>
      </div>
    </div>
  );
}
