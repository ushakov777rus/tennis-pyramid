import { supabase } from "@/lib/supabaseClient";
import { Tournament } from "@/app/models/Tournament"
import { Participant } from "@/app/models/Participant";
import { Player } from "@/app/models/Player"
import { Team } from "@/app/models/Team"

export class TournamentsRepository {

  static async loadAll(): Promise<Tournament[]> {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*");

    if (error) {
      console.error("Ошибка загрузки турниров:", error);
      return [];
    }

    return (data ?? []).map((row: any) =>
      new Tournament(
        Number(row.id),  // ✅ гарантированно число
        row.name,
        row.status,
        row.tournament_type,
        row.start_date,
        row.end_date
      )
    );
  }
 
    // ✅ Добавляем эту функцию
  static async getTournamentById(id: string): Promise<Tournament | null> {
    const { data, error } = await supabase
        .from("tournaments")
        .select(
        `
        *
        `
        )
        .eq("id", id)
        .single();

    console.log("getTournamentById:", id, data);

    if (error) {
        console.error(error);
        return null;
    }

    return data as Tournament;
  }

  static async create(params: {
    name: string;
    tournament_type: "single" | "double";
    start_date: string | null;
    end_date: string | null;
    status: "draft" | "ongoing" | "finished";
  }): Promise<void> {
    const { name, tournament_type, start_date, end_date, status } = params;

    const { error } = await supabase.from("tournaments").insert([
      {
        name,
        tournament_type,
        start_date,
        end_date,
        status,
      },
    ]);

    if (error) {
      console.error("Ошибка при создании турнира:", error);
      throw error;
    }
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from("tournaments").delete().eq("id", id);
    if (error) console.error("Ошибка удаления турнира:", error);
  }

  static async loadParticipants(tournamentId: number): Promise<Participant[]> {
    const { data, error } = await supabase
      .from("tournament_participants")
      .select(`
        id,
        level,
        position,
        player_id,
        team_id,
        players ( id, name, ntrp, phone, sex ),
        teams (
          id,
          name,
          team_players (
            players ( id, name, ntrp, phone, sex )
          )
        )
      `)
      .eq("tournament_id", tournamentId);

    if (error) {
      console.log("data:", data);
      console.log("error:", error);

      return [];
    }

    return (data ?? []).map((row) => {
      let player: Player | undefined;
      let team: Team | undefined;
      
      if (row.players) {   
        const p = row.players as unknown as { id: number; name: string; ntrp: string; phone: string; sex: string };
        player = new Player({ id: p.id, name: p.name, ntrp: p.ntrp, phone: p.phone, sex: p.sex });
      }

      if (row.teams && row.teams.length > 0) {
        const t = row.teams[0];
        const teamPlayers = (t.team_players ?? []).map(
          (pl: any) => new Player({ id: pl.id, name: pl.name, ntrp: pl.ntrp, phone: pl.phone, sex: pl.sex })
        );
        team = new Team(t.id, t.name, teamPlayers[0], teamPlayers[1]);
      }

      return new Participant({
        id: row.id,
        level: row.level,
        position: row.position,
        player,
        team,
      });
    });
  }

  static async addMatch(tournamentId: number, match_date: string | null, tournament_type: "single" | "double") {
    const { error } = await supabase.from("matches").insert({
      date: match_date,
      match_type: tournament_type,
      tournament_id : tournamentId
    });
    if (error) console.error("Ошибка добавления игрока:", error);
  }

  static async addPlayer(tournamentId: number, playerId: number, level: number) {
    const { error } = await supabase.from("tournament_participants").insert({
      tournament_id: tournamentId,
      player_id: playerId,
      level: level
    });
    if (error) console.error("Ошибка добавления игрока:", error);
  }

  static async addTeam(tournamentId: number, teamId: number, level: number) {
    const { error } = await supabase.from("tournament_participants").insert({
      tournament_id: tournamentId,
      team_id: teamId,
      level: level
    });
    if (error) console.error("Ошибка добавления команды:", error);
  }

  static async removeParticipant(id: number) {
    const { error } = await supabase
      .from("tournament_participants")
      .delete()
      .eq("id", id);
    if (error) console.error("Ошибка удаления участника:", error);
  }

}