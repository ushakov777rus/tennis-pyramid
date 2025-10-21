"use client";

import { useCallback, useState } from "react";
import Script from "next/script";
import { TelegramTournamentForm } from "./TelegramTournamentForm";
import { TournamentFormat, TournamentType } from "@/app/models/Tournament";
import { useDictionary } from "@/app/components/LanguageProvider";

export default function TelegramCreateTournamentPage() {
  const [pending, setPending] = useState(false);
  const { telegramCreate } = useDictionary();

  const handleSubmit = useCallback(async (payload: {
    name: string;
    format: TournamentFormat;
    type: TournamentType;
    startDate: string;
    endDate: string;
    isPublic: boolean;
    pyramidMaxLevel: number;
    groupsPlayoffGroupsCount: number;
    initData: string;
  }) => {
    setPending(true);

    const body = {
      initData: payload.initData,
      form: {
        name: payload.name,
        format: payload.format,
        tournament_type: payload.type,
        start_date: payload.startDate,
        end_date: payload.endDate,
        is_public: payload.isPublic,
        pyramidMaxLevel: payload.pyramidMaxLevel,
        groupsPlayoffGroupsCount: payload.groupsPlayoffGroupsCount,
      },
    };

    try {
      console.log("[tg:create] submitting", body);

      const response = await fetch("/api/tg/create-tournament", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("tg/create-tournament error", response.status, data);
        throw new Error(data?.error ?? telegramCreate.errors.createFailed);
      }

      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.HapticFeedback?.notificationOccurred?.("success");
        tg.sendData?.(JSON.stringify(data));
        setTimeout(() => tg.close(), 400);
      }

      return data;
    } finally {
      setPending(false);
    }
  }, [telegramCreate.errors.createFailed]);

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      <TelegramTournamentForm pending={pending} onSubmit={handleSubmit} />
    </>
  );
}
