import { supabase } from "@/lib/supabaseClient";

import { Player } from "../models/Player";

export class OrganizerContactsRepository {

  static async addVisiblePlayer(playerId: number) {
    const { error } = await supabase
      .from("organizer_visible_players")
      .insert({ organizer_user_id: (await supabase.auth.getUser()).data.user?.id, player_id: playerId });
    if (error) console.error(error);
  }

  static async removeVisiblePlayer(playerId: number) {
    const { error } = await supabase
      .from("organizer_visible_players")
      .delete()
      .eq("organizer_user_id", (await supabase.auth.getUser()).data.user?.id)
      .eq("player_id", playerId);
    if (error) console.error(error);
  }
}