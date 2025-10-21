"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  FORMAT_OPTIONS,
  TournamentFormat,
  TournamentType,
  TYPE_OPTIONS,
} from "@/app/models/Tournament";
import "./styles.css";
import { useDictionary } from "@/app/components/LanguageProvider";

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
    let cancelled = false;
    let retry: ReturnType<typeof setTimeout> | null = null;
    let cleanupBack: (() => void) | null = null;

    const attemptInit = () => {
      if (cancelled) return;
      const webApp = window.Telegram?.WebApp ?? null;
      if (!webApp) {
        console.warn("[tg:create] Telegram WebApp API is not available. Running in plain browser mode.");
        retry = setTimeout(attemptInit, 200);
        return;
      }

      webApp.ready();
      webApp.expand?.();

      const initData = webApp.initData ?? "";
      const colorScheme = webApp.colorScheme ?? "unknown";

      console.log("[tg:create] initData", {
        hasInitData: Boolean(initData),
        snippet: initData?.slice?.(0, 180) ?? "",
      });

      const handleBack = () => webApp.close();
      webApp.BackButton?.show?.();
      webApp.BackButton?.onClick(handleBack);
      cleanupBack = () => webApp.BackButton?.offClick?.(handleBack);

      if (!cancelled) {
        setValue({ tg: webApp, initData, colorScheme });
      }
    };

    attemptInit();

    return () => {
      cancelled = true;
      if (retry) clearTimeout(retry);
      cleanupBack?.();
    };
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
  const { telegramCreate, tournaments } = useDictionary();
  const typeOptions = useMemo(
    () =>
      TYPE_OPTIONS.filter((option) => option.value).map((option) => ({
        value: option.value as TournamentType,
        label: tournaments.typeLabels[option.value as TournamentType],
      })),
    [tournaments.typeLabels]
  );
  const formatOptions = useMemo(
    () =>
      FORMAT_OPTIONS.filter((option) => option.value).map((option) => {
        const formatValue = option.value as TournamentFormat;
        switch (formatValue) {
          case TournamentFormat.RoundRobin:
            return { value: formatValue, label: tournaments.formatLabels.roundRobin };
          case TournamentFormat.SingleElimination:
            return { value: formatValue, label: tournaments.formatLabels.singleElimination };
          case TournamentFormat.DoubleElimination:
            return { value: formatValue, label: tournaments.formatLabels.doubleElimination };
          case TournamentFormat.GroupsPlayoff:
            return { value: formatValue, label: tournaments.formatLabels.groupsPlayoff };
          case TournamentFormat.Swiss:
            return { value: formatValue, label: tournaments.formatLabels.swiss };
          case TournamentFormat.Custom:
            return { value: formatValue, label: tournaments.formatLabels.custom };
          case TournamentFormat.Pyramid:
          default:
            return { value: formatValue, label: tournaments.formatLabels.pyramid };
        }
      }),
    [tournaments.formatLabels]
  );

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
        setStatus(telegramCreate.statusCreatedWithUrl.replace("{value}", String(data.url)));
      } else if (data && typeof data === "object" && "slug" in data) {
        setStatus(telegramCreate.statusCreatedWithSlug.replace("{value}", String(data.slug)));
      } else {
        setStatus(telegramCreate.statusCreated);
      }
      if (!isInTelegram) {
        setForm(createInitialState());
      }
    } catch (error: any) {
      const message = error?.message ?? telegramCreate.errors.createFailed;
      setStatus(message);
      tg?.showAlert?.(message);
    } finally {
      submittingRef.current = false;
    }
  }, [form, initData, isInTelegram, isValid, onSubmit, tg]);

  useEffect(() => {
    if (!tg) return;
    if (pending || !isValid) {
      tg.MainButton.setText(telegramCreate.mainButton.disabled);
      tg.MainButton.disable?.();
      tg.MainButton.hide();
      return;
    }
    tg.MainButton.setText(telegramCreate.mainButton.submit);
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
      <h1>{telegramCreate.title}</h1>
      <p className="tg-create-footnote">
        {telegramCreate.description}
      </p>

      <form className="tg-create-form" onSubmit={onLocalSubmit}>
        <label className="tg-field">
          <span>{telegramCreate.nameLabel}</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder={telegramCreate.namePlaceholder}
            required
          />
        </label>

        <div className="tg-grid">
          <label className="tg-field">
            <span>{telegramCreate.typeLabel}</span>
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
            <span>{telegramCreate.formatLabel}</span>
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
            <span>{telegramCreate.startDateLabel}</span>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setField("startDate", e.target.value)}
            />
          </label>

          <label className="tg-field">
            <span>{telegramCreate.endDateLabel}</span>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setField("endDate", e.target.value)}
            />
          </label>
        </div>

        {form.format === TournamentFormat.Pyramid && (
          <label className="tg-field">
            <span>{telegramCreate.pyramidLevelsLabel}</span>
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
            <span>{telegramCreate.groupsCountLabel}</span>
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
            {pending ? telegramCreate.submitButton.pending : telegramCreate.submitButton.submit}
          </button>
        )}
      </form>

      {status && (
        <div className="tg-create-status">
          <strong>{telegramCreate.statusHeading}</strong>
          <span>{status}</span>
        </div>
      )}
    </div>
  );
}
