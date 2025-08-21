import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  // ⚠️ cookies() в 15.4.2 синхронная
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ loggedIn: false });
  }

  // запрос в Supabase
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
    .eq("id", userId)
    .single();

  if (error || !data) {
    console.error("api/me ошибка проверки пользователя в БД:", error, data);
    return NextResponse.json({ loggedIn: false });
  }

  const user = {
    id: data.id,
    name: data.players.length > 0 ? data.players[0].name : data.name,
    role: data.role,
    player_id: data.players.length > 0 ? data.players[0].id : null
  };

  return NextResponse.json({
    loggedIn: true,
    user,
  });
}