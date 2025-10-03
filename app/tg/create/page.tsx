"use client";

import { useCallback, useState } from "react";
import { TelegramTournamentForm } from "./TelegramTournamentForm";
import { TournamentFormat, TournamentType } from "@/app/models/Tournament";

export default function TelegramCreateTournamentPage() {
  const [pending, setPending] = useState(false);

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
      const response = await fetch("/api/tg/create-tournament", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Не удалось создать турнир");
      }

      const data = await response.json();

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
  }, []);

  return <TelegramTournamentForm pending={pending} onSubmit={handleSubmit} />;
}
