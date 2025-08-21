import { supabase } from "@/lib/supabaseClient";
import { Tournament } from "@/app/models/Tournament";

import { Participant } from "@/app/models/Participant";
import { TournamentCreateInput } from "@/app/models/Tournament";
import { Player } from "@/app/models/Player";
import { Team } from "@/app/models/Team";
import { UsersRepository } from "./UsersRepository";
import { PlayersRepository } from "./PlayersRepository";

export class TournamentsRepository {
  /** Загрузить все турниры */
  static async loadAll(): Promise<Tournament[]> {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .order("start_date", { ascending: true }); // true = по возрастанию, false = по убыванию

    if (error) {
      console.error("Ошибка загрузки турниров:", error);
      return [];
    }

    console.log("TournamentsRepository-loadAll:", data);

    return (data ?? []).map(
      (row: Tournament) =>
        new Tournament(
          Number(row.id),
          row.name,
          row.format,
          row.status,
          row.tournament_type,
          row.start_date,
          row.end_date,
          row.is_public,
          row.creator_id
        )
    );
  }

/** Вернуть турниры, доступные пользователю согласно его роли */
static async loadAccessible(userId: number | undefined, userRole: string | undefined): Promise<Tournament[]> {
  // --- 0. Гости: видят только публичные турниры
  if (userId === undefined || userRole === undefined) {
    const { data, error } = await supabase
      .from("tournaments")
      .select("id, name, format, status, tournament_type, start_date, end_date, is_public")
      .eq("is_public", true)
      .order("start_date", { ascending: true });

    if (error) {
      console.error("Ошибка загрузки публичных турниров (гость):", error);
      return [];
    }

    console.log("TournamentsRepository-loadAccessible:", userId, data);

    return (data ?? []).map(
      (row: any) =>
        new Tournament(
          Number(row.id),
          row.name,
          row.format,
          row.status,
          row.tournament_type,
          row.start_date,
          row.end_date,
          row.is_public,
          row.creator_id
        )
    );
  }

  // --- 1. Авторизованные пользователи
  const role = userRole;

  // Сайт-админ: все турниры
  if (role === "site_admin") {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) {
      console.error("Ошибка загрузки всех турниров:", error);
      return [];
    }

    return (data ?? []).map(
      (row: any) =>
        new Tournament(
          Number(row.id),
          row.name,
          row.format,
          row.status,
          row.tournament_type,
          row.start_date,
          row.end_date,
          row.is_public,
          row.creator_id
        )
    );
  }

  // Админ турниров: только свои + публичные
  if (role === "tournament_admin") {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .or(`creator_id.eq.${userId},is_public.eq.true`)
      .order("start_date", { ascending: true });

    if (error) {
      console.error("Ошибка загрузки турниров организатора:", error);
      return [];
    }

    return (data ?? []).map(
      (row: any) =>
        new Tournament(
          Number(row.id),
          row.name,
          row.format,
          row.status,
          row.tournament_type,
          row.start_date,
          row.end_date,
          row.is_public,
          row.creator_id
        )
    );
  }

  // Игрок: участвует лично или в команде + публичные
  if (role === "player") {
    const player = await PlayersRepository.findByUserId(userId);
    if (!player) return [];

    const personal = await TournamentsRepository.findTournamentsForPlayer(player.id);

    // плюс добираем публичные
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .eq("is_public", true);

    if (error) {
      console.error("Ошибка загрузки публичных турниров:", error);
    }

    const publicOnes = (data ?? []).map(
      (row: any) =>
        new Tournament(
          Number(row.id),
          row.name,
          row.format,
          row.status,
          row.tournament_type,
          row.start_date,
          row.end_date,
          row.is_public,
          row.creator_id
        )
    );

    // объединяем без дубликатов
    const all = [...personal, ...publicOnes];
    const unique = new Map(all.map((t) => [t.id, t]));
    return Array.from(unique.values()).sort(
      (a, b) =>
        new Date(a.start_date as any).getTime() -
        new Date(b.start_date as any).getTime()
    );
  }

  // если роль неизвестна → только публичные
  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .eq("is_public", true)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Ошибка загрузки публичных турниров (неизвестная роль):", error);
    return [];
  }

  return (data ?? []).map(
    (row: any) =>
      new Tournament(
        Number(row.id),
        row.name,
        row.format,
        row.status,
        row.tournament_type,
        row.start_date,
        row.end_date,
        row.is_public,
        row.creator_id
      )
  );
}

  /** Получить турнир по ID */
  static async getTournamentById(id: number): Promise<Tournament | null> {
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
          data.format,
          data.status,
          data.tournament_type,
          data.start_date,
          data.end_date,
          data.is_public,
          data.creator_id
        )
      : null;
  }

  /** Создать турнир */
  static async create(input: TournamentCreateInput): Promise<Tournament> {
    const { data, error } = await supabase
      .from("tournaments")
      .insert([input])
      .select()
      .single();

    if (error) throw error;

    return new Tournament(
      data.id,
      data.name,
      data.format,
      data.status,
      data.tournament_type,
      data.start_date,
      data.end_date,
      data.creator_id,
      data.is_public
    );
  }

  /** Удалить турнир */
  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from("tournaments").delete().eq("id", id);
    if (error) console.error("Ошибка удаления турнира:", error);
  }

  /** Загрузить участников турнира */
