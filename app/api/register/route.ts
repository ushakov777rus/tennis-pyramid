// app/api/register/route.ts
import { NextResponse } from "next/server";
import { UsersRepository } from "@/app/repositories/UsersRepository";

export async function POST(req: Request) {
  try {
    const { fullName, phone, ntrp, nickname, password, role } = await req.json();

    // Валидация
    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json({ error: "Укажите имя и фамилию" }, { status: 400 });
    }
    if (nickname && typeof nickname !== "string") {
      return NextResponse.json({ error: "Некорректный никнейм" }, { status: 400 });
    }
    if (!role) {
      return NextResponse.json({ error: "Укажите роль" }, { status: 400 });
    }

    // Проверка дубликата никнейма (если задан)
    if (nickname && nickname.trim()) {
      const taken = await UsersRepository.isNameTaken(nickname.trim());
      if (taken) {
        return NextResponse.json({ error: "Никнейм уже занят" }, { status: 409 });
      }
    }

    // Регистрация через репозиторий
    const result = await UsersRepository.register({
      fullName,
      nickname,
      password,
      role,
      phone,
      ntrp,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (e: any) {
    console.error("register route error:", e);
    if (e?.message === "USER_CREATE_FAILED") {
      return NextResponse.json({ error: "Не удалось создать пользователя" }, { status: 500 });
    }
    if (e?.message === "PLAYER_CREATE_FAILED") {
      return NextResponse.json({ error: "Не удалось создать игрока" }, { status: 500 });
    }
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
}