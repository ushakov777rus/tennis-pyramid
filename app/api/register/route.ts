// app/api/register-player/route.ts
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { fullName, nickname, password } = await req.json();

    // Валидация
    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json({ error: "Укажите имя и фамилию" }, { status: 400 });
    }
//    if (!password || typeof password !== "string" || password.length < 6) {
//      return NextResponse.json({ error: "Пароль должен быть не короче 6 символов" }, { status: 400 });
//    }
    if (nickname && typeof nickname !== "string") {
      return NextResponse.json({ error: "Некорректный никнейм" }, { status: 400 });
    }

    // Проверка дубликата никнейма (если задан)
    if (nickname && nickname.trim()) {
      const { data: exists, error: existsErr } = await supabase
        .from("users")
        .select("id")
        .eq("name", nickname.trim())
        .maybeSingle();

      if (existsErr) {
        return NextResponse.json({ error: "Ошибка проверки никнейма" }, { status: 500 });
      }
      if (exists) {
        return NextResponse.json({ error: "Никнейм уже занят" }, { status: 409 });
      }
    }

    // Хеш пароля (если надо)
    // const passwordHash = await bcrypt.hash(password, 10);

    // Создаём пользователя
    const { data: newUser, error: uerror } = await supabase
      .from("users")
      .insert({
        name: nickname?.trim() || fullName.trim(), // если нет никнейма — используем ФИО
        role: "player",
        password: password, // пароль в открытом виде (лучше захешировать)
      })
      .select("id, name, role")
      .single();

    if (uerror || !newUser) {
      return NextResponse.json({ error: "Не удалось создать пользователя" }, { status: 500 });
    }

    // Создаём игрока, привязанного к users.id
    const { data: newPlayer, error: perror } = await supabase
      .from("players")
      .insert({
        name: fullName.trim(),
        user_id: newUser.id, // вот здесь теперь вставляем id пользователя
      })
      .select("id, name")
      .single();

    if (perror || !newPlayer) {
      return NextResponse.json({ error: "Не удалось создать игрока" }, { status: 500 });
    }

    // Возвращаем объект пользователя в формате, который ожидает UserContext
    return NextResponse.json(
      { user: { id: newUser.id, name: newUser.name, role: "player" } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
}