import { supabase } from "@/lib/supabaseClient";
import { Match } from "../models/Match";
import { Player } from "../models/Player";
import { Team } from "../models/Team";
import { Tournament } from "../models/Tournament";

export class MatchRepository {
  // Сохранение матча в БД
  static async saveMatch(
    date: Date,
    type: "single" | "double",
    scores: [number, number][],
    team1PlayerIds: number[],
    team2PlayerIds: number[],
    tournamentId: number
  ): Promise<number> {
    if (type === "single") {
      // одиночный матч
      const { data, error } = await supabase
        .from("matches")
        .insert([
          {
            match_type: type,
            scores,
            tournament_id: tournamentId,
            player1_id: team1PlayerIds[0], // первый игрок
            player2_id: team2PlayerIds[0], // второй игрок
            date: date, // дата текущая
          },
        ])
        .select("id")
        .single();

      if (error) throw error;
      return data.id;
    } else {
      // парный матч → создаём команды
      const { data: teams, error: teamErr } = await supabase
        .from("teams")
        .insert([{ name: "Team 1" }, { name: "Team 2" }])
        .select();

      if (teamErr) throw teamErr;

      const team1 = teams[0];
      const team2 = teams[1];

      // добавляем игроков в команды
      const teamPlayersInsert = [
        ...team1PlayerIds.map((pid) => ({
          team_id: team1.id,
          player_id: pid,
        })),
        ...team2PlayerIds.map((pid) => ({
          team_id: team2.id,
          player_id: pid,
        })),
      ];

      const { error: playersErr } = await supabase
        .from("team_players")
        .insert(teamPlayersInsert);

      if (playersErr) throw playersErr;

      // создаём матч
      const { data: match, error: matchErr } = await supabase
        .from("matches")
        .insert([
          {
            match_type: type,
            scores,
            tournament_id: tournamentId,
            team1_id: team1.id,
            team2_id: team2.id,
            date: new Date().toISOString(),
          },
        ])
        .select("id")
        .single();

      if (matchErr) throw matchErr;

      return match.id;
    }
  }

  static async loadAllMatches() {
    const { data, error } = await supabase
      .from("matches")
      .select("id, match_type, date, scores")
      .order("date", { ascending: false });

    if (error) {
      console.error("Ошибка загрузки матчей:", error);
      return [];
    }

    return (data ?? []).map((m) => ({
      id: m.id,
      type: m.match_type as "single" | "double",
      date: new Date(m.date),
      sets:
        typeof m.scores === "string"
          ? JSON.parse(m.scores)
          : m.scores ?? [],
    }));
  }

  static async loadMatches(tournamentId: number): Promise<Match[]> {
    const { data, error } = await supabase
      .from("matches")
      .select(`
        id,
        date,
        scores,
        match_type,
        tournament_id,
        tournaments ( id, name, start_date, end_date, tournament_type ),
        player1_id:players!fk_player1(id, name, ntrp, phone, sex),
        player2_id:players!fk_player2(id, name, ntrp, phone, sex),
        team1_id:teams!fk_team1 (
          id,
          name,
          team_players (
            players ( id, name, ntrp, phone, sex )
          )
        ),
        team2_id:teams!fk_team2 (
          id,
          name,
          team_players (
            players ( id, name, ntrp, phone, sex )
          )
        )
      `)
      .eq("tournament_id", tournamentId);

    if (error) {
      console.error("Ошибка загрузки матчей:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return []; // просто вернуть пустой массив, если нет матчей
    }

    return (data ?? []).map((row: any) => {
      const player1 = row.player1_id
        ? new Player(row.player1_id)
        : undefined;
      const player2 = row.player2_id
        ? new Player(row.player2_id)
        : undefined;

      const team1 = row.team1_id?.[0]
        ? new Team(
            row.team1_id[0].id,
            row.team1_id[0].name,
            new Player(row.team1_id[0].team_players?.[0]?.players),
            new Player(row.team1_id[0].team_players?.[1]?.players)
          )
        : undefined;

      const team2 = row.team2_id?.[0]
        ? new Team(
            row.team2_id[0].id,
            row.team2_id[0].name,
            new Player(row.team2_id[0].team_players?.[0]?.players),
            new Player(row.team2_id[0].team_players?.[1]?.players)
          )
        : undefined;

      // создаём Tournament из join-а
      const tournament = row.tournaments
        ? new Tournament(
            row.tournaments.id,
            row.tournaments.name,
            "draft",
            row.tournaments.tournament_type,
            row.tournaments.start_date,
            row.tournaments.end_date,
          )
        : undefined;

      return new Match(
        row.id,
        row.match_type,
        new Date(row.date),
        row.scores,
        tournament!,
        player1,
        player2,
        team1,
        team2
      );
    });
  }

  static async loadMatchById(matchId: number): Promise<Match | null> {
    const { data, error } = await supabase
      .from("matches")
      .select(`
        id,
        date,
        scores,
        match_type,
        tournament_id,
        tournaments ( id, name, start_date, end_date, tournament_type ),
        player1_id:players!fk_player1(id, name, ntrp, phone, sex),
        player2_id:players!fk_player2(id, name, ntrp, phone, sex),
        team1_id:teams!fk_team1 (
          id,
          name,
          team_players (
            players ( id, name, ntrp, phone, sex )
          )
        ),
        team2_id:teams!fk_team2 (
          id,
          name,
          team_players (
            players ( id, name, ntrp, phone, sex )
          )
        )
      `)
      .eq("id", matchId)
      .single(); // получаем одну запись

    if (error) {
      console.error("Ошибка загрузки матча:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    console.error("Loaded match:", data);

    const player1 = data.player1_id?.[0]
      ? new Player(data.player1_id[0])
      : undefined;
    const player2 = data.player2_id?.[0]
      ? new Player(data.player2_id[0])
      : undefined;

    const team1 = data.team1_id?.[0]
      ? new Team(
          data.team1_id[0].id,
          data.team1_id[0].name,
          new Player(data.team1_id[0].team_players?.[0]?.players[0]),
          new Player(data.team1_id[0].team_players?.[1]?.players[1])
        )
      : undefined;

    const team2 = data.team2_id?.[0]
      ? new Team(
          data.team2_id[0].id,
          data.team2_id[0].name,
          new Player(data.team2_id[0].team_players?.[0]?.players[0]),
          new Player(data.team2_id[0].team_players?.[1]?.players[1])
        )
      : undefined;

    const tournament = data.tournaments
      ? new Tournament(
          data.tournaments[0].id,
          data.tournaments[0].name,
          "draft",
          data.tournaments[0].tournament_type,
          data.tournaments[0].start_date,
          data.tournaments[0].end_date
        )
      : undefined;

    return new Match(
      data.id,
      data.match_type,
      new Date(data.date),
      data.scores,
      tournament!,
      player1,
      player2,
      team1,
      team2
    );
  }

  static async deleteMatch(id: number) {
    const { error } = await supabase.from("matches").delete().eq("id", id);
    if (error) console.error("Ошибка удаления матча:", error);
  }
}