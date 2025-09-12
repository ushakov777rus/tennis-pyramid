import { supabase } from "@/lib/supabaseClient";
import { Club } from "../models/Club";

export type ClubCreateInput = {
  name: string;
  city?: string | null;
  description?: string | null;
  logo_url?: string | null;
};

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
}