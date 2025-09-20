import { supabase } from "@/lib/supabaseClient";
import { Match, PhaseType } from "../models/Match"; // PhaseType — уже у вас есть
import { Player } from "../models/Player";
import { Team } from "../models/Team";
import { Tournament } from "../models/Tournament";

export class MatchRepository {

  // ------------------------------ utils ------------------------------

  /** Единая функция маппинга строки БД -> доменная модель Match */
  private static mapRowToMatch(row: any): Match {
    const player1 = row.player1 ? new Player(row.player1) : undefined;
    const player2 = row.player2 ? new Player(row.player2) : undefined;

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
          row.tournaments.creator_id,
          row.tournaments.slug,
          row.tournaments.settings
        )
      : undefined;

    const match = new Match(
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

    // NEW: прокидываем фазовые поля в модель (если у вас они опциональные)
    (match as any).phase = row.phase as PhaseType | undefined;          // 'group' | 'playoff'
    (match as any).groupIndex = row.group_index ?? null;                 // number | null
    (match as any).roundIndex = row.round_index ?? null;                 // number | null

    return match;
  }

  // ------------------------------ create ------------------------------

  /**
   * Сохранение матча в БД
   * NEW: добавлены параметры phase/groupIndex/roundIndex (опциональные)
   */
  static async addMatch(
    date: Date,
    type: "single" | "double",
    scores: [number, number][],
    player1Id: number | null,
    player2Id: number | null,
    team1Id: number | null,
    team2Id: number | null,
    tournamentId: number,
    opts?: {
      phase?: PhaseType;           // NEW
      groupIndex?: number | null;  // NEW
      roundIndex?: number | null;  // NEW
    }
  ): Promise<number> {
    const payload: any = {
      match_type: type,
      scores,
      tournament_id: tournamentId,
      player1_id: player1Id,
      player2_id: player2Id,
      team1_id: team1Id,
      team2_id: team2Id,
      date,
    };

    // NEW: доп. поля фазы
    if (opts?.phase) payload.phase = opts.phase;
    if (opts?.groupIndex !== undefined) payload.group_index = opts.groupIndex;
    if (opts?.roundIndex !== undefined) payload.round_index = opts.roundIndex;

    const { data, error } = await supabase
      .from("matches")
      .insert([payload])
      .select("id")
      .single();

    if (error) throw error;
    return data.id as number;
  }

  // ------------------------------ read: all ------------------------------

