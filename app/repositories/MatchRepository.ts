import { supabase } from "@/lib/supabaseClient";
import { Match } from "../models/Match";
import { Player } from "../models/Player";
import { Team } from "../models/Team";
import { Tournament } from "../models/Tournament";

export class MatchRepository {

  // Сохранение матча в БД
  static async addMatch(
    date: Date,
    type: "single" | "double",
    scores: [number, number][],
    player1Id: number | null,
    player2Id: number | null,
    team1Id: number | null,
    team2Id: number | null,
    tournamentId: number
  ): Promise<number> {
    let newMatchId: number;

    const { data, error } = await supabase
      .from("matches")
      .insert([
        {
          match_type: type,
          scores,
          tournament_id: tournamentId,
          player1_id: player1Id,
          player2_id: player2Id,
          team1_id: team1Id,
          team2_id: team2Id,
          date,
        },
      ])
      .select("id")
      .single();

    if (error) throw error;
    newMatchId = data.id;
/*
    console.log("Меняем участников местами: ", team1PlayerIds, team2PlayerIds)
    const matchRes = Match.getWinnerId(scores,team1PlayerIds[0],team2PlayerIds[0]);
    this.processMatchResult(newMatchId, matchRes[0], matchRes[1]);
    console.log("==MatchRepository:Add match");*/
    return newMatchId;
  }

