import { supabase } from "@/lib/supabaseClient";

export type Club = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  city: string | null;
  logo_url: string | null;
  members_count: number | null;
  created_at: string;
  updated_at: string;
};

export class ClubsRepository {
  // Получить список клубов с пагинацией/поиском
  static async list(params?: { search?: string; limit?: number; offset?: number }): Promise<Club[]> {
    const limit = params?.limit ?? 20;
    const offset = params?.offset ?? 0;
    const search = (params?.search ?? "").trim();

    let query = supabase.from("club_stats").select("*").order("created_at", { ascending: false }).range(offset, offset + limit - 1);

    if (search.length > 0) {
      // простой поиск по имени/городу
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error("ClubsRepository.list error:", error);
      return [];
    }
    return (data as Club[]) ?? [];
  }

  // Получить клуб по slug
  static async getBySlug(slug: string): Promise<Club | null> {
    const { data, error } = await supabase.from("club_stats").select("*").eq("slug", slug).single();
    if (error) {
      console.error("ClubsRepository.getBySlug error:", error);
      return null;
    }
    return data as Club;
  }
}