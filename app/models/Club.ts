export class Club {
  id: number;
  director_id: number;
  slug: string;
  name: string;
  description: string | null;
  city: string | null;
  logo_url: string | null;
  members_count: number | null;   // из view club_stats
  tournaments_count: number | null;   // из view club_stats
  created_at: string;
  updated_at: string;

  constructor(data: {
    id: number;
    director_id: number;
    slug: string;
    name: string;
    description?: string | null;
    city?: string | null;
    logo_url?: string | null;
    members_count?: number | null;
    tournaments_count?: number | null;
    created_at: string;
    updated_at: string;
  }) {
    this.id = data.id;
    this.director_id = data.director_id;
    this.slug = data.slug;
    this.name = data.name;
    this.description = data.description ?? null;
    this.city = data.city ?? null;
    this.logo_url = data.logo_url ?? null;
    this.members_count = data.members_count ?? null;
    this.tournaments_count = data.tournaments_count ?? null;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

export type ClubPlain = {
  id: number;
  director_id: number;
  slug: string;
  name: string;
  description: string | null;
  city: string | null;
  logo_url: string | null;
  members_count: number | null;
  tournaments_count: number | null;
  created_at: string;
  updated_at: string;
};


export type ClubCreateInput = {
  director_id: number;
  name: string;
  city?: string | null;
  description?: string | null;
  logo_url?: string | null;
};
