create table public.tournaments (
  id serial not null,
  name text not null,
  start_date date null,
  end_date date null,
  status text null default 'draft'::text,
  created_at timestamp with time zone null default now(),
  tournament_type text null default 'single'::text,
  format text null default 'pyramid'::text,
  creator_id integer null default 1,
  is_public boolean null default false,
  settings jsonb null default '{}'::jsonb,
  updated_at timestamp with time zone not null default now(),
  slug text not null,
  club_id bigint null,
  constraint tournaments_pkey primary key (id),
  constraint tournaments_creator_id_fkey foreign KEY (creator_id) references users (id) on delete CASCADE,
  constraint tournaments_club_id_fkey foreign KEY (club_id) references clubs (id) on delete set null,
  constraint tournaments_tournament_type_check check (
    (
      tournament_type = any (array['single'::text, 'double'::text])
    )
  ),
  constraint tournaments_format_check check (
    (
      format = any (
        array[
          'pyramid'::text,
          'round_robin'::text,
          'single_elimination'::text,
          'double_elimination'::text,
          'groups_playoff'::text,
          'swiss'::text,
          'custom'::text
        ]
      )
    )
  ),
  constraint settings_is_object check ((jsonb_typeof(settings) = 'object'::text)),
  constraint tournaments_status_check check (
    (
      status = any (
        array[
          'draft'::text,
          'registration'::text,
          'ongoing'::text,
          'finished'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_tournaments_creator_id_start_date on public.tournaments using btree (creator_id, start_date) TABLESPACE pg_default;

create index IF not exists idx_tournaments_is_public_start_date on public.tournaments using btree (is_public, start_date) TABLESPACE pg_default;

create unique INDEX IF not exists uq_tournaments_slug on public.tournaments using btree (slug) TABLESPACE pg_default;

create index IF not exists idx_tournaments_public_updated on public.tournaments using btree (is_public, updated_at desc) TABLESPACE pg_default;

create index IF not exists idx_tournaments_start_date on public.tournaments using btree (start_date) TABLESPACE pg_default;

create index IF not exists idx_tournaments_club_id on public.tournaments using btree (club_id) TABLESPACE pg_default;

create index IF not exists idx_tournaments_club_id_start_date on public.tournaments using btree (club_id, start_date) TABLESPACE pg_default;

create index IF not exists idx_tournaments_club_id_public_updated on public.tournaments using btree (club_id, is_public, updated_at desc) TABLESPACE pg_default;

create trigger trg_tournaments_slug_updated_at BEFORE INSERT
or
update on tournaments for EACH row
execute FUNCTION tournaments_set_slug_and_updated_at ();