"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  FORMAT_OPTIONS,
  TournamentFormat,
  TournamentType,
  TYPE_OPTIONS,
} from "@/app/models/Tournament";
import "./styles.css";

type FormState = {
  name: string;
  format: TournamentFormat;
  type: TournamentType;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  pyramidMaxLevel: number;
  groupsPlayoffGroupsCount: number;
};

type SubmitPayload = FormState & {
  initData: string;
};

type TelegramInit = {
  tg: TelegramWebApp | null;
  initData: string;
  colorScheme: "light" | "dark" | "unknown";
};

type Props = {
  onSubmit: (
    payload: SubmitPayload
  ) => Promise<{ id: number; slug: string; url?: string } | void>;
  pending: boolean;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

type TelegramWebApp = {
  initData: string;
  initDataUnsafe: Record<string, unknown>;
  ready: () => void;
  expand?: () => void;
  colorScheme?: "light" | "dark";
  themeParams?: Record<string, string>;
  close: () => void;
  sendData?: (data: string) => void;
  showAlert?: (message: string) => void;
  showPopup?: (params: { message: string; title?: string }) => void;
  HapticFeedback?: {
    notificationOccurred?: (type: "error" | "success" | "warning") => void;
  };
  MainButton: {
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick?: (cb: () => void) => void;
    enable?: () => void;
    disable?: () => void;
  };
  BackButton?: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick?: (cb: () => void) => void;
  };
};

const formatOptions = FORMAT_OPTIONS.filter((o) => o.value);
const typeOptions = TYPE_OPTIONS.filter((o) => o.value);

function createInitialState(): FormState {
  const today = new Date().toISOString().slice(0, 10);
  return {
    name: "",
    format: TournamentFormat.RoundRobin,
    type: TournamentType.Single,
    startDate: today,
    endDate: today,
    isPublic: true,
    pyramidMaxLevel: 15,
    groupsPlayoffGroupsCount: 2,
  };
}

function validateForm(state: FormState) {
  if (!state.name.trim()) return false;
  if (state.startDate && state.endDate && state.startDate > state.endDate) return false;
  if (state.format === TournamentFormat.Pyramid) {
    if (state.pyramidMaxLevel < 3 || state.pyramidMaxLevel > 50) return false;
  }
  if (state.format === TournamentFormat.GroupsPlayoff) {
    if (state.groupsPlayoffGroupsCount < 2 || state.groupsPlayoffGroupsCount > 12) return false;
  }
  return true;
}

export function useTelegramInit(): TelegramInit {
  const [value, setValue] = useState<TelegramInit>({
    tg: null,
    initData: "",
    colorScheme: "unknown",
  });

  useEffect(() => {
    const webApp = window.Telegram?.WebApp ?? null;
    if (!webApp) return;

    webApp.ready();
    webApp.expand?.();

    const initData = webApp.initData ?? "";
    const colorScheme = webApp.colorScheme ?? "unknown";

    console.log("[tg:create] initData", {
      hasInitData: Boolean(initData),
      snippet: initData?.slice?.(0, 180) ?? "",
    });

    try {
      webApp.BackButton?.show?.();
      const handleBack = () => webApp.close();
      webApp.BackButton?.onClick(handleBack);
      return () => webApp.BackButton?.offClick?.(handleBack);
    } finally {
      setValue({ tg: webApp, initData, colorScheme });
    }
  }, []);

  return value;
}

export function TelegramTournamentForm({ onSubmit, pending }: Props) {
  const [form, setForm] = useState<FormState>(createInitialState);
  const { tg, initData, colorScheme } = useTelegramInit();
  const isValid = useMemo(() => validateForm(form), [form]);
 const [status, setStatus] = useState<string>("");
 const submittingRef = useRef(false);
 const isInTelegram = Boolean(tg);

  useEffect(() => {
    setStatus("");
  }, [form.name, form.format, form.type, form.startDate, form.endDate, form.isPublic, form.pyramidMaxLevel, form.groupsPlayoffGroupsCount]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = useCallback(async () => {
    if (!isValid || submittingRef.current) return;
    submittingRef.current = true;
    try {
      const data = await onSubmit({ ...form, initData });
      if (data && typeof data === "object" && "url" in data && data.url) {
        setStatus(`Турнир создан: ${data.url}`);
      } else if (data && typeof data === "object" && "slug" in data) {
        setStatus(`Турнир создан: ${data.slug}`);
      } else {
        setStatus("Турнир создан");
      }
      if (!isInTelegram) {
        setForm(createInitialState());
      }
    } catch (error: any) {
      const message = error?.message ?? "Не удалось создать турнир";
      setStatus(message);
      tg?.showAlert?.(message);
    } finally {
      submittingRef.current = false;
    }
  }, [form, initData, isInTelegram, isValid, onSubmit, tg]);

  useEffect(() => {
    if (!tg) return;
    if (pending || !isValid) {
      tg.MainButton.setText("Заполните поля");
      tg.MainButton.disable?.();
      tg.MainButton.hide();
      return;
    }
    tg.MainButton.setText("Создать турнир");
    tg.MainButton.show();
    tg.MainButton.enable?.();
  }, [isValid, pending, tg]);

  useEffect(() => {
    if (!tg) return;
    const handler = () => handleSubmit();
    tg.MainButton.onClick(handler);
    return () => tg.MainButton.offClick?.(handler);
  }, [handleSubmit, tg]);

  const onLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSubmit();
  };

  const containerTheme = colorScheme ?? "unknown";

  return (
    <div className="tg-create-container" data-theme={containerTheme}>
      <h1>Создание турнира</h1>
      <p className="tg-create-footnote">
        Настройте параметры турнира и нажмите кнопку Telegram «Создать турнир». После сохранения бот пришлёт ссылку.
      </p>

      <form className="tg-create-form" onSubmit={onLocalSubmit}>
        <label className="tg-field">
          <span>Название турнира</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Например, Пятничный челендж"
            required
          />
        </label>

        <div className="tg-grid">
          <label className="tg-field">
            <span>Тип</span>
            <select
              value={form.type}
              onChange={(e) => setField("type", e.target.value as TournamentType)}
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="tg-field">
            <span>Формат</span>
            <select
              value={form.format}
              onChange={(e) => setField("format", e.target.value as TournamentFormat)}
            >
              {formatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="tg-grid">
          <label className="tg-field">
            <span>Дата начала</span>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setField("startDate", e.target.value)}
            />
          </label>

          <label className="tg-field">
            <span>Дата окончания</span>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setField("endDate", e.target.value)}
            />
          </label>
        </div>

        {form.format === TournamentFormat.Pyramid && (
          <label className="tg-field">
            <span>Максимальное число уровней пирамиды</span>
            <input
              type="number"
              min={3}
              max={50}
              value={form.pyramidMaxLevel}
              onChange={(e) => setField("pyramidMaxLevel", Number(e.target.value) || 3)}
            />
          </label>
        )}

        {form.format === TournamentFormat.GroupsPlayoff && (
          <label className="tg-field">
            <span>Количество групп</span>
            <input
              type="number"
              min={2}
              max={12}
              value={form.groupsPlayoffGroupsCount}
              onChange={(e) => setField("groupsPlayoffGroupsCount", Number(e.target.value) || 2)}
            />
          </label>
        )}

        {!isInTelegram && (
          <button type="submit" className="tg-submit" disabled={!isValid || pending}>
            {pending ? "Создание…" : "Создать турнир"}
          </button>
        )}
      </form>

      {status && <div className="tg-create-status"><strong>Статус:</strong><span>{status}</span></div>}
    </div>
  );
}
