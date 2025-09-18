// lib/auth-server.ts
import { createClient } from "@/app/lib/supabase/server";
import { UserRole } from "@/app/models/Users";

export type ServerUser = {
  id: number | null;            // id из таблицы users (а НЕ auth)
  email: string | null;
  name: string;
  role: UserRole;
  full_name: string | null;
  player: {
    id: number;
    name: string | null;
    phone: string | null;
    sex: string | null;
    ntrp: string | null;
  } | null;
  /** auth id supabase (uuid) — иногда полезно знать */
  auth_user_id: string;
};

/** Получить «собранного» пользователя на СЕРВЕРЕ (без похода в /api). */
export async function getServerUser(): Promise<ServerUser | null> {
  const supabase = await createClient();

  // 1) auth-сессия
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.user) return null;

  const authUser = session.user;

  // 2) users + вложенные players
  const { data: userData, error: userError } = await supabase
    .from("users")
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
    .eq("auth_user_id", authUser.id)
    .maybeSingle();

  if (userError) {
    // лог — но не падаем
    console.error("getServerUser: fetch user error:", userError);
  }

  const player = (userData as any)?.players?.[0]
    ? {
        id: userData!.players[0].id,
        name: userData!.players[0].name,
        phone: userData!.players[0].phone,
        sex: userData!.players[0].sex,
        ntrp: userData!.players[0].ntrp,
      }
    : null;

  return {
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
    player,
    full_name:
      userData?.name || (authUser.user_metadata as any)?.full_name || null,
    auth_user_id: authUser.id,
  };
}