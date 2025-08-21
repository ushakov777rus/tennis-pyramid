"use client";

import { useEffect, useRef, useState } from "react";
import { TournamentCreateInput } from "@/app/models/Tournament";
import "./AddTournamentModal.css";
import {
  TournamentType,
  TournamentFormat,
  TYPE_OPTIONS,
  FORMAT_OPTIONS,
} from "@/app/models/Tournament";

import { CheckBoxIcon } from "./IconButtons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: TournamentCreateInput) => void;
};

export function AddTournamentModal({ isOpen, onClose, onCreate }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleId = "add-tournament-title";

  const [isPublic, setIsPublic] = useState(false);                      // 👈 новое состояние
  const [name, setName] = useState("");
  const [type, setType] = useState<TournamentType>(TournamentType.Single);
  const [format, setFormat] = useState<TournamentFormat>(TournamentFormat.Pyramid);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
    setIsPublic(false);
    setName("");
    setType(TournamentType.Single);
    setFormat(TournamentFormat.Pyramid);
    setStartDate("");
    setEndDate("");
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) { setError("Введите название турнира"); return; }
    if (startDate && endDate && startDate > endDate) {
      setError("Дата начала не может быть позже даты окончания");
      return;
    }

    onCreate({
      name: trimmed,
      format,
      tournament_type: type,
      start_date: startDate || null,
      end_date: endDate || null,
      is_public: isPublic, // 👈 добавь это поле в тип
      creator_id: 0
    });



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

        <h3 className="modal-title" id={titleId}>Создать турнир</h3>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* 👇 ЧЕКБОКС — первым полем */}
          <div className="checkbox-row">
            <CheckBoxIcon
              isSelected={isPublic}
              onClick={() => setIsPublic((v) => !v)}
              aria-label="Публичный турнир"
            />
            <span>Публичный турнир (виден всем)</span>
          </div>

          <input
            type="text"
            placeholder="Название турнира"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            autoFocus
          />

          <div className="modal-grid-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as unknown as TournamentType)}
              className="input"
            >
              {(TYPE_OPTIONS ?? [
                { value: TournamentType.Single, label: "Одиночный" },
                { value: TournamentType.Double, label: "Парный" },
              ]).map((o) => (
                <option key={o.value} value={o.value as any}>
                  {o.label}
                </option>
              ))}
            </select>

            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as unknown as TournamentFormat)}
              className="input"
            >
              {FORMAT_OPTIONS.slice(1).map((o) => (
                <option key={o.value} value={o.value as any}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-grid-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input"
            />
          </div>

          {error && <div className="modal-error" role="alert">{error}</div>}

          <div className="modal-actions">
            <button type="submit" className="modal-submit-btn">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
}