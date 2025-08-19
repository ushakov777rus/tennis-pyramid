import { supabase } from "@/lib/supabaseClient";
import { Player } from "../models/Player";


export class PlayersRepository {
  static async loadAll(): Promise<Player[]> {
    const { data, error } = await supabase
      .from("players")
      .select("id, name, phone, sex, ntrp")
      .order("name", { ascending: true });

    if (error) {
      console.error("Ошибка загрузки игроков:", error);
      return [];
    }

      return (data ?? []).map((row: any) => {
        return new Player(row);
      });
  }

  static async loadAccessiblePlayers(
    organiserUserId: number | undefined,
    userRole: string | undefined
  ): Promise<Player[]> {

    if (organiserUserId === undefined || userRole === undefined)
      return [];

    try {
      // 1) все игроки
      const { data: playersData, error: playersErr } = await supabase
        .from("players")
        .select("id, name, ntrp, phone, sex")
        .order("name", { ascending: true });

      if (playersErr) {
        console.error("loadAccessiblePlayers: players error", playersErr);
        return [];
      }

      // ✅ Администратор видит всех игроков
      if (userRole === "site_admin") {
        return (playersData ?? []).map(
          row =>
            new Player({
              id: Number(row.id),
              name: row.name,
              ntrp: row.ntrp,
              phone: row.phone,
              sex: row.sex,
            })
        );
      }

      // 2) связи организатора -> видимые игроки
      const { data: linksData, error: linksErr } = await supabase
        .from("organizer_visible_players")
        .select("player_id")
        .eq("organizer_user_id", organiserUserId);

      if (linksErr) {
        console.error("loadAccessiblePlayers: links error", linksErr);
        return [];
      }

      const allowed = new Set<number>((linksData ?? []).map(r => Number(r.player_id)));

      // 3) локальная фильтрация
      const filtered = (playersData ?? []).filter(row => allowed.has(Number(row.id)));

      // 4) маппинг в модель
      return filtered.map(
        row =>
          new Player({
            id: Number(row.id),
            name: row.name,
            ntrp: row.ntrp,
            phone: row.phone,
            sex: row.sex,
          })
      );
    } catch (e) {
      console.error("loadAccessiblePlayers: unexpected error", e);
      return [];
    }
  }

  static async add(player: Partial<Player>): Promise<void> {
    const { error } = await supabase.from("players").insert([
      {
        name: player.name,
        phone: player.phone,
        sex: player.sex,
        ntrp: player.ntrp,
      },
    ]);

    if (error) console.error("Ошибка добавления игрока:", error);
  }
 
  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from("players").delete().eq("id", id);
    if (error) console.error("Ошибка удаления игрока:", error);
  }

  static async update(id: number, data: Partial<Player>) {
    const { error } = await supabase
      .from("players")
      .update(data)
      .eq("id", id);

    if (error) console.error("Ошибка сохранения игрока:", error);
  }

  static async findByUserId(userId: number): Promise<Player | null> {
    const { data, error } = await supabase
      .from("players")
      .select("id, name, ntrp, phone, sex, user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) { console.error(error); return null; }
    return data ? new Player(data) : null;
  }

  static async findById(playerId: number): Promise<Player | null> {
    const { data, error } = await supabase
      .from("players")
      .select("id, name, ntrp, phone, sex, user_id")
      .eq("id", playerId)
      .maybeSingle();

    if (error) { console.error(error); return null; }
    return data ? new Player(data) : null;
  }
}