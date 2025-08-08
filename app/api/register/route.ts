// app/api/register-player/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
//import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // серверный ключ
);

export async function POST(req: Request) {
  try {
    const { fullName, nickname, password } = await req.json();

    // Валидация
    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json({ error: "Укажите имя и фамилию" }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Пароль должен быть не короче 6 символов" }, { status: 400 });
    }
    if (nickname && typeof nickname !== "string") {
      return NextResponse.json({ error: "Некорректный никнейм" }, { status: 400 });
    }

    // Проверка дубликата никнейма (если задан)
    if (nickname && nickname.trim()) {
      const { data: exists, error: existsErr } = await supabase
        .from("players")
        .select("id")
        .eq("nickname", nickname.trim())
        .maybeSingle();

      if (existsErr) {
        return NextResponse.json({ error: "Ошибка проверки никнейма" }, { status: 500 });
      }
      if (exists) {
        return NextResponse.json({ error: "Никнейм уже занят" }, { status: 409 });
      }
    }

    // Хеш пароля
    //const passwordHash = await bcrypt.hash(password, 10);

    // Вставка игрока
    const { data, error } = await supabase
      .from("players")
      .insert({
        name: fullName.trim(),
        nickname: nickname?.trim() || null,
        password_hash: password,
      })
      .select("id, name, nickname")
      .single();

    if (error) {
      // нарушение unique по nickname обычно вернет 409
      return NextResponse.json({ error: "Не удалось создать игрока" }, { status: 500 });
    }

    // Возвращаем то, что ожидает твой UserContext
    return NextResponse.json(
      { user: { id: data.id, name: data.name, nickname: data.nickname, role: "player" } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
}