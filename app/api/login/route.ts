import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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

  // сохраняем userId в cookie
  const cookieStore = cookies();
  cookieStore.set("userId", String(data.id), { httpOnly: true, path: "/" });

  return NextResponse.json({ message: "ok", role: data.role });
}