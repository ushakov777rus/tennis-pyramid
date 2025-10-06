-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.club_admins (
  club_id bigint NOT NULL,
  user_id bigint NOT NULL,
  role USER-DEFINED NOT NULL DEFAULT 'manager'::club_admin_role,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT club_admins_pkey PRIMARY KEY (user_id, club_id),
  CONSTRAINT club_admins_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id),
  CONSTRAINT club_admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.club_members (
  club_id bigint NOT NULL,
  player_id bigint NOT NULL,
  role USER-DEFINED NOT NULL DEFAULT 'player'::club_member_role,
  status USER-DEFINED NOT NULL DEFAULT 'active'::club_member_status,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT club_members_pkey PRIMARY KEY (club_id, player_id),
  CONSTRAINT club_members_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id),
  CONSTRAINT club_members_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id)
);
CREATE TABLE public.clubs (
  id bigint NOT NULL DEFAULT nextval('clubs_id_seq'::regclass),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  city text,
  logo_url text,
  contacts jsonb DEFAULT '{}'::jsonb,
  created_by bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT clubs_pkey PRIMARY KEY (id),
  CONSTRAINT clubs_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE TABLE public.matches (
  date timestamp with time zone,
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  scores jsonb,
  match_type text DEFAULT 'single'::text,
  tournament_id integer,
  player1_id bigint,
  player2_id bigint,
  team1_id bigint,
  team2_id bigint,
  phase text CHECK (phase = ANY (ARRAY['group'::text, 'playoff'::text])),
  group_index integer,
  round_index integer,
  CONSTRAINT matches_pkey PRIMARY KEY (id),
  CONSTRAINT matches_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id),
  CONSTRAINT fk_player1 FOREIGN KEY (player1_id) REFERENCES public.players(id),
  CONSTRAINT fk_player2 FOREIGN KEY (player2_id) REFERENCES public.players(id),
  CONSTRAINT fk_team1 FOREIGN KEY (team1_id) REFERENCES public.teams(id),
  CONSTRAINT fk_team2 FOREIGN KEY (team2_id) REFERENCES public.teams(id)
);
CREATE TABLE public.players (
  name text NOT NULL,
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  phone text,
  sex text,
  ntrp text,
  user_id bigint,
  CONSTRAINT players_pkey PRIMARY KEY (id),
  CONSTRAINT players_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.teams (
  id integer NOT NULL DEFAULT nextval('teams_id_seq'::regclass),
  created_at timestamp with time zone DEFAULT now(),
  player1_id bigint,
  player2_id bigint,
  tournament_id bigint,
  CONSTRAINT teams_pkey PRIMARY KEY (id),
  CONSTRAINT teams_player1_id_fkey FOREIGN KEY (player1_id) REFERENCES public.players(id),
  CONSTRAINT teams_player2_id_fkey FOREIGN KEY (player2_id) REFERENCES public.players(id),
  CONSTRAINT teams_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id)
);
CREATE TABLE public.tournament_participants (
  id integer NOT NULL DEFAULT nextval('tournament_participants_id_seq'::regclass),
  tournament_id integer,
  player_id integer,
  team_id integer,
  level bigint,
  position bigint,
  CONSTRAINT tournament_participants_pkey PRIMARY KEY (id),
  CONSTRAINT tournament_participants_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id),
  CONSTRAINT tournament_participants_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id),
  CONSTRAINT tournament_participants_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id)
);
CREATE TABLE public.tournaments (
  id integer NOT NULL DEFAULT nextval('tournaments_id_seq'::regclass),
  name text NOT NULL,
  start_date date,
  end_date date,
  status text DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'registration'::text, 'ongoing'::text, 'finished'::text])),
  created_at timestamp with time zone DEFAULT now(),
  tournament_type text DEFAULT 'single'::text CHECK (tournament_type = ANY (ARRAY['single'::text, 'double'::text])),
  format text DEFAULT 'pyramid'::text CHECK (format = ANY (ARRAY['pyramid'::text, 'round_robin'::text, 'single_elimination'::text, 'double_elimination'::text, 'groups_playoff'::text, 'swiss'::text, 'custom'::text])),
  creator_id integer DEFAULT 1,
  is_public boolean DEFAULT false,
  settings jsonb DEFAULT '{}'::jsonb CHECK (jsonb_typeof(settings) = 'object'::text),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  slug text NOT NULL,
  club_id bigint,
  owner_token text,
  regulation text,
  CONSTRAINT tournaments_pkey PRIMARY KEY (id),
  CONSTRAINT tournaments_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id),
  CONSTRAINT tournaments_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id)
);
CREATE TABLE public.users (
  id bigint NOT NULL DEFAULT nextval('users_id_seq1'::regclass),
  name text NOT NULL UNIQUE,
  role text DEFAULT 'player'::text CHECK (role = ANY (ARRAY['site_admin'::text, 'tournament_admin'::text, 'player'::text])),
  auth_user_id uuid UNIQUE,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);