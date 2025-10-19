"use client";


import { useEffect, useRef, useState } from "react";
import { ClubCreateInput } from "@/app/models/Club";
import { useUser } from "../components/UserContext";
import { useDictionary } from "../components/LanguageProvider";


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
  const { user } = useUser();
  const { clubs: clubsText } = useDictionary();

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
    if (!trimmed) { setError(clubsText.addModal.errors.nameRequired); return; }
    if (!user) { setError(clubsText.addModal.errors.loginRequired); return; }

    const payload: ClubCreateInput = {
      name: trimmed,
      city: city,
      director_id: user?.id
    };

    onCreate(payload);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} aria-hidden={false}>
      <div
        className="modal-content modal-base-width"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label={clubsText.addModal.closeAria}
        >
          ✖
        </button>

        <h3 className="modal-title" id={titleId}>{clubsText.addModal.title}</h3>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <input
            type="text"
            placeholder={clubsText.addModal.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-100"
            autoFocus
          />

          <input
            type="text"
            placeholder={clubsText.addModal.cityPlaceholder}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input input-100"
          />

          {error && <div className="modal-error" role="alert">{error}</div>}

          <div className="modal-actions">
            <button type="submit" className="modal-submit-btn">{clubsText.addModal.saveButton}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
