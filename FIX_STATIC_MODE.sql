-- ============================================================
-- SCRIPT CORRECTIF POUR LE MODE STATIQUE
-- À exécuter dans Supabase SQL Editor
-- ============================================================

-- 1. Adapter la table user_cart (Panier)
-- On supprime la liaison stricte avec la table products car les produits sont maintenant statiques
ALTER TABLE user_cart DROP CONSTRAINT IF EXISTS user_cart_product_id_fkey;
-- On change le type de l'ID pour accepter le format texte (ex: 'bc-1')
ALTER TABLE user_cart ALTER COLUMN product_id TYPE TEXT;

-- 2. Adapter la table user_favorites (Favoris)
-- Création de la table si elle n'existe pas (au cas où)
CREATE TABLE IF NOT EXISTS user_favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL, -- Texte direct
  product_name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Si la table existait déjà avec un lien FK, on le retire et on change le type
ALTER TABLE user_favorites DROP CONSTRAINT IF EXISTS user_favorites_product_id_fkey;
ALTER TABLE user_favorites ALTER COLUMN product_id TYPE TEXT;

-- 3. Activer RLS pour les favoris (sécurité)
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own favorites" ON user_favorites;
CREATE POLICY "Users can manage their own favorites"
  ON user_favorites FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
