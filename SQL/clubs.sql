-- ---------- enums ----------
create type club_admin_role as enum ('director', 'manager');
create type club_member_role as enum ('player', 'coach');
create type club_member_status as enum ('active', 'pending', 'removed');

-- ---------- clubs ----------
create table public.clubs (
  id            bigserial primary key,
  slug          text not null unique,              -- человекочитаемый путь /clubs/{slug}
  name          text not null,
  description   text,
  city          text,
  logo_url      text,
  contacts      jsonb default '{}'::jsonb,         -- {phone, telegram, site, email}
  created_by    bigint references public.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index clubs_slug_idx on public.clubs (slug);
create index clubs_created_at_idx on public.clubs (created_at desc);

-- авто-обновление updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger trg_clubs_updated
before update on public.clubs
for each row execute function public.set_updated_at();

-- ---------- club_admins ----------
create table public.club_admins (
  club_id   bigint not null references public.clubs(id) on delete cascade,
  user_id   bigint not null references public.users(id) on delete cascade,
  role      club_admin_role not null default 'manager',
  created_at timestamptz not null default now(),
  primary key (club_id, user_id)
);

-- ---------- club_members ----------
create table public.club_members (
  club_id   bigint not null references public.clubs(id) on delete cascade,
  player_id bigint not null references public.players(id) on delete cascade,
  role      club_member_role not null default 'player',
  status    club_member_status not null default 'active',
  joined_at timestamptz not null default now(),
  primary key (club_id, player_id)
);

create index club_members_club_idx on public.club_members (club_id);
create index club_members_player_idx on public.club_members (player_id);

-- ---------- RLS ----------
alter table public.clubs enable row level security;
alter table public.club_admins enable row level security;
alter table public.club_members enable row level security;

-- Политики: чтение всем; изменения — только site_admin или админам клуба
-- Предполагаем, что в таблице users есть поле role ('site_admin', 'tournament_admin', 'player', ...)
-- и есть helper secure definer function current_user_id() / current_user_role()
-- Если нет — временно ограничим запись только site_admin.

-- READ: всем
create policy clubs_read_all on public.clubs
for select using (true);

create policy club_admins_read_all on public.club_admins
for select using (true);

create policy club_members_read_all on public.club_members
for select using (true);


-- ---------- вьюха с подсчётами (удобно для списка) ----------
create or replace view public.club_stats as
select
  c.*,
  (select count(*) from public.club_members m
    where m.club_id = c.id and m.status = 'active') as members_count
from public.clubs c;