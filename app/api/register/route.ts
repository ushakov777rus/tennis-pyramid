// app/api/register/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { UsersRepository } from "@/app/repositories/UsersRepository";

export async function POST(req: Request) {
  try {
    const { fullName, phone, ntrp, nickname, password, role, email } = await req.json();
    console.log("regidter: ", fullName, phone, ntrp, nickname, password, role, email);

    // Валидация
    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json({ error: "Укажите имя и фамилию" }, { status: 400 });
    }
    
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Укажите email" }, { status: 400 });
    }
    
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Пароль должен содержать не менее 6 символов" }, { status: 400 });
    }
    
    if (nickname && typeof nickname !== "string") {
      return NextResponse.json({ error: "Некорректный никнейм" }, { status: 400 });
    }
    
    if (!role) {
      return NextResponse.json({ error: "Укажите роль" }, { status: 400 });
    }

    // Создаем Supabase клиент
    const supabase = await createClient();

    // Проверяем, существует ли уже пользователь с таким email
    // TODO переделать на supabase
    /*
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error("Check user error:", checkError);
      return NextResponse.json({ error: "Ошибка при проверке пользователя" }, { status: 500 });
    }

    if (existingUsers) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 409 });
    }
*/
    // Регистрируем пользователя в Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Supabase auth error:", authError);
      return NextResponse.json({ error: "Ошибка при регистрации: " + authError.message }, { status: 500 });
    }

    // Если регистрация успешна, создаем запись в таблице пользователей
    if (authData.user) {
      // ID созданного пользователя
      const authId = authData.user?.id;

      UsersRepository.register({fullName: fullName, role: role, phone: phone, ntrp: ntrp, auth_id: authId });
    }

    return NextResponse.json({ 
      message: "Пользователь успешно зарегистрирован", 
      user: authData.user 
    }, { status: 201 });
    
  } catch (e: any) {
    console.error("Register route error:", e);
     return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}