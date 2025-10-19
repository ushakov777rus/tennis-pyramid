// app/api/me/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { UserRole } from "@/app/models/Users";

export async function GET() {
  try {
    const supabase = await createClient();

    // 1) текущая сессия
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authUser = session.user;

    // 2) тянем пользователя с вложенным players (массивом), далее возьмём [0]
    const { data: userData, error: userError } = await supabase
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
      .eq("auth_user_id", authUser.id)
      .maybeSingle();

    if (userError) {
      console.error("api/me: fetch user error:", userError);
    }

    // 3) собираем player-объект (а не player_id)
    const player =
      (userData as any)?.players?.[0]
        ? {
            id: userData!.players[0].id,
            name: userData!.players[0].name,
            phone: userData!.players[0].phone,
            sex: userData!.players[0].sex,
            ntrp: userData!.players[0].ntrp,
          }
        : null;

    // 4) итоговый объект user для клиента
    const user = {
      id: userData?.id ?? null,
      email: authUser.email ?? null,
      name:
        userData?.name ||
        (authUser.user_metadata as any)?.full_name ||
        authUser.email ||
        "",
      role:
        (userData?.role as UserRole | undefined) ||
        ((authUser.user_metadata as any)?.role as UserRole | undefined) ||
        UserRole.Player,
      player, // 👈 вложенный объект или null
      full_name:
        userData?.name || (authUser.user_metadata as any)?.full_name || null,
    };

    return NextResponse.json({ user });
  } catch (e: any) {
    console.error("api/me: server error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
