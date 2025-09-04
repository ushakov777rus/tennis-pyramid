// app/api/login/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { UserRole } from "@/app/models/Users";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Валидация
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Укажите email" }, { status: 400 });
    }
    
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Укажите пароль" }, { status: 400 });
    }

    // Создаем Supabase клиент
    const supabase = await createClient();

    // Аутентифицируем пользователя через Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (authError) {
      console.error("Login error:", authError);
      
      if (authError.message.includes("Invalid login credentials")) {
        return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
      }
      
      return NextResponse.json({ error: "Ошибка при входе: " + authError.message }, { status: 500 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 401 });
    }

    // Получаем дополнительную информацию о пользователе из таблицы users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        id,
        name,
        role,
        players:players!players_user_id_fkey (
          id,
          name,
          phone,
          sex,
          ntrp
        )
      `)
      .eq('auth_user_id', authData.user.id)
      .maybeSingle();

    if (userError) {
      console.error("Error fetching user data:", userError);
      // Не прерываем вход, но логируем ошибку
    }

    // Формируем объект пользователя
    const user = {
      id: userData?.id,
      email: authData.user.email,
      name: userData?.name || authData.user.user_metadata.name || authData.user.email,
      role: userData?.role || authData.user.user_metadata.role || UserRole.Player,
      player_id: userData?.players?.[0]?.id || null,
      full_name: userData?.name || authData.user.user_metadata.full_name,
    };

    console.log("login:user", user);

    // Создаём ответ
    const response = NextResponse.json({
      message: "Вход выполнен успешно",
      user,
    });

    // Устанавливаем сессионные куки через Supabase
    // Supabase автоматически управляет сессией через куки

    return response;

  } catch (e: any) {
    console.error("Login route error:", e);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}