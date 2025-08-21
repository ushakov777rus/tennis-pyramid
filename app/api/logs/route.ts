// app/api/logs/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  // Добавим request-id (смотри middleware ниже)
  const rid = req.headers.get("x-request-id") || crypto.randomUUID();

  // Тут можно писать в pino/console/внешний коллектор
  console.log(JSON.stringify({ rid, ...body }));

  return NextResponse.json({ ok: true });
}