  static async loadAll(): Promise<Match[]> {
    const { data, error } = await supabase
      .from("matches")
      .select(`
        id,
        date,
        scores,
        match_type,
        tournament_id,
        tournaments (
          *
        ),
        player1:players!fk_player1(id, name, ntrp, phone, sex),
        player2:players!fk_player2(id, name, ntrp, phone, sex),
        team1:teams!fk_team1 (
          id,
          player1:players!teams_player1_id_fkey(id, name, ntrp, phone, sex),
          player2:players!teams_player2_id_fkey(id, name, ntrp, phone, sex)
        ),
        team2:teams!fk_team2 (
          id,
          player1:players!teams_player1_id_fkey(id, name, ntrp, phone, sex),
          player2:players!teams_player2_id_fkey(id, name, ntrp, phone, sex)
        )
      `);

    if (error) {
      console.error("Ошибка загрузки матчей:", error);
      return [];
    }

    return (data ?? []).map((row: any) => {
      const player1 = row.player1
        ? new Player(row.player1)
        : undefined;
      const player2 = row.player2
        ? new Player(row.player2)
        : undefined;

      const team1 = row.team1
        ? new Team(
            row.team1.id,
            new Player(row.team1.player1),
            new Player(row.team1.player2)
          )
        : undefined;

      const team2 = row.team2
        ? new Team(
            row.team2.id,
            new Player(row.team2.player1),
            new Player(row.team2.player2)
          )
        : undefined;

      const tournament = row.tournaments
        ? new Tournament(
            row.tournaments.id,
            row.tournaments.name,
            row.tournaments.format,
            row.tournaments.status,
            row.tournaments.tournament_type,
            row.tournaments.start_date,
            row.tournaments.end_date,
            row.tournaments.is_public,
            row.tournaments.creator_id
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

  static async loadMatches(tournamentId: number): Promise<Match[]> {
    const { data, error } = await supabase
      .from("matches")
      .select(`
        id,
        date,
        scores,
        match_type,
        tournament_id,
        tournaments (
          *
        ),
        player1:players!fk_player1(id, name, ntrp, phone, sex),
        player2:players!fk_player2(id, name, ntrp, phone, sex),
        team1:teams!fk_team1 (
          id,
          player1:players!teams_player1_id_fkey(id, name, ntrp, phone, sex),
          player2:players!teams_player2_id_fkey(id, name, ntrp, phone, sex)
        ),
        team2:teams!fk_team2 (
          id,
          player1:players!teams_player1_id_fkey(id, name, ntrp, phone, sex),
          player2:players!teams_player2_id_fkey(id, name, ntrp, phone, sex)
        )
      `)
      .order("date", {ascending: false})
      .order("id", {ascending: false})
      .eq("tournament_id", tournamentId);

    if (error) {
      console.error("Ошибка загрузки матчей:", error);
      return [];
    }

    return (data ?? []).map((row: any) => {
      const player1 = row.player1
        ? new Player(row.player1)
        : undefined;
      const player2 = row.player2
        ? new Player(row.player2)
        : undefined;

      const team1 = row.team1
        ? new Team(
            row.team1.id,
            new Player(row.team1.player1),
            new Player(row.team1.player2)
          )
        : undefined;

      const team2 = row.team2
        ? new Team(
            row.team2.id,
            new Player(row.team2.player1),
            new Player(row.team2.player2)
          )
        : undefined;

      const tournament = row.tournaments
        ? new Tournament(
            row.tournaments.id,
            row.tournaments.name,
            row.tournaments.format,
            row.tournaments.status,
            row.tournaments.tournament_type,
            row.tournaments.start_date,
            row.tournaments.end_date,
            row.tournaments.is_public,
            row.tournaments.creator_id
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
        tournaments ( * ),
        player1:players!fk_player1(id, name, ntrp, phone, sex),
        player2:players!fk_player2(id, name, ntrp, phone, sex),
        team1:teams!fk_team1 (
          id,
          player1:players!teams_player1_id_fkey(id, name, ntrp, phone, sex),
          player2:players!teams_player2_id_fkey(id, name, ntrp, phone, sex)
        ),
        team2:teams!fk_team2 (
          id,
          player1:players!teams_player1_id_fkey(id, name, ntrp, phone, sex),
          player2:players!teams_player2_id_fkey(id, name, ntrp, phone, sex)
        )
      `)
      .eq("id", matchId)
      .single();

    if (error) {
      console.error("Ошибка загрузки матча:", error);
      return null;
    }

    if (!data) return null;

    const player1 = data.player1 ? new Player(data.player1[0]) : undefined;
    const player2 = data.player2 ? new Player(data.player2[0]) : undefined;

    const team1 = data.team1
      ? new Team(
          data.team1[0].id,
          new Player(data.team1[0].player1[0]),
          new Player(data.team1[0].player2[0])
        )
      : undefined;

    const team2 = data.team2
      ? new Team(
          data.team2[0].id,
          new Player(data.team2[0].player1[0]),
          new Player(data.team2[0].player2[0])
        )
      : undefined;

    const tournament = data.tournaments
      ? new Tournament(
          data.tournaments[0].id,
          data.tournaments[0].name,
          data.tournaments[0].format,
          data.tournaments[0].status,
          data.tournaments[0].tournament_type,
          data.tournaments[0].start_date,
          data.tournaments[0].end_date,
          data.tournaments[0].creator_id,
          data.tournaments[0].is_public
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

  // обновление и удаление — без изменений
  static async updateMatch(updatedMatch: Match): Promise<Match | null> {
    try {
      const { data, error } = await supabase
        .from("matches")
        .update({
          date: updatedMatch.date.toISOString(),
          scores: updatedMatch.scores,
          player1_id:updatedMatch.player1?.id,
          player2_id:updatedMatch.player2?.id,
        })
        .eq("id", updatedMatch.id)
        .select();

      if (error) {
        console.error("Ошибка при обновлении матча:", error);
        return null;
      }
      return data?.[0] as Match;
    } catch (err) {
      console.error("Неожиданная ошибка updateMatch:", err);
      return null;
    }
  }

  static async deleteMatch(match: Match): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("matches")
        .delete()
        .eq("id", match.id);

      if (error) {
        console.error("Ошибка при удалении матча:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Неожиданная ошибка deleteMatch:", err);
      return false;
    }
  }

  static async deleteTournamentMatches(tournamentId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("matches")
        .delete()
        .eq("tournament_id", tournamentId);

      if (error) {
        console.error("Ошибка при удалении матча:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Неожиданная ошибка deleteMatch:", err);
      return false;
    }
  }


  static async processMatchResult(matchId: number, winnerId: number, loserId: number) {
    console.log(`✅ Игроки ${winnerId} и ${loserId} поменялись местами`);

    // Загружаем участников матча
    const { data: participants, error } = await supabase
      .from("tournament_participants")
      .select("*")
      .in("player_id", [winnerId, loserId]);

    if (error || !participants) {
      console.error("Ошибка загрузки участников после добавления матча:", error);
      return;
    }

    const winner = participants.find((p) => p.player_id === winnerId);
    const loser = participants.find((p) => p.player_id === loserId);

    if (!winner || !loser) {
      console.error("Не найдены игроки в пирамиде");
      return;
    }

    // Меняем местами уровни и позиции
    const updates = [
      {
        id: winner.id,
        level: loser.level,
        position: loser.position,
      },
      {
        id: loser.id,
        level: winner.level,
        position: winner.position,
      },
    ];

    const { error: updateError } = await supabase
      .from("tournament_participants")
      .upsert(updates);

    if (updateError) {
      console.error("Ошибка обновления уровней:", updateError);
    } else {
      console.log(`✅ Игроки ${winnerId} и ${loserId} поменялись местами`);
    }
  }

  /** Количество всех матчей в базе */
  static async countAll(): Promise<number> {
    const { count, error } = await supabase
      .from("matches")
      .select("id", { count: "exact", head: true }); // head:true — не тянуть строки

    if (error) {
      console.error("Ошибка подсчёта матчей:", error);
      return 0;
    }
    return count ?? 0;
  }

  /** Количество матчей для конкретного турнира */
  static async countByTournament(tournamentId: number): Promise<number> {
    const { count, error } = await supabase
      .from("matches")
      .select("id", { count: "exact", head: true })
      .eq("tournament_id", tournamentId);

    if (error) {
      console.error("Ошибка подсчёта матчей по турниру:", error);
      return 0;
    }
    return count ?? 0;
  }


}