-- Update tournaments status constraint to include registration phase
ALTER TABLE public.tournaments
  DROP CONSTRAINT IF EXISTS tournaments_status_check;

ALTER TABLE public.tournaments
  ADD CONSTRAINT tournaments_status_check
  CHECK (
    status = ANY (
      ARRAY[
        'draft'::text,
        'registration'::text,
        'ongoing'::text,
        'finished'::text
      ]
    )
  );
