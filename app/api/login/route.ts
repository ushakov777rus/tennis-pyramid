import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { name, password } = await req.json();

  const { data, error } = await supabase
    .from("users")
    .select(
      `
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
      `
    )
    .eq("name", name)
    .eq("password", password) // ⚠️ plain-text только для MVP
    .maybeSingle();

  if (error || !data) {
    console.log("sss", error);
    return NextResponse.json(
      { error: "Неверный логин или пароль" },
      { status: 401 }
    );
  }

  // формируем объект пользователя
  const user = {
    id: data.id,
    name: data.players.length > 0 ? data.players[0].name : data.name,
    role: data.role,
    player_id: data.players.length > 0 ? data.players[0].id : null
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