import { supabase } from "@/lib/supabaseClient";
import {
  Tournament,
  TournamentFormat,
  TournamentStatus,
  TournamentType,
} from "@/app/models/Tournament";

import { Participant } from "@/app/models/Participant";
import { TournamentCreateInput } from "@/app/models/Tournament";
import { Player } from "@/app/models/Player";
import { Team } from "@/app/models/Team";
import { PlayersRepository } from "./PlayersRepository";
import { UserRole } from "../models/Users";
import { Club } from "@/app/models/Club";

/* ---------- Plain-типы ---------- */

export type TournamentPlain = {
  id: number;
  name: string;
  format: TournamentFormat | string;
  start_date: string | null;
  end_date: string | null;
  status: TournamentStatus | string;
  tournament_type: TournamentType | string;
  is_public: boolean;
  creator_id: number;
  slug: string;
  settings?: any;
  owner_token?: string | null;
  /** новый: связанный клуб (может быть null) */
  club: Club | null;
  regulation?: string | null;
};
export type TournamentPage = { // pagination result shape
  tournaments: Tournament[]; // page tournaments list
  total: number; // total tournaments count
}; // end TournamentPage
export type TournamentPagePlain = { // pagination result shape for server to client
  tournaments: TournamentPlain[]; // page tournaments list as plain objects
  total: number; // total tournaments count
}; // end TournamentPagePlain

/* ---------- Вспомогательный маппер ---------- */

function mapRowToTournament(row: any): Tournament {
  // Приводим строковые enum'ы из БД к нашим типам, где это необходимо
  const format = row.format as TournamentFormat;
  const status = row.status as TournamentStatus;
  const tournament_type = row.tournament_type as TournamentType;

  // row.club — объект из алиаса club:clubs(*), может быть undefined
  const club: Club | null = row.club ?? null;
  const ownerToken: string | null = row.owner_token ?? null;
  const regulation: string | null = row.regulation ?? null;

  return new Tournament(
    Number(row.id),
    row.name,
    format,
    status,
    tournament_type,
    row.start_date,
    row.end_date,
    row.is_public,
    row.creator_id ?? null,
    row.slug,
    club,
    row.settings,
    ownerToken,
    regulation
  );
}

function mapRowToTournamentPlain(row: any): TournamentPlain { // map db row to plain tournament
  return { // return plain object
    id: Number(row.id), // normalize id
    name: row.name, // tournament name
    format: row.format, // tournament format
    start_date: row.start_date, // tournament start date
    end_date: row.end_date, // tournament end date
    status: row.status, // tournament status
    tournament_type: row.tournament_type, // tournament type
    is_public: row.is_public, // visibility flag
    creator_id: row.creator_id ?? null, // creator id
    slug: row.slug, // slug string
    settings: row.settings, // settings payload
    owner_token: (row as any).owner_token ?? null, // owner token
    club: row.club ?? null, // club object
    regulation: (row as any).regulation ?? null, // regulation payload
  }; // end plain object
} // end mapRowToTournamentPlain

export class TournamentsRepository {
  static async loadParticipantsBySlug(slug: string) {
    const { data, error } = await supabase
      .from("tournaments")
      .select("id, participants:participants(*)")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return [];
    return (data as any).participants ?? [];
  }

