-- (опционально) если нет расширения unaccent, можно установить:
-- CREATE EXTENSION IF NOT EXISTS unaccent;

-- 1) Базовый slug для клуба из name
CREATE OR REPLACE FUNCTION public.base_club_slug(_name text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT trim(
           both '-' FROM
             lower(
               regexp_replace(
                 regexp_replace(
                   -- если есть расширение unaccent, лучше использовать
                   unaccent(_name),
                   '[^a-zA-Z0-9]+', '-', 'g'
                 ),
                 '-{2,}', '-', 'g'
               )
             )
         )
$$;

-- 2) Гарантировать уникальность slug в clubs
CREATE OR REPLACE FUNCTION public.ensure_unique_club_slug(_base text, _exclude_id bigint DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  candidate text := _base;
  suffix int := 1;
BEGIN
  -- если базовый slug ещё не занят (с учётом исключаемой записи) — отдаём его
  IF NOT EXISTS (
    SELECT 1 FROM public.clubs
    WHERE slug = candidate
      AND (_exclude_id IS NULL OR id <> _exclude_id)
  ) THEN
    RETURN candidate;
  END IF;

  -- иначе крутим суффиксы -1, -2, -3 ...
  LOOP
    candidate := _base || '-' || suffix;
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.clubs
      WHERE slug = candidate
        AND (_exclude_id IS NULL OR id <> _exclude_id)
    );
    suffix := suffix + 1;
  END LOOP;

  RETURN candidate;
END;
$$;

-- 3) Основная триггер-функция: обновляет updated_at и выставляет slug
CREATE OR REPLACE FUNCTION public.clubs_biu_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  base text;
  exclude_id bigint := NULL;
BEGIN
  -- updated_at всегда текущее
  NEW.updated_at := now();

  -- Если вставка или при апдейте поменялось что-то важное для slug (name или slug)
  IF TG_OP = 'INSERT'
     OR (TG_OP = 'UPDATE' AND (NEW.name IS DISTINCT FROM OLD.name
                               OR NEW.slug IS DISTINCT FROM OLD.slug)) THEN
    -- базовый slug из name
    base := public.base_club_slug(NEW.name);

    -- при UPDATE знаем id, его нужно исключить из проверки уникальности
    IF TG_OP = 'UPDATE' THEN
      exclude_id := NEW.id;
    END IF;

    -- Если slug пуст/NULL или отличается от базового — пересчитываем и гарантируем уникальность
    IF NEW.slug IS NULL OR NEW.slug = '' OR NEW.slug <> base THEN
      NEW.slug := public.ensure_unique_club_slug(base, exclude_id);
      -- (опционально) если нужен сценарий "оставить base при отсутствии коллизии" —
      -- это уже покрыто ensure_unique_club_slug: он вернёт base, если свободен.
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- 4) Триггер на INSERT/UPDATE
DROP TRIGGER IF EXISTS trg_clubs_biu_slug ON public.clubs;
CREATE TRIGGER trg_clubs_biu_slug
BEFORE INSERT OR UPDATE ON public.clubs
FOR EACH ROW
EXECUTE FUNCTION public.clubs_biu_slug();