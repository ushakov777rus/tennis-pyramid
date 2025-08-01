import { supabase } from "@/lib/supabaseClient";

export interface Team {
  id: number;
  name: string;
  players?: { id: number; name: string }[];
}

export class TeamsRepository {
  static async loadAll(): Promise<Team[]> {
    const { data, error } = await supabase
      .from("teams")
      .select("id, name, team_players(player_id, players(name))")
      .order("name", { ascending: true });

    if (error) {
      console.error("Ошибка загрузки команд:", error);
      return [];
    }

    return (
      data?.map((t: Team) => ({
        id: t.id,
        name: t.name,
        players: t.players?.map((tp: any) => ({
          id: tp.player_id,
          name: tp.players.name,
        })),
      })) ?? []
    );
  }

  static async create(name: string): Promise<void> {
    const { error } = await supabase.from("teams").insert({ name });
    if (error) console.error("Ошибка создания команды:", error);
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from("teams").delete().eq("id", id);
    if (error) console.error("Ошибка удаления команды:", error);
  }

  static async addPlayer(teamId: number, playerId: number) {
    const { error } = await supabase.from("team_players").insert({
      team_id: teamId,
      player_id: playerId,
    });
    if (error) console.error("Ошибка добавления игрока в команду:", error);
  }

  static async removePlayer(teamId: number, playerId: number) {
    const { error } = await supabase
      .from("team_players")
      .delete()
      .eq("team_id", teamId)
      .eq("player_id", playerId);
    if (error) console.error("Ошибка удаления игрока из команды:", error);
  }
}