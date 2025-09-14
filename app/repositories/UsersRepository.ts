// app/repositories/UsersRepository.ts
import { supabase } from "@/lib/supabaseClient";
import { User, UserRole } from "../models/Users";
import { Player } from "../models/Player";

export type RegisterPayload = {
  fullName: string;
  password?: string | null;
  role: UserRole;
  phone?: string | null;
  ntrp?: string | null;
  auth_id: string;
  email: string;
};

// Теперь возвращаем целого пользователя с вложенным player, а не player_id
export type RegisterResult = {
  user: User;
};

function mapUserRow(row: any): User {
  // PostgREST вернёт users + players[] (массив). Берём первого как 1:1.
  const playerRow = Array.isArray(row.players) ? row.players[0] : undefined;
  const mapped = {
    id: row.id,
    name: row.name,
    role: row.role as UserRole,
    player: playerRow ? new Player(playerRow) : null, // <- если нет — null
  };
  return new User(mapped as any);
}

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
      return true;
    }
    return !!data;
  }

  /** Зарегистрировать пользователя и, если нужно, создать/привязать игрока */
  static async register(payload: RegisterPayload): Promise<RegisterResult> {
    const fullName = payload.fullName.trim();

    const norm10 = (phone?: string | null): string | null => {
      if (!phone) return null;
      const digits = phone.replace(/\D/g, "");
      return digits ? digits.slice(-10) : null;
    };

    // 1) создаём пользователя
    const { data: newUser, error: uerror } = await supabase
      .from("users")
      .insert({
        name: fullName,
        role: payload.role,
        auth_user_id: payload.auth_id,
        // email/пароль — по твоей схеме, если нужно
      })
      .select("id, name, role")
      .single();

    if (uerror || !newUser) {
      console.error("UsersRepository.register: cannot insert user:", uerror);
      throw new Error("USER_CREATE_FAILED");
    }

    let playerId: number | null = null;

    // 2) для ролей с профилем игрока — пытаемся привязать существующего по телефону
    if (payload.role === UserRole.Player || payload.role === UserRole.TournamentAdmin) {
      const wanted10 = norm10(payload.phone);

      let linkedExisting = false;
      if (wanted10) {
        const { data: candidates, error: serror } = await supabase
          .from("players")
          .select("id, user_id, phone")
          .eq("phone", wanted10);

        if (!serror && candidates?.length) {
          const exact = candidates.find((p) => norm10(p.phone) === wanted10);
          if (exact) {
            if (!exact.user_id) {
              const { error: uperr } = await supabase
                .from("players")
                .update({ user_id: newUser.id })
                .eq("id", exact.id);
              if (!uperr) {
                playerId = exact.id;
                linkedExisting = true;
              } else {
                console.error("UsersRepository.register: link existing player failed:", uperr);
              }
            }
          }
        }
      }

      // 3) если не привязали существующего — создаём нового
      if (!linkedExisting) {
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
    }

    // 4) возвращаем пользователя уже с вложенным player
    const full = await this.findById(newUser.id);
    if (!full) {
      // крайний случай: смэппим вручную без запроса
      return {
        user: new User({
          id: newUser.id,
          name: newUser.name,
          role: newUser.role,
          player: playerId
            ? new Player({ id: playerId, name: fullName, phone: payload.phone ?? null, ntrp: payload.ntrp ?? null, sex: null })
            : null,
        } as any),
      };
    }
    return { user: full };
  }

  /** ===== CRUD/поиск с вложенным players ===== */

  static async loadAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select(`
        id, name, role,
        players (
          id, name, phone, sex, ntrp, user_id
        )
      `)
      .order("name", { ascending: true });

    if (error) {
      console.error("Ошибка загрузки пользователей:", error);
      return [];
    }
    return (data ?? []).map(mapUserRow);
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
      .select(`
        id, name, role,
        players!players_user_id_fkey (
          id, name, phone, sex, ntrp, user_id
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Ошибка поиска пользователя по id:", error);
      return null;
    }
    return data ? mapUserRow(data) : null;
  }

  static async findByName(name: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select(`
        id, name, role,
        players (
          id, name, phone, sex, ntrp, user_id
        )
      `)
      .eq("name", name)
      .maybeSingle();

    if (error) {
      console.error("Ошибка поиска пользователя по имени:", error);
      return null;
    }
    return data ? mapUserRow(data) : null;
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
    return (data as any)?.password ?? null;
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
    // 1) достаём пользователя с players
    const { data, error } = await supabase
      .from("users")
      .select(`
        id, name, role, password,
        players (
          id, name, phone, sex, ntrp, user_id
        )
      `)
      .eq("name", name)
      .maybeSingle();

    if (error) {
      console.error("Ошибка аутентификации:", error);
      return null;
    }
    if (!data || (data as any).password !== password) return null;

    const { password: _pw, ...safe } = data as any;
    return mapUserRow(safe);
  }
}