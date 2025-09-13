-- 1) Добавляем колонку (тип bigint, чтобы совпадал с clubs.id :: bigserial)
ALTER TABLE public.tournaments
  ADD COLUMN IF NOT EXISTS club_id bigint NULL;

-- 2) Внешний ключ на clubs(id)
ALTER TABLE public.tournaments
  ADD CONSTRAINT tournaments_club_id_fkey
  FOREIGN KEY (club_id) REFERENCES public.clubs(id)
  ON DELETE SET NULL;

-- 3) Индексы для частых выборок
CREATE INDEX IF NOT EXISTS idx_tournaments_club_id
  ON public.tournaments (club_id);

-- (опционально) если часто фильтруешь по клубу + дате/публичности
CREATE INDEX IF NOT EXISTS idx_tournaments_club_id_start_date
  ON public.tournaments (club_id, start_date);

CREATE INDEX IF NOT EXISTS idx_tournaments_club_id_public_updated
  ON public.tournaments (club_id, is_public, updated_at DESC);