ALTER TABLE public.tournaments
  ADD COLUMN IF NOT EXISTS owner_token text;

CREATE INDEX IF NOT EXISTS idx_tournaments_owner_token
  ON public.tournaments(owner_token);
