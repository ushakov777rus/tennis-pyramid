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

type RawParam = { key: string; value: string };

function parseRawInitData(initData: string): RawParam[] {
  return initData
    .split("&")
    .filter(Boolean)
    .map((segment) => {
      const eqIndex = segment.indexOf("=");
      if (eqIndex === -1) {
        return { key: segment, value: "" };
      }
      return {
        key: segment.slice(0, eqIndex),
        value: segment.slice(eqIndex + 1),
      };
    });
}

function createDataCheckStringFromRaw(params: RawParam[]) {
  return params
    .filter((pair) => pair.key !== "hash")
  .sort((a, b) => a.key.localeCompare(b.key))
  .map((pair) => `${pair.key}=${pair.value}`)
  .join("\n");
}

function verifyTelegramInitData(initData: string, botToken: string) {
  if (!initData) return false;

  const rawParams = parseRawInitData(initData);
  const hashPair = rawParams.find((pair) => pair.key === "hash");
  const hash = hashPair?.value;
  if (!hash) return false;

  const dataCheckString = createDataCheckStringFromRaw(rawParams);

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
  } catch (_error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const initData: string = typeof body?.initData === "string" ? body.initData : "";
  const isDev = process.env.NODE_ENV !== "production";

  const isSignatureValid = verifyTelegramInitData(initData, token);

  if (!isDev && !isSignatureValid) {
    console.warn("[tg:create] invalid signature", {
      hasInitData: Boolean(initData),
      initDataLength: initData?.length ?? 0,
      hashSample: initData?.slice?.(0, 100) ?? "",
    });
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

  console.log("[tg:create] incoming", {
    name,
    format,
    type,
    startDate,
    endDate,
    isPublic: Boolean(form?.is_public ?? true),
    hasInitData: Boolean(initData),
  });

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
    console.log("[tg:create] success", {
      id: tournament.id,
      slug: tournament.slug,
    });
    const responseBody = {
      id: tournament.id,
      slug: tournament.slug,
      url: `https://honeycup.ru/tournaments/${tournament.slug}`,
    };
    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: any) {
    console.error("[tg:create] failed", error);
    return NextResponse.json({ error: "Не удалось создать турнир" }, { status: 500 });
  }
}
