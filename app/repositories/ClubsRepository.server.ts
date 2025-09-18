// repositories/ClubsRepository.server.ts
import { createClient } from "@/app/lib/supabase/server";
import { Club } from "../models/Club";

export type ClubMini = { id: number; slug: string; name: string | null };

export class ClubsRepositoryServer {
  /** Найти клубы, где user является владельцем/админом. */
  static async findByAdmin(userId: number | string): Promise<ClubMini[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
    .from("club_stats")
    .select("*")
    .eq("created_by", userId);
    if (error) throw error;
    return (data ?? []) as Club[];
  }
}