static async loadParticipants(tournamentId: number): Promise<Participant[]> {
  const { data, error } = await supabase
    .from("tournament_participants")
    .select(`
      id,
      level,
      position,
      players ( id, name, ntrp, phone, sex ),
      teams (
        id,
        player1:players!teams_player1_id_fkey ( id, name, ntrp, phone, sex ),
        player2:players!teams_player2_id_fkey ( id, name, ntrp, phone, sex )
      )
    `)
    .eq("tournament_id", tournamentId);

  if (error) {
    console.error("Ошибка загрузки участников:", error);
    return [];
  }

  return (data as unknown as any[]).map((row): Participant => {
    let player: Player | undefined;
    let team: Team | undefined;

    // --- игрок ---
    if (row.players) {
      player = new Player({
        id: row.players.id,
        name: row.players.name,
        ntrp: row.players.ntrp,
        phone: row.players.phone,
        sex: row.players.sex,
      });
    }

    // --- команда ---
    if (row.teams) {
      const t = row.teams; // первая команда

      const teamPlayer1 = t.player1
        ? new Player({
            id: t.player1.id,
            name: t.player1.name,
            ntrp: t.player1.ntrp,
            phone: t.player1.phone,
            sex: t.player1.sex,
          })
        : undefined;

      const teamPlayer2 = t.player2
        ? new Player({
            id: t.player2.id,
            name: t.player2.name,
            ntrp: t.player2.ntrp,
            phone: t.player2.phone,
            sex: t.player2.sex,
          })
        : undefined;

      if (teamPlayer1 && teamPlayer2) {
        team = new Team(t.id, teamPlayer1, teamPlayer2);
      }
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
    playerId: number
  ) {
    const { error } = await supabase
      .from("tournament_participants")
      .insert({ tournament_id: tournamentId, player_id: playerId });

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

  static async updatePosition(part: Participant) {
      const { error } = await supabase
      .from("tournament_participants")
      .update({
        level: part.level ?? null,
        position: part.position,
      })
      .eq("id", part.id);

    if (error) {
      console.error("Ошибка обновления:", error);
    }
  }

  static async updatePositions(parts: Participant[]) {
    if (parts.length === 0) return;

    // формируем массив объектов для апдейта
    const updates = parts.map((p) => ({
      id: p.id,
      level: p.level ?? null,
      position: p.position,
    }));

    const { error } = await supabase
      .from("tournament_participants")
      .upsert(updates, { onConflict: "id" }); // 🔥 обновление по id

    if (error) {
      console.error("Ошибка массового обновления:", error);
    }
  }

  static async loadStats(tournamentIds: number[]) {
    type PRow = { tournament_id: number; participants: number };
    type MRow = { tournament_id: number; matches: number };

    const [{ data: p, error: pErr }, { data: m, error: mErr }] = await Promise.all([
      supabase
        .from("participants_count_by_tournament")
        .select("tournament_id, participants")
        .in("tournament_id", tournamentIds),
      supabase
        .from("matches_count_by_tournament")
        .select("tournament_id, matches")
        .in("tournament_id", tournamentIds),
    ]);

    if (pErr) console.error(pErr);
    if (mErr) console.error(mErr);

    const res: Record<number, { participants: number; matches: number }> = {};
    tournamentIds.forEach((id) => (res[id] = { participants: 0, matches: 0 }));

    (p as PRow[] | null)?.forEach((r) => (res[r.tournament_id].participants = r.participants));
    (m as MRow[] | null)?.forEach((r) => (res[r.tournament_id].matches = r.matches));

    return res;
  }

  /**
   * Вернуть турниры, в которых участвует игрок — как одиночка (player_id),
   * так и в составе пары (team_id, где player1_id или player2_id = playerId).
   */
  static async findTournamentsForPlayer(playerId: number): Promise<Tournament[]> {
    try {
      // 1) Все команды, где участвует игрок
      const { data: teamRows, error: teamErr } = await supabase
        .from("teams")
        .select("id")
        .or(`player1_id.eq.${playerId},player2_id.eq.${playerId}`);

      if (teamErr) {
        console.error("Ошибка загрузки команд игрока:", teamErr);
        return [];
      }

      const teamIds = (teamRows ?? []).map((r) => r.id as number);

      // 2) Все участники турниров, где player_id = игрок
      const { data: directParts, error: dirErr } = await supabase
        .from("tournament_participants")
        .select("tournament_id")
        .eq("player_id", playerId);

      if (dirErr) {
        console.error("Ошибка загрузки участий игрока:", dirErr);
        return [];
      }

      // 3) Все участники турниров, где team_id ∈ команд игрока (если команды есть)
      let teamParts: { tournament_id: number | null }[] = [];
      if (teamIds.length > 0) {
        const resp = await supabase
          .from("tournament_participants")
          .select("tournament_id")
          .in("team_id", teamIds);
        if (resp.error) {
          console.error("Ошибка загрузки участий команды игрока:", resp.error);
          return [];
        }
        teamParts = resp.data ?? [];
      }

      // 4) Уникальные id турниров
      const ids = new Set<number>();
      (directParts ?? []).forEach((r) => r.tournament_id != null && ids.add(r.tournament_id));
      teamParts.forEach((r) => r.tournament_id != null && ids.add(r.tournament_id));

      const tournamentIds = Array.from(ids);
      if (tournamentIds.length === 0) return [];

      // 5) Подтянуть сами турниры
      const { data, error} = await supabase
        .from("tournaments")
        .select(
          "*"
        )
        .in("id", tournamentIds)
        .order("start_date", { ascending: false });

      if (error) {
        console.error("Ошибка загрузки турниров по списку id:", error);
        return [];
      }

      return (data ?? []).map(
        (row: Tournament) =>
          new Tournament(
            Number(row.id),
            row.name,
            row.format,
            row.status,
            row.tournament_type,
            row.start_date,
            row.end_date,
            row.is_public,
            row.creator_id
          )
      );
    } catch (e) {
      console.error("Неожиданная ошибка findTournamentsForPlayer:", e);
      return [];
    }
  }
}