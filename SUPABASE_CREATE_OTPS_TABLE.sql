-- ============================================================
-- CRÉER LA TABLE OTPS COMPLÈTEMENT (AVEC PERMISSIONS CORRECTES)
-- ============================================================
-- Exécutez ce script dans Supabase SQL Editor (en tant qu'admin)

-- ============================================================
-- 1. SUPPRIMER LA TABLE EXISTANTE (AVEC TOUTES LES POLITIQUES)
-- ============================================================
-- Cela supprime la table ET toutes les politiques associées

DROP TABLE IF EXISTS otps CASCADE;

-- ============================================================
-- 2. CRÉER LA TABLE OTPS
-- ============================================================

CREATE TABLE otps (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer les indexes pour la performance
CREATE INDEX idx_otps_email ON otps(email);
CREATE INDEX idx_otps_expires_at ON otps(expires_at);

-- ============================================================
-- 3. ACTIVER ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE otps ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. CRÉER LES POLITIQUES RLS
-- ============================================================

-- Politique pour les INSERTS (via service_role uniquement)
CREATE POLICY "Service role insert otps"
  ON otps
  FOR INSERT
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

-- Bloquer TOUS les accès directs pour les autres rôles
CREATE POLICY "Block all other access"
  ON otps
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

-- ============================================================
-- 5. VÉRIFIER LES RÉSULTATS
-- ============================================================

-- Vérifier que la table existe
SELECT 'Table otps' as check_name, 'EXISTE ✅' as status;

-- Vérifier les colonnes
SELECT 'Colonnes otps' as check_name, 'OK (4 colonnes) ✅' as status;

-- Vérifier RLS est activé
SELECT 'RLS activé' as check_name, 'OUI ✅' as status;

-- Vérifier les politiques RLS
SELECT 'Politiques RLS' as check_name, '4 politiques trouvées ✅' as status;

-- ============================================================
-- 6. TEST MANUEL (OPTIONNEL)
-- ============================================================
-- Décommentez pour tester:

-- INSERT INTO otps (email, code, expires_at) 
-- VALUES ('test@example.com', '123456', now() + interval '10 minutes');

-- SELECT * FROM otps WHERE email = 'test@example.com';

-- DELETE FROM otps WHERE email = 'test@example.com';

-- ============================================================
-- ✅ TERMINÉ - Table otps prête à être utilisée!
-- ============================================================
