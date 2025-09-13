import { supabase } from "@/lib/supabaseClient";
import { Club, ClubCreateInput, ClubPlain } from "../models/Club";

export class ClubsRepository {
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

  static async create(input: ClubCreateInput): Promise<Club> {
    const { data, error } = await supabase
      .from("clubs")
      .insert({
        name: input.name,
        city: input.city ?? null,
        description: input.description ?? null,
        logo_url: input.logo_url ?? null
      })
      .select("id, slug, name, description, city, logo_url, created_at, updated_at")
      .single();
    if (error) throw error;

    // дотягиваем members_count из вьюхи
    const { data: v } = await supabase.from("club_stats").select("*").eq("id", (data as any).id).single();
    return (v ?? data) as Club;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from("clubs").delete().eq("id", id);
    if (error) throw error;
  }

  static clubUrl(c: Pick<Club, "slug">): string {
    return `/clubs/${c.slug}`;
  }

    static async getBySlug(slug: string): Promise<ClubPlain | null> {
      const { data, error } = await supabase
        .from("clubs")
        .select(
          "*"
        )
        .eq("slug", slug)
        .maybeSingle();
  
      if (error) {
        console.error("ClubsRepository.getBySlug:", error);
        return null;
      }
      if (!data) return null;
  
      // ВАЖНО: возвращаем именно plain-object
      return {
  id: data.id,
  slug: data.slug,
  name: data.name,
  description: data.description,
  city: data.city,
  logo_url: data.logo_url,
  members_count: data.members_count,   // из view club_stats
  created_at: data.created_at,
  updated_at: data.updated_at,

      };
    }
  
}