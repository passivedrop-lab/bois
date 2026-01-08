-- ============================================================
-- DIAGNOSTIQUE ET CORRECTION DES PERMISSIONS RLS - TABLE OTP
-- ============================================================
-- Exécutez ce script dans Supabase SQL Editor (en tant qu'admin)

-- ============================================================
-- 1. VÉRIFIER L'ÉTAT ACTUEL DES TABLES
-- ============================================================

-- Vérifier que la table otps existe
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'otps';

-- Vérifier les colonnes de la table otps
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'otps' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier les politiques RLS sur otps
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'otps';

-- Vérifier l'état RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'otps';

-- ============================================================
-- 2. CORRIGER LES PERMISSIONS RLS (SI NÉCESSAIRE)
-- ============================================================

-- Supprimer les anciennes politiques restrictives (si elles existent)
DROP POLICY IF EXISTS "Block all direct access to otps" ON otps;
DROP POLICY IF EXISTS "Service role only for otps" ON otps;

-- Activer RLS sur la table otps
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre au service role d'insérer
CREATE POLICY "Service role can insert otps"
  ON otps
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Créer une politique pour permettre au service role de supprimer (pour expiration)
CREATE POLICY "Service role can delete otps"
  ON otps
  FOR DELETE
  USING (auth.role() = 'service_role');

-- Créer une politique pour permettre au service role de lire (pour vérification)
CREATE POLICY "Service role can read otps"
  ON otps
  FOR SELECT
  USING (auth.role() = 'service_role');

-- Bloquer complètement l'accès direct pour les autres rôles
CREATE POLICY "Block public access to otps"
  ON otps
  FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);

-- ============================================================
-- 3. VÉRIFIER LES RÉSULTATS
-- ============================================================

-- Vérifier que les nouvelles politiques existent
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'otps'
ORDER BY policyname;

-- Vérifier que RLS est activé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'otps';

-- ============================================================
-- 4. TESTER L'INSERTION (optionnel - avec service_role)
-- ============================================================
-- Note: Cette commande ne peut pas être exécutée directement depuis le SQL Editor
-- mais votre API l'utilisera automatiquement

-- INSERT INTO otps (email, code, expires_at) 
-- VALUES ('test@example.com', '123456', now() + interval '10 minutes');

-- SELECT * FROM otps WHERE email = 'test@example.com';
-- DELETE FROM otps WHERE email = 'test@example.com';

-- ============================================================
-- 5. RÉSUMÉ
-- ============================================================
-- Si tout fonctionne, vous devriez voir:
-- ✅ La table otps existe avec colonnes: email, code, expires_at, created_at
-- ✅ RLS est activé (rowsecurity = true)
-- ✅ 4 politiques existent: insert, delete, read, block public
-- ✅ Les insertions via service_role fonctionnent correctement
