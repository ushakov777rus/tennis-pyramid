-- Добавляем текстовое поле для комментария к матчу в public.matches
ALTER TABLE public.matches
ADD COLUMN IF NOT EXISTS comment text;
