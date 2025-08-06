import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  console.log("route/login 0");

  const { name, password } = await req.json();

  console.log("route/login 1");

  const { data, error } = await supabase
    .from("users")
    .select(
      `
        id,
        name,
        role,
        players (
          id,
          name,
          phone,
          sex,
          ntrp
        )
      `
    )
    .eq("name", name)
    .eq("password", password) // ⚠️ plain-text только для MVP
    .maybeSingle();

console.log("route/login 2");

  if (error || !data) {
    return NextResponse.json(
      { error: "Неверный логин или пароль" },
      { status: 401 }
    );
  }

console.log("route/login 3:", data);

  // формируем объект пользователя
  const user = {
    id: data.id,
    name: data.players.length > 0 ? data.players[0].name : data.name,
    role: data.role,
    player_id: data.players.length > 0 ? data.players[0].id : null
  };

  console.log("route/login:",user);

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