  static async loadAll(): Promise<Match[]> {
    const { data, error } = await supabase
      .from("matches")
      .select(`
        id,
        date,
        scores,
        match_type,
        tournament_id,
        phase,
        group_index,
        round_index,
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
      .order("date", { ascending: false })
      .order("id", { ascending: false });

    if (error) {
      console.error("Ошибка загрузки матчей:", error);
      return [];
    }

    return (data ?? []).map((row: any) => this.mapRowToMatch(row));
  }
    
  static async loadByPlayerId(playerId: number): Promise<Match[]> {
    // 1) найдём все команды, в которых состоит игрок
    const { data: teams, error: teamErr } = await supabase
      .from("teams")
      .select("id")
      .or(`player1_id.eq.${playerId},player2_id.eq.${playerId}`);

    if (teamErr) {
      console.error("loadByPlayerId: ошибка загрузки команд игрока:", teamErr);
      return [];
    }

    const teamIds = (teams ?? []).map((t) => t.id as number);

    // 2) соберём OR-фильтр:
    // - одиночки: player1_id == playerId OR player2_id == playerId
    // - пары: team1_id IN (teamIds) OR team2_id IN (teamIds)
    const orParts: string[] = [
      `player1_id.eq.${playerId}`,
      `player2_id.eq.${playerId}`,
    ];

    if (teamIds.length > 0) {
      // PostgREST синтаксис IN: column.in.(1,2,3)
      const inList = `(${teamIds.join(",")})`;
      orParts.push(`team1_id.in.${inList}`);
      orParts.push(`team2_id.in.${inList}`);
    }

    const { data, error } = await supabase
      .from("matches")
      .select(`
        id,
        date,
        scores,
        match_type,
        tournament_id,
        phase,
        group_index,
        round_index,
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
      .or(orParts.join(","))
      .order("date", { ascending: false })
      .order("id", { ascending: false });

    if (error) {
      console.error("loadByPlayerId: ошибка загрузки матчей:", error);
      return [];
    }

    return (data ?? []).map((row: any) => this.mapRowToMatch(row));
  }
  
  // ------------------------------ read: by tournament ------------------------------

  static async loadMatchesForTournament(tournamentId: number): Promise<Match[]> {
    const { data, error } = await supabase
      .from("matches")
      .select(`
        id,
        date,
        scores,
        match_type,
        tournament_id,
        phase,
        group_index,
        round_index,
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
      .order("date", { ascending: false })
      .order("id", { ascending: false })
      .eq("tournament_id", tournamentId);

    if (error) {
      console.error("Ошибка загрузки матчей:", error);
      return [];
    }

    return (data ?? []).map((row: any) => this.mapRowToMatch(row));
  }

  // ------------------------------ read: by club ------------------------------

  static async loadMatchesForClub(clubId: number): Promise<Match[]> {
    const { data, error } = await supabase
      .from("matches")
      .select(`
        id,
        date,
        scores,
        match_type,
        tournament_id,
        phase,
        group_index,
        round_index,
        tournaments!inner ( * ),
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
      .eq("tournaments.club_id", clubId)
      .order("date", { ascending: false })
      .order("id", { ascending: false });

    if (error) {
      console.error("Ошибка загрузки матчей клуба:", error);
      return [];
    }

    return (data ?? []).map((row: any) => this.mapRowToMatch(row));
  }

  // ------------------------------ read: by id ------------------------------

  static async loadMatchById(matchId: number): Promise<Match | null> {
    const { data, error } = await supabase
      .from("matches")
      .select(`
        id,
        date,
        scores,
        match_type,
        tournament_id,
        phase,
        group_index,
        round_index,
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

    // В этом методе у вас ранее были массивы [0], но при таком select supabase обычно возвращает объекты.
    // Если у вас реально приходят массивы — верните старую логику. Ниже — через общий маппер:
    return this.mapRowToMatch(data);
  }

  // ------------------------------ update ------------------------------


// если у тебя уже есть этот маппер — используй свой
// здесь просто напоминаю сигнатуру
// private static mapRowToMatch(row: any): Match { ... }

static async updateMatch(updatedMatch: Match): Promise<Match> {
  // 1) Быстрая валидация входных данных
  const matchId = (updatedMatch as any)?.id;
  if (!matchId || typeof matchId !== "number") {
    throw new Error("updateMatch: invalid match id");
  }

  // 2) Формируем payload. Аккуратно сериализуем дату: если уже строка — не трогаем
  const isoDate =
    updatedMatch.date instanceof Date
      ? updatedMatch.date.toISOString()
      : new Date(updatedMatch.date as unknown as string).toISOString();

  const payload: any = {
    date: isoDate,
    scores: updatedMatch.scores,
    player1_id: updatedMatch.player1?.id ?? null,
    player2_id: updatedMatch.player2?.id ?? null,
    team1_id: (updatedMatch as any).team1?.id ?? null,
    team2_id: (updatedMatch as any).team2?.id ?? null,
  };

  // 3) Фазовые поля — только если явно заданы в объекте
  const phase       = (updatedMatch as any).phase as PhaseType | undefined;
  const groupIndex  = (updatedMatch as any).groupIndex as number | null | undefined;
  const roundIndex  = (updatedMatch as any).roundIndex as number | null | undefined;

  if (phase !== undefined)       payload.phase        = phase;
  if (groupIndex !== undefined)  payload.group_index  = groupIndex;
  if (roundIndex !== undefined)  payload.round_index  = roundIndex;

  // 4) Обновляем и сразу читаем полную строку для маппинга в доменную модель
  const { data, error } = await supabase
    .from("matches")
    .update(payload)
    .eq("id", matchId)
    .select(`
      id,
      date,
      scores,
      match_type,
      tournament_id,
      phase,
      group_index,
      round_index,
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
    .single();

  if (error) {
    // кидаем ошибку — наверху ты либо покажешь alert, либо сделаешь silent reload
    throw new Error(`updateMatch: ${error.message ?? "supabase error"}`);
  }
  if (!data) {
    throw new Error("updateMatch: empty response");
  }

  // 5) Маппим и возвращаем строго Match
  return this.mapRowToMatch(data);
}

  // ------------------------------ delete ------------------------------

  static async deleteMatch(match: Match): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("matches")
        .delete()
        .eq("id", (match as any).id);

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
        console.error("Ошибка при удалении матчей турнира:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Неожиданная ошибка deleteTournamentMatches:", err);
      return false;
    }
  }

  // ------------------------------ misc business logic ------------------------------

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
      { id: winner.id, level: loser.level, position: loser.position },
      { id: loser.id, level: winner.level, position: winner.position },
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
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("Ошибка подсчёта матчей:", error);
      return 0;
    }
    return count ?? 0;
  }

  /** Количество матчей по турниру */
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
