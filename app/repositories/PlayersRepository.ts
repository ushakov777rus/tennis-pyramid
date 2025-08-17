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
}