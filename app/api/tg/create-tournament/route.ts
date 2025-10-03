import crypto from "node:crypto";
import { NextResponse } from "next/server";

import {
  TournamentFormat,
  TournamentType,
  TournamentCreateInput,
} from "@/app/models/Tournament";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";

function safeTournamentFormat(value: unknown): TournamentFormat {
  const formats = new Set<string>(Object.values(TournamentFormat));
  if (typeof value === "string" && formats.has(value)) {
    return value as TournamentFormat;
  }
  return TournamentFormat.RoundRobin;
}

function safeTournamentType(value: unknown): TournamentType {
  const types = new Set<string>(Object.values(TournamentType));
  if (typeof value === "string" && types.has(value)) {
    return value as TournamentType;
  }
  return TournamentType.Single;
}

function createDataCheckString(params: URLSearchParams) {
  return Array.from(params.entries())
    .filter(([key]) => key !== "hash")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
}

function verifyTelegramInitData(initData: string, botToken: string) {
  if (!initData) return false;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return false;

  params.delete("hash");
  const dataCheckString = createDataCheckString(params);

  const secretKey = crypto
    .createHash("sha256")
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return calculatedHash === hash;
}

function parseTelegramUserId(initData: string): number | null {
  try {
    const params = new URLSearchParams(initData);
    const raw = params.get("user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (typeof user?.id === "number") {
      return user.id;
    }
    return null;
  } catch (error) {
    console.warn("Failed to parse telegram user", error);
    return null;
  }
}

export async function POST(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN env is not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const initData: string = typeof body?.initData === "string" ? body.initData : "";
  if (!verifyTelegramInitData(initData, token)) {
    return NextResponse.json({ error: "Invalid Telegram signature" }, { status: 401 });
  }

  const form = body?.form ?? {};

  const name = typeof form?.name === "string" ? form.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Введите название турнира" }, { status: 400 });
  }

  const format = safeTournamentFormat(form?.format);
  const type = safeTournamentType(form?.tournament_type);

  const startDate = form?.start_date ? String(form.start_date) : null;
  const endDate = form?.end_date ? String(form.end_date) : null;

  if (startDate && endDate && startDate > endDate) {
    return NextResponse.json({ error: "Дата начала позже даты окончания" }, { status: 400 });
  }

  const payload: TournamentCreateInput = {
    name,
    format,
    tournament_type: type,
    start_date: startDate,
    end_date: endDate,
    creator_id: null,
    is_public: Boolean(form?.is_public ?? true),
    club: null,
    settings: undefined,
    regulation: null,
  };

  const settings: Record<string, unknown> = {};

  const creatorId = parseTelegramUserId(initData);
  if (creatorId) {
    settings.telegram = { userId: creatorId };
  }

  if (format === TournamentFormat.Pyramid) {
    const rawLevel = Number(form?.pyramidMaxLevel);
    const maxLevel = Number.isFinite(rawLevel) ? Math.max(3, Math.min(50, rawLevel)) : 15;
    settings.pyramid = { maxLevel };
  } else if (format === TournamentFormat.GroupsPlayoff) {
    const rawGroups = Number(form?.groupsPlayoffGroupsCount);
    const groupsCount = Number.isFinite(rawGroups) ? Math.max(2, Math.min(12, rawGroups)) : 2;
    settings.groupsplayoff = { groupsCount };
  }

  if (Object.keys(settings).length > 0) {
    payload.settings = settings;
  }

  try {
    const tournament = await TournamentsRepository.createNewTournament(payload);
    const responseBody = {
      id: tournament.id,
      slug: tournament.slug,
      url: `https://honeycup.ru/tournaments/${tournament.slug}`,
    };
    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: any) {
    console.error("Telegram create tournament error", error);
    return NextResponse.json({ error: "Не удалось создать турнир" }, { status: 500 });
  }
}
