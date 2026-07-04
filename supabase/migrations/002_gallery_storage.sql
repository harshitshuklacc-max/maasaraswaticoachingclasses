-- Minimal gallery + storage setup for production (Vercel/serverless)
-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  category TEXT NOT NULL DEFAULT 'building',
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active gallery" ON public.gallery;
CREATE POLICY "Public read active gallery"
  ON public.gallery FOR SELECT
  USING (is_active = true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read uploads bucket" ON storage.objects;
CREATE POLICY "Public read uploads bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'uploads');
