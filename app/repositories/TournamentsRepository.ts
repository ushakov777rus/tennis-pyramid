import { supabase } from "@/lib/supabaseClient";
import { Tournament, TournamentFormat, TournamentStatus, TournamentType } from "@/app/models/Tournament";

import { Participant } from "@/app/models/Participant";
import { TournamentCreateInput } from "@/app/models/Tournament";
import { Player } from "@/app/models/Player";
import { Team } from "@/app/models/Team";
import { PlayersRepository } from "./PlayersRepository";
import { UserRole } from "../models/Users";
import { da } from "date-fns/locale";







export type TournamentPlain = {
  id: number;
  name: string;
  format: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  tournament_type: string;
  is_public: boolean;
  creator_id: number;
  slug: string;
  settings?: any;
};




export class TournamentsRepository {

  static async loadParticipantsBySlug(slug: string) {
    const { data, error } = await supabase
      .from("tournaments")
      .select("id, participants:participants(*)") // пример: джоин по slug
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return [];
    return data.participants;
  }

  static async getBySlug(slug: string): Promise<TournamentPlain | null> {
    const { data, error } = await supabase
      .from("tournaments")
      .select(
        "id, name, format, start_date, end_date, status, tournament_type, is_public, creator_id, slug, settings"
      )
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("TournamentsRepository.getBySlug:", error);
      return null;
    }
    if (!data) return null;

