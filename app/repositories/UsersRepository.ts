// app/repositories/UsersRepository.ts
import { supabase } from "@/lib/supabaseClient";
import { User, UserRole } from "../models/Users";
import { UUID } from "crypto";

export type RegisterPayload = {
  fullName: string;           // ФИО для карточки игрока
  nickname?: string | null;   // никнейм (пойдёт в users.name, если задан)
  password?: string | null;   // ⚠️ сейчас хранится как есть (позже уберём)
  role: UserRole;             // 'player' | 'tournament_admin' | 'site_admin'
  phone?: string | null;      // если нужно, можно сохранить в players
  ntrp?: number | null;       // если нужно, можно сохранить в players
  auth_id: string;
};

export type RegisterResult = {
  user: { id: number; name: string; role: UserRole; player_id: number | null };
};

export class UsersRepository {
  /** Проверить, занят ли никнейм (users.name) */
  static async isNameTaken(name: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("name", name)
      .maybeSingle();

    if (error) {
      console.error("UsersRepository.isNameTaken error:", error);
      // на ошибке лучше не разрешать регистрацию с таким ником
      return true;
    }
    return !!data;
  }

  /** Зарегистрировать пользователя и, если роль player, создать привязанного игрока */
  static async register(payload: RegisterPayload): Promise<RegisterResult> {
    const nickname = payload.nickname?.trim();
    const fullName = payload.fullName.trim();

    // 1) создаём пользователя
    const { data: newUser, error: uerror } = await supabase
      .from("users")
      .insert({
        name: nickname && nickname.length > 0 ? nickname : fullName,
        role: payload.role,
        auth_user_id: payload.auth_id
      })
      .select("id, name, role")
      .single();

    if (uerror || !newUser) {
      console.error("UsersRepository.register: cannot insert user:", uerror);
      throw new Error("USER_CREATE_FAILED");
    }

    let playerId: number | null = null;

    // 2) если роль player — создаём players
    if (payload.role === "player") {
      const { data: newPlayer, error: perror } = await supabase
        .from("players")
        .insert({
          name: fullName,
          user_id: newUser.id,
          phone: payload.phone ?? null,
          ntrp: payload.ntrp ?? null,
        })
        .select("id")
        .single();

      if (perror || !newPlayer) {
        console.error("UsersRepository.register: cannot insert player:", perror);
        throw new Error("PLAYER_CREATE_FAILED");
      }
      playerId = newPlayer.id;
    }

    return {
      user: { id: newUser.id, name: newUser.name, role: newUser.role as UserRole, player_id: playerId },
    };
  }

  /** ================== Остальные методы (как у тебя были) ================== */

  static async loadAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, role")
      .order("name", { ascending: true });

    if (error) {
      console.error("Ошибка загрузки пользователей:", error);
      return [];
    }
    return (data ?? []).map((row: any) => new User(row));
  }

  static async add(payload: { name: string; role?: UserRole; authId: string }): Promise<number | null> {
    const { data, error } = await supabase
      .from("users")
      .insert([{ name: payload.name, role: payload.role ?? "player", auth_user_id: payload.authId }])
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Ошибка добавления пользователя:", error);
      return null;
    }
    return data?.id ?? null;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) console.error("Ошибка удаления пользователя:", error);
  }

  static async update(id: number, data: Partial<Pick<User, "name" | "role">>): Promise<void> {
    const patch: any = {};
    if (data.name != null) patch.name = data.name;
    if (data.role != null) patch.role = data.role;

    const { error } = await supabase.from("users").update(patch).eq("id", id);
    if (error) console.error("Ошибка обновления пользователя:", error);
  }

  static async findById(id: number): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, role")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Ошибка поиска пользователя по id:", error);
      return null;
    }
    return data ? new User(data) : null;
  }

  static async findByName(name: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, role")
      .eq("name", name)
      .maybeSingle();

    if (error) {
      console.error("Ошибка поиска пользователя по имени:", error);
      return null;
    }
    return data ? new User(data) : null;
  }

  static async getPasswordHashByName(name: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("users")
      .select("password")
      .eq("name", name)
      .maybeSingle();

    if (error) {
      console.error("Ошибка получения пароля пользователя:", error);
      return null;
    }
    return data?.password ?? null;
  }

  static async changePassword(id: number, newPassword: string): Promise<void> {
    const { error } = await supabase
      .from("users")
      .update({ password: newPassword })
      .eq("id", id);

    if (error) console.error("Ошибка смены пароля:", error);
  }

  static async setRole(id: number, role: UserRole): Promise<void> {
    const { error } = await supabase.from("users").update({ role }).eq("id", id);
    if (error) console.error("Ошибка смены роли:", error);
  }

  static async authenticate(name: string, password: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, role, password")
      .eq("name", name)
      .maybeSingle();

    if (error) {
      console.error("Ошибка аутентификации:", error);
      return null;
    }
    if (!data || data.password !== password) return null;
    const { password: _pw, ...safe } = data as any;
    return new User(safe);
  }
}