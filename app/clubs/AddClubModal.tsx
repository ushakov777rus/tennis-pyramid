"use client";


import { useEffect, useRef, useState } from "react";
import { ClubCreateInput } from "../repositories/ClubRepository";


type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: ClubCreateInput) => void;
};

export function AddClubModal({ isOpen, onClose, onCreate }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleId = "add-tournament-title";

  // базовые поля
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const resetForm = () => {
    setName("");
    setCity("");
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) { setError("Введите название клуба"); return; }

    const payload: ClubCreateInput = {
      name: trimmed,
      city: city
    };

    onCreate(payload);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} aria-hidden={false}>
      <div
        className="modal-content"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Закрыть модальное окно"
        >
          ✖
        </button>

        <h3 className="modal-title" id={titleId}>Создать клуб</h3>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <input
            type="text"
            placeholder="Название клуба"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            autoFocus
          />

          <input
            type="text"
            placeholder="Город"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input"
          />

          {error && <div className="modal-error" role="alert">{error}</div>}

          <div className="modal-actions">
            <button type="submit" className="modal-submit-btn">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
}