    // ВАЖНО: возвращаем именно plain-object
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
    };
  }



  static async loadAllSlugs(): Promise<{ slug: string; updatedAt?: string }[]> {
    const { data, error } = await supabase
      .from("tournaments")
      .select("slug, updated_at")
      .eq("is_public", true); // ⚠️ фильтруем только опубликованные

    if (error) {
      console.error("TournamentsRepository.loadAllSlugs:", error);
      return [];
    }

    return data.map((t) => ({
      slug: t.slug,
      updatedAt: t.updated_at,
    }));
  }

  /** Загрузить все турниры */
  static async loadAll(): Promise<Tournament[]> {
    const { data, error } = await supabase.from("tournaments").select("*").order("start_date", { ascending: true });
    if (error) {
      console.error("Ошибка загрузки турниров:", error);
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
          row.creator_id,
          row.slug,
          row.settings
        )
    );
  }

    /** Загрузить все турниры */
  static async loadByClub(clubId: number): Promise<Tournament[]> {
    const { data, error } = await supabase.
      from("tournaments").
      select("*").
      eq("club_id", clubId).
      order("start_date", { ascending: true });
    if (error) {
      console.error("Ошибка загрузки турниров:", error);
      return [];
    }

    console.log("TournamentsRepository.loadByClub",data);

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
          row.creator_id,
          row.slug,
          row.settings
        )
    );
  }

  /** Вернуть турниры, доступные пользователю согласно его роли */
  static async loadAccessible(userId: number | undefined, userRole: string | undefined): Promise<Tournament[]> {
    // гости — все турниры (как у тебя сделано)
    if (userId === undefined || userRole === undefined) {
      const { data, error } = await supabase.from("tournaments").select("*").order("start_date", { ascending: true });
      if (error) {
        console.error("Ошибка загрузки публичных турниров (гость):", error);
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
            row.creator_id,
            row.slug,
            row.settings
          )
      );
    }

    const role = userRole;

    if (role === "site_admin") {
      const { data, error } = await supabase.from("tournaments").select("*").order("start_date", { ascending: true });
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
            row.creator_id,
            row.slug,
            row.settings
          )
      );
    }

    if (role === UserRole.TournamentAdmin) {
      const { data, error } = await supabase.from("tournaments").select("*").order("start_date", { ascending: true });
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
            row.creator_id,
            row.slug,
            row.settings
          )
      );
    }

    if (role === "player") {
      const player = await PlayersRepository.findByUserId(userId);
      if (!player) return [];

      const personal = await TournamentsRepository.findTournamentsForPlayer(player.id);
      const { data, error } = await supabase.from("tournaments").select("*").eq("is_public", true);
      if (error) console.error("Ошибка загрузки публичных турниров:", error);

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
            row.creator_id,
            row.slug,
            row.settings
          )
      );

      const all = [...personal, ...publicOnes];
      const unique = new Map(all.map((t) => [t.id, t]));
      return Array.from(unique.values()).sort(
        (a, b) => new Date(a.start_date as any).getTime() - new Date(b.start_date as any).getTime()
      );
    }

    // неизвестная роль — только публичные
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
          row.creator_id,
          row.slug,
          row.settings
        )
    );
  }

  /** Получить турнир по ID */
  static async getTournamentById(id: number): Promise<Tournament | null> {
    const { data, error } = await supabase.from("tournaments").select("*").eq("id", id).single();
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
          data.creator_id,
          data.slug,
          data.settings
        )
      : null;
  }

  /** Создать турнир */
  static async create(input: TournamentCreateInput): Promise<Tournament> {
    const { data, error } = await supabase.from("tournaments").insert([input]).select().single();
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
      data.is_public,
      data.slug,
      data.settings
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
    const { error } = await supabase.from("tournament_participants").insert({ tournament_id: tournamentId, team_id: teamId });
    if (error) console.error("Ошибка добавления команды:", error);
  }

  /** Удалить участника */
  static async removeParticipant(id: number) {
    const { error } = await supabase.from("tournament_participants").delete().eq("id", id);
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
    const { error } = await supabase.from("tournament_participants").upsert(updates, { onConflict: "id" });
    if (error) {
      console.error("Ошибка массового обновления:", error);
    }
  }

  /** Счётчики */
  static async loadStats(tournamentIds: number[]) {
    type PRow = { tournament_id: number; participants: number };
    type MRow = { tournament_id: number; matches: number };

    const [{ data: p, error: pErr }, { data: m, error: mErr }] = await Promise.all([
      supabase.from("participants_count_by_tournament").select("tournament_id, participants").in("tournament_id", tournamentIds),
      supabase.from("matches_count_by_tournament").select("tournament_id, matches").in("tournament_id", tournamentIds),
    ]);

    if (pErr) console.error(pErr);
    if (mErr) console.error(mErr);

    const res: Record<number, { participants: number; matches: number }> = {};
    tournamentIds.forEach((id) => (res[id] = { participants: 0, matches: 0 }));

    (p as PRow[] | null)?.forEach((r) => (res[r.tournament_id].participants = r.participants));
    (m as MRow[] | null)?.forEach((r) => (res[r.tournament_id].matches = r.matches));
    return res;
  }

  /** Турниры игрока (лично/в командах) */
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
        const resp = await supabase.from("tournament_participants").select("tournament_id").in("team_id", teamIds);
        if (resp.error) {
          console.error("Ошибка загрузки участий команды игрока:", resp.error);
          return [];
        }
        teamParts = resp.data ?? [];
      }

      const ids = new Set<number>();
      (directParts ?? []).forEach((r) => r.tournament_id != null && ids.add(r.tournament_id));
      teamParts.forEach((r) => r.tournament_id != null && ids.add(r.tournament_id));

      const tournamentIds = Array.from(ids);
      if (tournamentIds.length === 0) return [];

      const { data, error } = await supabase.from("tournaments").select("*").in("id", tournamentIds).order("start_date", { ascending: false });
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
            row.creator_id,
            row.slug,
            row.settings
          )
      );
    } catch (e) {
      console.error("Неожиданная ошибка findTournamentsForPlayer:", e);
      return [];
    }
  }

  /** Количество всех турниров в базе */
  static async countAll(): Promise<number> {
    const { count, error } = await supabase.from("tournaments").select("id", { count: "exact", head: true });
    if (error) {
      console.error("Ошибка подсчёта турниров:", error);
      return 0;
    }
    return count ?? 0;
  }

  // === ВАЖНО: быстрый RPC ===
  static async addMatchAndMaybeSwap(params: {
    tournamentId: number;
    isSingle: boolean;
    aId: number;
    bId: number;
    winnerId: number | null;
    loserId: number | null;
    scores: any;
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
      _date: params.date.toISOString(),
      _phase: params.phase ?? null,
      _group_index: params.groupIndex ?? null,
      _round_index: params.roundIndex ?? null,
      _do_swap: params.doSwap,
    });
    if (error) throw error;
    return data?.[0]?.match_id as number | undefined;
  }
}


// хелпер, чтобы везде генерировать ссылки единообразно
export function tournamentUrl(t: { slug: string }) {
  return `/tournaments/${t.slug}`;
}
