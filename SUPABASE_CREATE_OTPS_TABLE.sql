-- ============================================================
-- CRÉER LA TABLE OTPS COMPLÈTEMENT (AVEC PERMISSIONS CORRECTES)
-- ============================================================
-- Exécutez ce script dans Supabase SQL Editor (en tant qu'admin)

-- ============================================================
-- 1. SUPPRIMER LA TABLE EXISTANTE (SI NÉCESSAIRE)
-- ============================================================
-- ⚠️ ATTENTION: Cela supprimera tous les OTP existants!
-- Décommentez les 2 lignes ci-dessous SEULEMENT si vous voulez recommencer à zéro:

-- DROP TABLE IF EXISTS otps CASCADE;
-- DROP POLICY IF EXISTS "Service role can insert otps" ON otps;
-- DROP POLICY IF EXISTS "Service role can delete otps" ON otps;
-- DROP POLICY IF EXISTS "Service role can read otps" ON otps;
-- DROP POLICY IF EXISTS "Block public access to otps" ON otps;

-- ============================================================
-- 2. CRÉER LA TABLE OTPS (SI N'EXISTE PAS)
-- ============================================================

CREATE TABLE IF NOT EXISTS otps (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer les indexes pour la performance
CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email);
CREATE INDEX IF NOT EXISTS idx_otps_expires_at ON otps(expires_at);

-- ============================================================
-- 3. ACTIVER ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE otps ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. SUPPRIMER TOUTES LES ANCIENNES POLITIQUES
-- ============================================================

DROP POLICY IF EXISTS "Block all direct access to otps" ON otps;
DROP POLICY IF EXISTS "Service role only for otps" ON otps;
DROP POLICY IF EXISTS "Service role can insert otps" ON otps;
DROP POLICY IF EXISTS "Service role can delete otps" ON otps;
DROP POLICY IF EXISTS "Service role can read otps" ON otps;
DROP POLICY IF EXISTS "Block public access to otps" ON otps;

-- ============================================================
-- 5. CRÉER LES BONNES POLITIQUES RLS
-- ============================================================

-- Politique pour les INSERTS (via service_role uniquement)
CREATE POLICY "Service role insert otps"
  ON otps
  FOR INSERT
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Politique pour les SELECTS (via service_role uniquement)
CREATE POLICY "Service role select otps"
  ON otps
  FOR SELECT
  USING (auth.role() = 'service_role');

-- Politique pour les DELETES (via service_role uniquement)
CREATE POLICY "Service role delete otps"
  ON otps
  FOR DELETE
  USING (auth.role() = 'service_role');

-- Bloquer TOUS les accès directs pour les autres rôles (authenticated, anon, public)
CREATE POLICY "Block all other access"
  ON otps
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

-- ============================================================
-- 6. VÉRIFIER LES RÉSULTATS
-- ============================================================

-- Vérifier que la table existe
SELECT 'Table otps' as check_name, 'EXISTE' as status
WHERE EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'otps');

-- Vérifier les colonnes
SELECT 'Colonnes otps' as check_name, 
  CASE 
    WHEN COUNT(*) = 4 THEN 'OK (4 colonnes)'
    ELSE 'ERREUR: ' || COUNT(*) || ' colonnes'
  END as status
FROM information_schema.columns 
WHERE table_name = 'otps' AND table_schema = 'public';

-- Vérifier RLS est activé
SELECT 'RLS activé' as check_name,
  CASE WHEN rowsecurity = true THEN 'OUI ✅' ELSE 'NON ❌' END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'otps';

-- Vérifier les politiques RLS
SELECT 'Politiques RLS' as check_name,
  COUNT(*) || ' politiques trouvées' as status
FROM pg_policies 
WHERE tablename = 'otps';

-- Afficher les politiques en détail
SELECT 
  policyname as "Nom de la politique",
  qual as "Condition",
  with_check as "With Check"
FROM pg_policies 
WHERE tablename = 'otps'
ORDER BY policyname;

-- ============================================================
-- 7. TEST MANUEL (SI NÉCESSAIRE)
-- ============================================================
-- Décommentez les lignes ci-dessous pour tester manuellement:

-- -- Insérer un OTP de test (ceci doit fonctionner avec service_role)
-- INSERT INTO otps (email, code, expires_at) 
-- VALUES ('test@example.com', '123456', now() + interval '10 minutes');

-- -- Vérifier que l'OTP a été inséré
-- SELECT * FROM otps WHERE email = 'test@example.com';

-- -- Supprimer le test
-- DELETE FROM otps WHERE email = 'test@example.com';

-- ============================================================
-- 8. RÉSUMÉ FINAL
-- ============================================================
-- ✅ La table otps a été créée avec les bonnes colonnes
-- ✅ RLS est activé (rowsecurity = true)
-- ✅ 4 politiques RLS ont été créées
-- ✅ Service role peut faire: INSERT, SELECT, DELETE
-- ✅ Les autres rôles sont bloqués complètement
-- ✅ Prêt pour l'API /api/auth/send-otp
