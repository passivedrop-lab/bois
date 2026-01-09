-- ============================================================
-- SCRIPT CORRECTIF : VISIBILITÉ DES PRODUITS
-- Exécutez ce script dans Supabase SQL Editor
-- ============================================================

-- 1. Activer la sécurité au niveau des lignes (RLS) sur la table produits
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer la politique existante (au cas où elle serait mal configurée)
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Public read access" ON products;

-- 3. Créer la politique qui autorise TOUT LE MONDE à voir les produits
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

-- 4. Vérification (optionnel, affichera un message de succès dans la console Supabase)
DO $$
BEGIN
  RAISE NOTICE 'Politique de lecture publique activée avec succès sur la table products.';
END $$;
