import { supabase } from "@/lib/supabaseClient";
import { Tournament } from "@/app/models/Tournament";
import { Participant } from "@/app/models/Participant";
import { Player } from "@/app/models/Player";
import { Team } from "@/app/models/Team";

export class TournamentsRepository {
  /** Загрузить все турниры */
  static async loadAll(): Promise<Tournament[]> {
    const { data, error } = await supabase.from("tournaments").select("*");

    if (error) {
      console.error("Ошибка загрузки турниров:", error);
      return [];
    }

    console.log("TournamentsRepository::LoadAll:", error);

    return (data ?? []).map(
      (row: Tournament) =>
        new Tournament(
          Number(row.id),
          row.name,
          row.status,
          row.tournament_type,
          row.start_date,
          row.end_date
        )
    );
  }

  /** Получить турнир по ID */
  static async getTournamentById(id: string): Promise<Tournament | null> {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Ошибка getTournamentById:", error);
      return null;
    }

    return data
      ? new Tournament(
          Number(data.id),
          data.name,
          data.status,
          data.tournament_type,
          data.start_date,
          data.end_date
        )
      : null;
  }

  /** Создать турнир */
  static async create(params: {
    name: string;
    tournament_type: "single" | "double" | "pyramid" | "roundrobin";
    start_date: string | null;
    end_date: string | null;
    status: "draft" | "ongoing" | "finished";
  }): Promise<void> {
    const { error } = await supabase.from("tournaments").insert([params]);

    if (error) {
      console.error("Ошибка при создании турнира:", error);
      throw error;
    }
  }

  /** Удалить турнир */
  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from("tournaments").delete().eq("id", id);
    if (error) console.error("Ошибка удаления турнира:", error);
  }

  /** Загрузить участников турнира */
  static async loadParticipants(
    tournamentId: number
  ): Promise<Participant[]> {
    const { data, error } = await supabase
      .from("tournament_participants")
      .select(`
        id,
        level,
        position,
        players ( id, name, ntrp, phone, sex ),
        teams (
          id,
          name,
          player1:players!teams_player1_id_fkey ( id, name, ntrp, phone, sex ),
          player2:players!teams_player2_id_fkey ( id, name, ntrp, phone, sex )
        )
      `)
      .eq("tournament_id", tournamentId);

    if (error) {
      console.error("Ошибка загрузки участников для турнира:", tournamentId, error);
      return [];
    }

    return (data ?? []).map((row: any) => {
      let player: Player | undefined;
      let team: Team | undefined;

      if (row.players) {
        player = new Player({
          id: row.players.id,
          name: row.players.name,
          ntrp: row.players.ntrp,
          phone: row.players.phone,
          sex: row.players.sex,
        });
      }

      if (row.teams) {
        const t = row.teams as {
          id: number;
          name: string;
          team_players: { players: Player }[];
        };

        const teamPlayers =
          (t.team_players ?? []).map(
            (tp) =>
              new Player({
                id: tp.players.id,
                name: tp.players.name,
                ntrp: tp.players.ntrp,
                phone: tp.players.phone,
                sex: tp.players.sex,
              })
          ) ?? [];

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

  /** Добавить игрока */
  static async addPlayer(
    tournamentId: number,
    playerId: number,
    level: number
  ) {
    const { error } = await supabase
      .from("tournament_participants")
      .insert({ tournament_id: tournamentId, player_id: playerId, level });

    if (error) console.error("Ошибка добавления игрока:", error);
  }

  /** Добавить команду */
  static async addTeam(
    tournamentId: number,
    teamId: number,
    level: number
  ) {
    const { error } = await supabase
      .from("tournament_participants")
      .insert({ tournament_id: tournamentId, team_id: teamId, level });

    if (error) console.error("Ошибка добавления команды:", error);
  }

  /** Удалить участника */
  static async removeParticipant(id: number) {
    const { error } = await supabase
      .from("tournament_participants")
      .delete()
      .eq("id", id);

    if (error) console.error("Ошибка удаления участника:", error);
  }
}