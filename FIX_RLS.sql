-- ============================================================
-- SCRIPT DE CORRECTION RLS (STORAGE & PRODUITS)
-- À exécuter dans l'éditeur SQL de Supabase si l'upload échoue
-- ============================================================

-- 1. CONFIGURATION DU STORAGE (Bucket product-images)
-- On s'assure que le bucket est public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Supprimer les anciennes politiques restrictives
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Autoriser la lecture publique
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Autoriser l'upload public (ATTENTION: L'API backend sécurise l'accès via le code secret)
CREATE POLICY "Public Insert"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' );

-- Autoriser la suppression publique (Sécurisé par l'API backend)
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'product-images' );


-- 2. CONFIGURATION DE LA TABLE PRODUCTS
-- Puisque l'admin n'est plus loggué via Supabase Auth, il est vu comme "anon".
-- Si la clé SERVICE_ROLE n'est pas configurée, il faut autoriser "anon" à gérer les produits.

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon Products Select" ON products;
DROP POLICY IF EXISTS "Anon Products Insert" ON products;
DROP POLICY IF EXISTS "Anon Products Update" ON products;
DROP POLICY IF EXISTS "Anon Products Delete" ON products;

-- Tout le monde peut voir les produits
CREATE POLICY "Anon Products Select"
ON products FOR SELECT
USING ( true );

-- Autoriser 'anon' à gérer les produits (L'accès est protégé par le middleware/API route et le cookie secret)
CREATE POLICY "Anon Products Insert"
ON products FOR INSERT
WITH CHECK ( true );

CREATE POLICY "Anon Products Update"
ON products FOR UPDATE
USING ( true );

CREATE POLICY "Anon Products Delete"
ON products FOR DELETE
USING ( true );