  /** Получить plain по slug (теперь с club) */
  static async getBySlug(slug: string): Promise<TournamentPlain | null> {
    const { data, error } = await supabase
      .from("tournaments")
      .select(
        `
        id, name, format, start_date, end_date, status, tournament_type, is_public, creator_id, slug, settings, owner_token, regulation,
        club:clubs(*)
      `
      )
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("TournamentsRepository.getBySlug:", error);
      return null;
    }
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      format: data.format,
      start_date: data.start_date,
      end_date: data.end_date,
      status: data.status,
      tournament_type: data.tournament_type,
      is_public: data.is_public,
      creator_id: data.creator_id,
      slug: data.slug,
      settings: data.settings,
      owner_token: (data as any).owner_token ?? null,
      club: (data as any).club ?? null,
      regulation: (data as any).regulation ?? null,
    };
  }

  static async loadAllSlugs(): Promise<{ slug: string; updatedAt?: string }[]> {
    const { data, error } = await supabase
      .from("tournaments")
      .select("slug, updated_at")
      .eq("is_public", true);

    if (error) {
      console.error("TournamentsRepository.loadAllSlugs:", error);
      return [];
    }

    return (data ?? []).map((t: any) => ({
      slug: t.slug,
      updatedAt: t.updated_at,
    }));
  }

  /** Загрузить все турниры (с club) */
  static async loadAll(): Promise<Tournament[]> {
    const { data, error } = await supabase
      .from("tournaments")
      .select(`*, club:clubs(*)`)
      .order("start_date", { ascending: true });

    if (error) {
      console.error("Ошибка загрузки турниров:", error);
      return [];
    }

    return (data ?? []).map(mapRowToTournament);
  }

  /** Загрузить турниры постранично (с club) */
  static async loadPage( // entry for paginated list
    page: number, // current page
    pageSize: number, // page size
    clubId?: number // optional club filter
  ): Promise<TournamentPage> { // page result
    const safePage = Math.max(1, page); // guard against invalid pages
    const safePageSize = Math.max(1, pageSize); // guard against invalid page size
    const from = (safePage - 1) * safePageSize; // range start
    const to = from + safePageSize - 1; // range end
    let query = supabase // start supabase query
      .from("tournaments") // source table
      .select(`*, club:clubs(*)`, { count: "exact" }) // include club and total
      .order("start_date", { ascending: true }) // stable ordering
      .range(from, to); // apply range
    if (clubId) { // apply club filter when provided
      query = query.eq("club_id", clubId); // filter by club id
    } // end club filter
    const { data, error, count } = await query; // execute query
    if (error) { // handle query errors
      console.error("Ошибка загрузки турниров постранично:", error); // log error
      return { tournaments: [], total: 0 }; // return empty page
    } // end error handling
    const tournaments = (data ?? []).map((row) => ( // map rows into Tournament instances
      mapRowToTournament(row) // keep class instance for methods
    )); // end mapping
    return { tournaments, total: count ?? 0 }; // return page result
  } // end loadPage

  /** Загрузить турниры постранично для server components (plain objects) */
  static async loadPagePlain( // entry for paginated list (plain)
    page: number, // current page
    pageSize: number, // page size
    clubId?: number // optional club filter
  ): Promise<TournamentPagePlain> { // page result
    const safePage = Math.max(1, page); // guard against invalid pages
    const safePageSize = Math.max(1, pageSize); // guard against invalid page size
    const from = (safePage - 1) * safePageSize; // range start
    const to = from + safePageSize - 1; // range end
    let query = supabase // start supabase query
      .from("tournaments") // source table
      .select(`*, club:clubs(*)`, { count: "exact" }) // include club and total
      .order("start_date", { ascending: true }) // stable ordering
      .range(from, to); // apply range
    if (clubId) { // apply club filter when provided
      query = query.eq("club_id", clubId); // filter by club id
    } // end club filter
    const { data, error, count } = await query; // execute query
    if (error) { // handle query errors
      console.error("Ошибка загрузки турниров постранично (plain):", error); // log error
      return { tournaments: [], total: 0 }; // return empty page
    } // end error handling
    const tournaments = (data ?? []).map((row) => ( // map rows into plain objects
      mapRowToTournamentPlain(row) // plain mapping for server components
    )); // end mapping
    return { tournaments, total: count ?? 0 }; // return page result
  } // end loadPagePlain

  /** Загрузить турниры по клубу (с club) */
  static async loadByClub(clubId: number): Promise<Tournament[]> {
    const { data, error } = await supabase
      .from("tournaments")
      .select(`*, club:clubs(*)`)
      .eq("club_id", clubId)
      .order("start_date", { ascending: true });

    if (error) {
      console.error("Ошибка загрузки турниров:", error);
      return [];
    }

    return (data ?? []).map(mapRowToTournament);
  }

  /** Вернуть турниры, доступные пользователю согласно его роли (с club) */
  static async loadAccessible(
    userId: number | undefined,
    userRole: string | undefined
  ): Promise<Tournament[]> {
    // Гость
    if (userId === undefined || userRole === undefined) {
      const { data, error } = await supabase
        .from("tournaments")
        .select(`*, club:clubs(*)`)
        .order("start_date", { ascending: true });

      if (error) {
        console.error("Ошибка загрузки публичных турниров (гость):", error);
        return [];
      }
      return (data ?? []).map(mapRowToTournament);
    }

    const role = userRole;

    if (role === UserRole.SiteAdmin) {
      const { data, error } = await supabase
        .from("tournaments")
        .select(`*, club:clubs(*)`)
        .order("start_date", { ascending: true });

      if (error) {
        console.error("Ошибка загрузки всех турниров:", error);
        return [];
      }
      return (data ?? []).map(mapRowToTournament);
    }

    if (role === UserRole.TournamentAdmin) {
      const { data, error } = await supabase
        .from("tournaments")
        .select(`*, club:clubs(*)`)
        .order("start_date", { ascending: true });

      if (error) {
        console.error("Ошибка загрузки турниров организатора:", error);
        return [];
      }
      return (data ?? []).map(mapRowToTournament);
    }

    if (role === UserRole.Player) {
      const player = await PlayersRepository.findByUserId(userId);
      if (!player) return [];

      const personal = await TournamentsRepository.findTournamentsForPlayer(
        player.id
      );

      const { data, error } = await supabase
        .from("tournaments")
        .select(`*, club:clubs(*)`)
        .eq("is_public", true);

      if (error) {
        console.error("Ошибка загрузки публичных турниров:", error);
      }

      const publicOnes = (data ?? []).map(mapRowToTournament);

      const all = [...personal, ...publicOnes];
      const unique = new Map(all.map((t) => [t.id, t]));
      return Array.from(unique.values()).sort(
        (a, b) =>
          new Date(a.start_date as any).getTime() -
          new Date(b.start_date as any).getTime()
      );
    }

    // неизвестная роль — только публичные
    const { data, error } = await supabase
      .from("tournaments")
      .select(`*, club:clubs(*)`)
      .eq("is_public", true)
      .order("start_date", { ascending: true });

    if (error) {
      console.error(
        "Ошибка загрузки публичных турниров (неизвестная роль):",
        error
      );
      return [];
    }

    return (data ?? []).map(mapRowToTournament);
  }

  /** Получить турнир по ID (с club) */
  static async getTournamentById(id: number): Promise<Tournament | null> {
    const { data, error } = await supabase
      .from("tournaments")
      .select(`*, club:clubs(*)`)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Ошибка getTournamentById:", error);
      return null;
    }

    return data ? mapRowToTournament(data) : null;
  }

  /** Создать турнир — возвращаем с club (если БД вернёт) */
  static async createNewTournament(input: TournamentCreateInput): Promise<Tournament> {
    const payload = normalizeTournamentCreateInput(input);

    const { data, error } = await supabase
      .from("tournaments")
      .insert([payload])
      .select(`*, club:clubs(*)`) // подтягиваем связанный клуб
      .single();

    if (error) throw error;

    return mapRowToTournament(data);
  }

  /** Удалить турнир */
  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from("tournaments").delete().eq("id", id);
    if (error) console.error("Ошибка удаления турнира:", error);
  }

  /** Обновить статус турнира */
  static async updateStatus(id: number, status: TournamentStatus): Promise<Tournament | null> {
    const { data, error } = await supabase
      .from("tournaments")
      .update({ status })
      .eq("id", id)
      .select(`*, club:clubs(*)`)
      .maybeSingle();

    if (error) throw error;
    return data ? mapRowToTournament(data) : null;
  }

  /** Обновить регламент турнира */
  static async updateRegulation(id: number, regulation: string | null): Promise<Tournament | null> {
    const { data, error } = await supabase
      .from("tournaments")
      .update({ regulation })
      .eq("id", id)
      .select(`*, club:clubs(*)`)
      .maybeSingle();

    if (error) throw error;
    return data ? mapRowToTournament(data) : null;
  }

  /** Загрузить участников турнира (без изменений) */
  static async loadParticipants(tournamentId: number): Promise<Participant[]> {
    const { data, error } = await supabase
      .from("tournament_participants")
      .select(
        `
        id,
        level,
        position,
        players ( id, name, ntrp, phone, sex ),
        teams (
          id,
          player1:players!teams_player1_id_fkey ( id, name, ntrp, phone, sex ),
          player2:players!teams_player2_id_fkey ( id, name, ntrp, phone, sex )
        )
      `
      )
      .eq("tournament_id", tournamentId);

    if (error) {
      console.error("Ошибка загрузки участников:", error);
      return [];
    }

    return (data as unknown as any[]).map((row): Participant => {
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
        const t = row.teams;
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
  static async addPlayer(tournamentId: number, playerId: number) {
    const { error } = await supabase
      .from("tournament_participants")
      .insert({ tournament_id: tournamentId, player_id: playerId });
    if (error) console.error("Ошибка добавления игрока:", error);
  }

  /** Добавить команду */
  static async addTeam(tournamentId: number, teamId: number) {
    const { error } = await supabase
      .from("tournament_participants")
      .insert({ tournament_id: tournamentId, team_id: teamId });
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

  /** Обновить позицию одного участника */
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

  /** Массовое обновление позиций */
  static async updatePositions(parts: Participant[]) {
    if (parts.length === 0) return;
    const updates = parts.map((p) => ({
      id: p.id,
      level: p.level ?? null,
      position: p.position,
    }));
    const { error } = await supabase
      .from("tournament_participants")
      .upsert(updates, { onConflict: "id" });
    if (error) {
      console.error("Ошибка массового обновления:", error);
    }
  }

  static async updateGroupsAssignments(
    tournamentId: number,
    settings: Record<string, any> | null | undefined,
    assignments: Record<number, number>
  ): Promise<Record<string, any>> {
    const normalizedAssignments: Record<string, number> = {};
    Object.entries(assignments).forEach(([key, value]) => {
      const id = Number(key);
      if (!Number.isNaN(id) && typeof value === "number") {
        normalizedAssignments[String(id)] = value;
      }
    });

    const currentSettings = settings ? { ...settings } : {};
    const groupsSettings = {
      ...(currentSettings.groupsplayoff ?? {}),
      assignments: normalizedAssignments,
    };

    const nextSettings = {
      ...currentSettings,
      groupsplayoff: groupsSettings,
    };

    const { error } = await supabase
      .from("tournaments")
      .update({ settings: nextSettings })
      .eq("id", tournamentId);

    if (error) {
      console.error("Ошибка обновления распределения по группам:", error);
      throw error;
    }

    return nextSettings;
  }

  /** Счётчики */
  static async loadStats(tournamentIds: number[]) {
    console.debug("TournamentsRepository.loadStats: request", {
      tournamentIds,
    });
    type PRow = {
      tournament_id: number;
      participants?: number | null;
      participants_count?: number | null;
    };
    type MRow = {
      tournament_id: number;
      matches?: number | null;
      matches_count?: number | null;
    };

    const [{ data: p, error: pErr }, { data: m, error: mErr }] =
      await Promise.all([
        supabase
          .from("participants_count_by_tournament")
          .select("*")
          .in("tournament_id", tournamentIds),
        supabase
          .from("matches_count_by_tournament")
          .select("*")
          .in("tournament_id", tournamentIds),
      ]);

    if (pErr) console.error("loadStats participants_count_by_tournament error:", pErr);
    if (mErr) console.error("loadStats matches_count_by_tournament error:", mErr);
    console.debug("TournamentsRepository.loadStats: raw response", {
      participantsRows: p?.length ?? 0,
      matchesRows: m?.length ?? 0,
    });

    const res: Record<number, { participants: number; matches: number }> = {};
    tournamentIds.forEach((id) => (res[id] = { participants: 0, matches: 0 }));

    (p as PRow[] | null)?.forEach((r) => {
      const participants = r.participants ?? r.participants_count ?? 0;
      res[r.tournament_id].participants = participants;
    });
    (m as MRow[] | null)?.forEach((r) => {
      const matches = r.matches ?? r.matches_count ?? 0;
      res[r.tournament_id].matches = matches;
    });
    return res;
  }

  /** Турниры игрока (лично/в командах) — тоже возвращаем с club */
  static async findTournamentsForPlayer(playerId: number): Promise<Tournament[]> {
    try {
      const { data: teamRows, error: teamErr } = await supabase
        .from("teams")
        .select("id")
        .or(`player1_id.eq.${playerId},player2_id.eq.${playerId}`);
      if (teamErr) {
        console.error("Ошибка загрузки команд игрока:", teamErr);
        return [];
      }
      const teamIds = (teamRows ?? []).map((r) => r.id as number);

      const { data: directParts, error: dirErr } = await supabase
        .from("tournament_participants")
        .select("tournament_id")
        .eq("player_id", playerId);
      if (dirErr) {
        console.error("Ошибка загрузки участий игрока:", dirErr);
        return [];
      }

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

      const ids = new Set<number>();
      (directParts ?? []).forEach(
        (r) => r.tournament_id != null && ids.add(r.tournament_id)
      );
      teamParts.forEach(
        (r) => r.tournament_id != null && ids.add(r.tournament_id)
      );

      const tournamentIds = Array.from(ids);
      if (tournamentIds.length === 0) return [];

      const { data, error } = await supabase
        .from("tournaments")
        .select(`*, club:clubs(*)`)
        .in("id", tournamentIds)
        .order("start_date", { ascending: false });
      if (error) {
        console.error("Ошибка загрузки турниров по списку id:", error);
        return [];
      }

      return (data ?? []).map(mapRowToTournament);
    } catch (e) {
      console.error("Неожиданная ошибка findTournamentsForPlayer:", e);
      return [];
    }
  }

  /** Количество всех турниров в базе */
  static async countAll(): Promise<number> {
    const { count, error } = await supabase.from("tournaments").select("id", {
      count: "exact",
      head: true,
    });
    if (error) {
      console.error("Ошибка подсчёта турниров:", error);
      return 0;
    }
    return count ?? 0;
  }

  // === RPC ===
  static async addMatchAndMaybeSwap(params: {
    tournamentId: number;
    isSingle: boolean;
    aId: number;
    bId: number;
    winnerId: number | null;
    loserId: number | null;
    scores: any;
    comment?: string | null; // текстовый комментарий к матчу
    date: Date;
    phase?: string | null;
    groupIndex?: number | null;
    roundIndex?: number | null;
    doSwap: boolean;
  }) {
    const { data, error } = await supabase.rpc("api_add_match_and_maybe_swap", {
      _tournament_id: params.tournamentId,
      _is_single: params.isSingle,
      _a_id: params.aId,
      _b_id: params.bId,
      _winner_id: params.winnerId,
      _loser_id: params.loserId,
      _scores: params.scores,
      _comment: params.comment ?? null,
      _date: params.date.toISOString(),
      _phase: params.phase ?? null,
      _group_index: params.groupIndex ?? null,
      _round_index: params.roundIndex ?? null,
      _do_swap: params.doSwap,
    });
    if (error) throw error;
    const matchId = data?.[0]?.match_id as number | undefined;

    // Принудительно пробиваем комментарий, если RPC его не сохранил
    if (matchId && params.comment) {
      await supabase
        .from("matches")
        .update({ comment: params.comment })
        .eq("id", matchId);
    }

    return matchId;
  }
}

/** Преобразуем входной объект (с club) к payload для БД (с club_id) */
function normalizeTournamentCreateInput(input: TournamentCreateInput) {
  const club_id =
    input.club === null
      ? null
      : typeof (input.club as any)?.id === "number"
      ? (input.club as any).id
      : null;

  if (input.club && club_id == null) {
    console.warn("createNewTournament: передан club без корректного id, выставляю club_id = null");
  }

  // статус по умолчанию — Draft, если не передан
  const status = input.status ?? TournamentStatus.Draft;

  // Собираем payload для таблицы tournaments
  const payload = {
    name: input.name,
    format: input.format,
    tournament_type: input.tournament_type,
    start_date: input.start_date,
    end_date: input.end_date,
    status,
    creator_id: input.creator_id ?? null,
    owner_token: input.owner_token ?? null,
    is_public: input.is_public,
    club_id,              // <-- ключевое: вместо club кладём club_id
    settings: input.settings ?? null,
    regulation: input.regulation ?? null,
  };

  return payload;
}
