import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { name, password } = await req.json();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("name", name)
    .eq("password", password) // ⚠️ для MVP plain-text пароль
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Неверный логин или пароль" },
      { status: 401 }
    );
  }

  // создаём ответ
  const res = NextResponse.json({ message: "ok", role: data.role });

  // устанавливаем cookie через response.cookies
  res.cookies.set("userId", String(data.id), {
    httpOnly: true,
    path: "/",
  });

  return res;
}