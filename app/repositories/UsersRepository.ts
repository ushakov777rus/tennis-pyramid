// src/app/repositories/UsersRepository.ts
import { supabase } from "@/lib/supabaseClient";

import { User, UserRole } from "../models/Users";


export class UsersRepository {
  /** Загрузить всех пользователей (без паролей) */
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

  /** Добавить пользователя (role по умолчанию 'player') */
  static async add(payload: {
    name: string;
    password: string; // ⚠️ сейчас в таблице хранится текстом
    role?: UserRole;
  }): Promise<number | null> {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: payload.name,
          password: payload.password,
          role: payload.role ?? "player",
        },
      ])
      .select("id") // вернуть id созданной записи
      .maybeSingle();

    if (error) {
      console.error("Ошибка добавления пользователя:", error);
      return null;
    }

    return data?.id ?? null;
  }

  /** Удалить пользователя по id */
  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) console.error("Ошибка удаления пользователя:", error);
  }

  /** Обновить пользователя (имя/роль). Пароль меняется через changePassword */
  static async update(
    id: number,
    data: Partial<Pick<User, "name" | "role">>
  ): Promise<void> {
    // не позволяем случайно отправить лишние поля
    const patch: any = {};
    if (data.name != null) patch.name = data.name;
    if (data.role != null) patch.role = data.role;

    const { error } = await supabase.from("users").update(patch).eq("id", id);
    if (error) console.error("Ошибка обновления пользователя:", error);
  }

  /** Найти пользователя по id (без пароля) */
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

  /** Найти пользователя по имени (без пароля) */
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

  /** Получить хэш/пароль (если нужен для локальной аутентификации) */
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

  /** Сменить пароль пользователю */
  static async changePassword(id: number, newPassword: string): Promise<void> {
    const { error } = await supabase
      .from("users")
      .update({ password: newPassword })
      .eq("id", id);

    if (error) console.error("Ошибка смены пароля:", error);
  }

  /** Сменить роль пользователю (валидные: site_admin | tournament_admin | player) */
  static async setRole(id: number, role: UserRole): Promise<void> {
    const { error } = await supabase.from("users").update({ role }).eq("id", id);
    if (error) console.error("Ошибка смены роли:", error);
  }

  /** Простейшая аутентификация (сравниваем как есть — см. предупреждение ниже) */
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
    if (!data) return null;
    if (data.password !== password) return null;

    // не возвращаем пароль наружу
    const { password: _pw, ...safe } = data as any;
    return new User(safe);
  }
}