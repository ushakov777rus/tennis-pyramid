// app/api/register/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { UsersRepository } from "@/app/repositories/UsersRepository";

export async function POST(req: Request) {
  try {
    const { fullName, phone, ntrp, password, role, email } = await req.json();

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json({ error: "Укажите имя и фамилию" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Укажите email" }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Пароль должен содержать не менее 6 символов" }, { status: 400 });
    }
    if (!role) {
      return NextResponse.json({ error: "Укажите роль" }, { status: 400 });
    }

    const supabase = await createClient();

    // ✅ Кладём метадату сразу при регистрации
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          phone: phone ?? null,
          ntrp: ntrp ?? null,
        },
      },
    });

    if (authError) {
      console.error("Supabase auth error:", authError);
      return NextResponse.json({ error: "Ошибка при регистрации: " + authError.message }, { status: 500 });
    }

    if (authData.user) {
      const authId = authData.user.id;

      // ✅ Дождаться записи в вашей таблице users
      await UsersRepository.register({
        fullName,
        role,
        phone,
        ntrp,
        auth_id: authId, // убедитесь, что внутри репозитория пишется в колонку auth_user_id
        email,
      });
    }

    // (не обязательно) можно сразу перечитать свою запись и вернуть полную структуру
    // но проще на клиенте сделать refresh()

    return NextResponse.json(
      { message: "Пользователь успешно зарегистрирован", user: authData.user },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("Register route error:", e);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}