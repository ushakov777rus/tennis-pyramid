// app/api/me/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { UserRole } from "@/app/models/Users";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Получаем текущую сессию
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    console.log("api:me:user:begin",session?.user);
    
    if (sessionError || !session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    console.log("api:me get user by auth id", session.user.id);

    // Получаем информацию о пользователе
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
      .eq('auth_user_id', session.user.id)
      .maybeSingle();

    if (userError) {
      console.error("Error fetching user data:", userError);
    }

    const user = {
      id: userData?.id,
      email: session.user.email,
      name: userData?.name || session.user.user_metadata.full_name || session.user.email,
      role: userData?.role || session.user.user_metadata.role || UserRole.Player,
      player_id: userData?.players?.[0]?.id || null,
      full_name: userData?.name || session.user.user_metadata.full_name,
    };

    console.log("me:user", user);

    return NextResponse.json({ user });

  } catch (e: any) {
    console.error("User route error:", e);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}