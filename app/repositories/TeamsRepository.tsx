import { supabase } from "@/lib/supabaseClient";
import { Player } from "@/app/models/Player";
import { Team } from "@/app/models/Team";

export class TeamsRepository {
  static async loadAll(): Promise<Team[]> {
    const { data, error } = await supabase
      .from("teams")
      .select(`
        id,
        name,
        player1:players!teams_player1_id_fkey (id, name, phone, sex, ntrp),
        player2:players!teams_player2_id_fkey (id, name, phone, sex, ntrp)
      `)
      .order("name", { ascending: true });

    if (error) {
      console.error("Ошибка загрузки команд:", error);
      return [];
    }

    return (
      data?.map((t) => {
        const player1 = 
          new Player({
              id: t.player1[0].id,
              name: t.player1[0].name,
              phone: t.player1[0].phone,
              sex: t.player1[0].sex,
              ntrp: t.player1[0].ntrp,
            });

        const player2 = 
          new Player({
              id: t.player2[0].id,
              name: t.player2[0].name,
              phone: t.player2[0].phone,
              sex: t.player2[0].sex,
              ntrp: t.player2[0].ntrp,
            });

        return new Team(t.id, t.name, player1, player2);
      }) ?? []
    );
  }

  static async create(name: string, player1Id?: number, player2Id?: number): Promise<void> {
    const { error } = await supabase.from("teams").insert({
      name,
      player1_id: player1Id ?? null,
      player2_id: player2Id ?? null,
    });

    if (error) console.error("Ошибка создания команды:", error);
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from("teams").delete().eq("id", id);
    if (error) console.error("Ошибка удаления команды:", error);
  }

  static async updatePlayers(teamId: number, player1Id: number | null, player2Id: number | null): Promise<void> {
    const { error } = await supabase
      .from("teams")
      .update({
        player1_id: player1Id,
        player2_id: player2Id,
      })
      .eq("id", teamId);

    if (error) console.error("Ошибка обновления игроков в команде:", error);
  }
}