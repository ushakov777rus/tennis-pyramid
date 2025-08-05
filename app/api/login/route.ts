import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { name, password } = await req.json();

  const { data, error } = await supabase
    .from("users")
    .select("id, name, role") // ⚠️ пароль возвращать не надо
    .eq("name", name)
    .eq("password", password) // для MVP plain-text пароль
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Неверный логин или пароль" },
      { status: 401 }
    );
  }

  // формируем объект пользователя
  const user = {
    id: data.id,
    name: data.name,
    role: data.role,
  };

  // создаём ответ с user
  const res = NextResponse.json({
    message: "ok",
    user,
  });

  // сохраняем userId в cookie
  res.cookies.set("userId", String(data.id), {
    httpOnly: true,
    path: "/",
  });

  return res;
}