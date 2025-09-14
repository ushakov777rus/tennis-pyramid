import { supabase } from "@/lib/supabaseClient";
import { Club, ClubCreateInput, ClubPlain } from "../models/Club";
import { Player } from "../models/Player";

export class ClubsRepository {
  /* ======================= ЧТЕНИЕ СПИСКОВ ======================= */

  static async loadAll(): Promise<Club[]> {
    const { data, error } = await supabase
      .from("club_stats")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Club[];
  }

  static async search(params?: { q?: string }): Promise<Club[]> {
    const q = (params?.q ?? "").trim();
    let query = supabase.from("club_stats").select("*").order("created_at", { ascending: false });
    if (q.length) {
      query = query.or(`name.ilike.%${q}%,city.ilike.%${q}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as Club[];
  }

  /* ======================= CRUD КЛУБОВ ======================= */

static async createNewClub(input: ClubCreateInput): Promise<Club> {
  console.log("Добавление клуба", input);
  const { data, error: insertError } = await supabase
    .from("clubs")
    .insert({
      name: input.name,
      city: input.city ?? null,
      created_by: input.director_id,
      description: input.description ?? null,
      logo_url: input.logo_url ?? null,
    })
    .select("id, slug, name, description, city, logo_url, created_at, updated_at")
    .single();

  if (insertError) throw insertError;

  const { error: adminError } = await supabase
    .from("club_admins")
    .insert({
      club_id: (data as any).id,
      user_id: input.director_id,
      role: "director",
    });

  if (adminError) 
  {
    console.error("Не удалось добавить админа клуба", adminError);
    throw adminError;
  }

  // дотягиваем members_count из вьюхи
  const { data: v } = await supabase
    .from("club_stats")
    .select("*")
    .eq("id", (data as any).id)
    .single();

  return (v ?? data) as Club;
}

  static async update(
    id: number,
    patch: Partial<Pick<ClubPlain, "name" | "description" | "city" | "logo_url" | "slug">> & { contacts?: Record<string, any> }
  ): Promise<ClubPlain> {
    const { data, error } = await supabase
      .from("clubs")
      .update({
        name: patch.name,
        description: patch.description ?? null,
        city: patch.city ?? null,
        logo_url: patch.logo_url ?? null,
        slug: patch.slug,
        contacts: patch.contacts ?? undefined,
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;

    // вернуть в формате ClubPlain (с members_count из club_stats)
    const { data: stat } = await supabase.from("club_stats").select("*").eq("id", id).single();

    return {
      id: data.id,
      director_id: data.creted_by,
      slug: data.slug,
      name: data.name,
      description: data.description,
      city: data.city,
      logo_url: data.logo_url,
      members_count: (stat as any)?.members_count ?? null,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  static async updateLogoUrl(id: number, url: string | null): Promise<void> {
    const { error } = await supabase.from("clubs").update({ logo_url: url }).eq("id", id);
    if (error) throw error;
  }

  static async updateContacts(id: number, contacts: Record<string, any>): Promise<void> {
    const { error } = await supabase.from("clubs").update({ contacts }).eq("id", id);
    if (error) throw error;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from("clubs").delete().eq("id", id);
    if (error) throw error;
  }

  /* ======================= GETTERS ======================= */

  static clubUrl(c: Pick<Club, "slug">): string {
    return `/clubs/${c.slug}`;
  }

  /** Лучше брать из club_stats — там есть members_count */
  static async getBySlug(slug: string): Promise<ClubPlain | null> {
    // club_stats содержит все поля + members_count
    const { data, error } = await supabase
      .from("club_stats")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("ClubsRepository.getBySlug:", error);
      return null;
    }
    if (!data) return null;

    return {
      id: (data as any).id,
      director_id: (data as any).created_by,
      slug: (data as any).slug,
      name: (data as any).name,
      description: (data as any).description,
      city: (data as any).city,
      logo_url: (data as any).logo_url,
      members_count: (data as any).members_count ?? 0,
      created_at: (data as any).created_at,
      updated_at: (data as any).updated_at,
    };
  }

  static async getById(id: number): Promise<ClubPlain | null> {
    const { data, error } = await supabase
      .from("club_stats")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    return {
      id: (data as any).id,
      director_id: (data as any).created_by,
      slug: (data as any).slug,
      name: (data as any).name,
      description: (data as any).description,
      city: (data as any).city,
      logo_url: (data as any).logo_url,
      members_count: (data as any).members_count ?? 0,
      created_at: (data as any).created_at,
      updated_at: (data as any).updated_at,
    };
  }

  /* ======================= ЧЛЕНЫ КЛУБА ======================= */

  /**
   * Активные члены клуба.
   * Используем relation-select: club_members → players.
   * Если поля в players другие — подправь список в select.
   */
  static async loadMembers(clubId: number): Promise<Player[]> {
    const { data, error } = await supabase
      .from("club_members")
      .select("player:players(*)")
      .eq("club_id", clubId)
      .eq("status", "active")
      .order("joined_at", { ascending: true });

    if (error) throw error;

    // Преобразуем plain → Player
    const players = (data ?? [])
      .map((row: any) => (row.player ? new Player(row.player) : null))
      .filter(Boolean) as Player[];

    return players;
  }

  /**
   * Добавить игрока в клуб (upsert).
   * Если запись уже есть — обновим статус на active и роль на player (если нужно).
   */
  static async addMember(clubId: number, playerId: number, opts?: { role?: "player" | "admin"; status?: "active" | "invited" }): Promise<void> {
    const role = opts?.role ?? "player";
    const status = opts?.status ?? "active";

    // upsert по составному PK (club_id, player_id)
    const { error } = await supabase
      .from("club_members")
      .upsert(
        {
          club_id: clubId,
          player_id: playerId,
          role,
          status,
        },
        { onConflict: "club_id,player_id" }
      );

    if (error) throw error;
  }

  /**
   * Удалить игрока из клуба.
   * Если хочешь «мягкое» удаление — замени на update({status:'removed'}).
   */
  static async removeMember(clubId: number, playerId: number): Promise<void> {
    const { error } = await supabase
      .from("club_members")
      .delete()
      .eq("club_id", clubId)
      .eq("player_id", playerId);

    if (error) throw error;
  }

    /** Количество всех турниров в базе */
  static async countAll(): Promise<number> {
    const { count, error } = await supabase.from("clubs").select("id", { count: "exact", head: true });
    if (error) {
      console.error("Ошибка подсчёта клубов:", error);
      return 0;
    }
    return count ?? 0;
  }

}