import { supabase } from "@/lib/supabaseClient";

export class OrganizerContactsRepository {
  static async addVisiblePlayer(adminId: number, playerId: number) {
    const { error } = await supabase
      .from("organizer_visible_players")
      .insert({ organizer_user_id: adminId, player_id: playerId });
    if (error) console.error(error);
  }

  static async removeVisiblePlayer(playerId: number, adminId?: number) {
    if (!adminId) return;

    const { error } = await supabase
      .from("organizer_visible_players")
      .delete()
      .eq("organizer_user_id", adminId)
      .eq("player_id", playerId);
    if (error) console.error(error);
  }

  // 👇 новый метод
  static async isMyPlayer(playerId: number, adminId?: number): Promise<boolean> {
    if (!adminId) return false;

    const { data, error } = await supabase
      .from("organizer_visible_players")
      .select("*")
      .eq("organizer_user_id", adminId)
      .eq("player_id", playerId)
      .maybeSingle();

    if (error) {
      console.error("Ошибка проверки isMyPlayer:", error);
      return false;
    }

    return !!data;
  }
}