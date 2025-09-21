"use client";

import { useEffect, useRef, useState } from "react";
import { TournamentCreateInput, TournamentType, TournamentFormat } from "@/app/models/Tournament";
import "./AddTournamentModal.css";
import { TYPE_OPTIONS, FORMAT_OPTIONS } from "@/app/models/Tournament";
import { CustomSelect } from "./controls/CustomSelect";
import { Club } from "../models/Club";

type Props = {
  isOpen: boolean;
  club: Club | null;
  onClose: () => void;
  onCreate: (payload: TournamentCreateInput & { settings?: any }) => void;
};

export function AddTournamentModal({ isOpen, club, onClose, onCreate }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleId = "add-tournament-title";

  // базовые поля
  const [name, setName] = useState("");
  const [type, setType] = useState<TournamentType>(TournamentType.Single);
  const [format, setFormat] = useState<TournamentFormat>(TournamentFormat.Pyramid);
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [error, setError] = useState<string | null>(null);

  // новое: диапазон NTRP
  const [minNTRP, setMinNTRP] = useState<number | null>(null);
  const [maxNTRP, setMaxNTRP] = useState<number | null>(null);

  // доп. опции
  const [advOpen, setAdvOpen] = useState(false);
  const [pyramidMaxLevel, setPyramidMaxLevel] = useState<number>(15);
  const [groupsPlayoffGroupsCount, setGroupsPlayoffGroupsCount] = useState<number>(2);
  

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
    setType(TournamentType.Single);
    setFormat(TournamentFormat.Pyramid);
    setStartDate(today);
    setEndDate(today);
    setPyramidMaxLevel(15);
    setGroupsPlayoffGroupsCount(2);
    setAdvOpen(false);
    setError(null);
    setMinNTRP(null);
    setMaxNTRP(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) { setError("Введите название турнира"); return; }
    if (startDate && endDate && startDate > endDate) {
      setError("Дата начала не может быть позже даты окончания");
      return;
    }

    // Валидация для пирамиды
    if (format === TournamentFormat.Pyramid) {
      if (!Number.isFinite(pyramidMaxLevel) || pyramidMaxLevel < 3 || pyramidMaxLevel > 50) {
        setError("Укажите корректное число уровней пирамиды (3–50).");
        return;
      }
    }

    if (minNTRP != null && maxNTRP != null && minNTRP > maxNTRP) {
      setError("Минимальный NTRP не может быть больше максимального");
      return;
    }

    const payload: TournamentCreateInput & { settings?: any } = {
      name: trimmed,
      format,
      tournament_type: type,
      start_date: startDate || null,
      end_date: endDate || null,
      is_public: false,
      creator_id: 0,
      club: club
    };

    payload.settings = {
      ...payload.settings,
      restrictions: {
        minNTRP,
        maxNTRP,
      },
    };

    // Добавляем форматные настройки
    if (format === TournamentFormat.Pyramid) {
      payload.settings.pyramid = { maxLevel: pyramidMaxLevel };
    }
    if (format === TournamentFormat.GroupsPlayoff) {
      payload.settings.groupsplayoff = { groupsCount: groupsPlayoffGroupsCount };
    }

    // Добавляем настройки только для актуального формата
    if (format === TournamentFormat.Pyramid) {
      payload.settings = {
        pyramid: {
          maxLevel: pyramidMaxLevel,
        },
      };
    }

    if (format === TournamentFormat.GroupsPlayoff) {
      payload.settings = {
        groupsplayoff: {
          groupsCount: groupsPlayoffGroupsCount,
        },
      };
    }

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

        <h3 className="modal-title" id={titleId}>Создать турнир</h3>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* ЧЕКБОКС — первым полем */}
          <input
            type="text"
            placeholder="Название турнира"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            autoFocus
          />

          <div className="modal-grid-2">
            <CustomSelect
              className="input"
              options={TYPE_OPTIONS.filter(o => o.value !== "")}
              value={type}
              onChange={(val) => setType(val as TournamentType)}
              disabled={false}
              showSearch={false}
              sort={false}
            />

            <CustomSelect
              className="input"
              options={FORMAT_OPTIONS.filter(o => o.value !== "")}
              value={format}
              onChange={(val) => setFormat(val as TournamentFormat)}
              disabled={false}
              showSearch={false}
              sort={false}
            />
          </div>

          <div className="modal-grid-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input input-date-2"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input input-date-2"
            />
          </div>

          {/* === Доп. опции (раскрывающийся блок) === */}
          <button
            type="button"
            className="adv-toggle input"
            aria-expanded={advOpen}
            aria-controls="adv-panel"
            onClick={() => setAdvOpen((v) => !v)}
          >
            {advOpen ? "Скрыть доп. опции" : "Показать доп. опции"}
          </button>

          <div
            id="adv-panel"
            className={`adv-panel ${advOpen ? "open" : ""}`}
            hidden={!advOpen}
          >
            {/* Общие */}
            <div className="modal-grid-2">
              <input
                type="number"
                step={0.25}
                min={0}
                max={10}
                value={minNTRP ?? ""}
                onChange={(e) => setMinNTRP(e.target.value ? Number(e.target.value) : null)}
                className="input"
                placeholder="Мин. NTRP"
              />
              <input
                type="number"
                step={0.25}
                min={0}
                max={10}
                value={maxNTRP ?? ""}
                onChange={(e) => setMaxNTRP(e.target.value ? Number(e.target.value) : null)}
                className="input"
                placeholder="Макс. NTRP"
              />
            </div>

            {/* Опция для формата Пирамида */}
            {format === TournamentFormat.Pyramid && (
              <div className="adv-row">
                <label className="adv-label" htmlFor="pyr-levels">
                  Макс. уровней пирамиды
                </label>
                <input
                  id="pyr-levels"
                  type="number"
                  min={3}
                  max={50}
                  step={1}
                  className="input"
                  value={pyramidMaxLevel}
                  onChange={(e) => setPyramidMaxLevel(Number(e.target.value) || 0)}
                />
                <div className="adv-help">Рекомендуем 10–20, по умолчанию 15</div>
              </div>
            )}

            {/* Группы плюс плейофф */}
            {format === TournamentFormat.GroupsPlayoff && (
              <div className="adv-row">
                <label className="adv-label" htmlFor="pyr-levels">
                  Количество групп
                </label>
                <input
                  id="groups-count"
                  type="number"
                  min={1}
                  max={50}
                  step={1}
                  className="input"
                  value={groupsPlayoffGroupsCount}
                  onChange={(e) => setGroupsPlayoffGroupsCount(Number(e.target.value) || 0)}
                />
                <div className="adv-help">Рекомендуем 2–4, по умолчанию 2</div>
              </div>
            )}

            {/* Пример: сюда легко добавить другие настройки под форматы */}
            {/* {format === TournamentFormat.RoundRobin && (...)} */}
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
