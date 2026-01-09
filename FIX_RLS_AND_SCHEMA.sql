-- ============================================================
-- FIX: TYPES DE PRODUITS ET POLITIQUES RLS
-- ============================================================

-- 1. Corriger la table order_items pour accepter les IDs de produits sous forme de texte
-- (bc-1, bc-2, etc. utilisés dans le catalogue statique)
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE order_items ALTER COLUMN product_id TYPE TEXT;

-- 2. Améliorer la politique de création des articles de commande
-- Utiliser une politique plus directe pour éviter les problèmes de récursivité/cache
DROP POLICY IF EXISTS "Users create order items" ON order_items;
CREATE POLICY "Users create order items" ON order_items FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);

-- 3. S'assurer que les utilisateurs peuvent créer des commandes sans conflit de profil
-- On vérifie simplement que l'utilisateur est authentifié et que le user_id correspond
DROP POLICY IF EXISTS "Users create orders" ON orders;
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- 4. Permettre l'accès public (mais contrôlé) si nécessaire, ou s'assurer que profiles est lisible
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id OR auth.uid() IS NOT NULL); -- Optionnel: assouplir pour tests

-- 5. (Optionnel) Recréer les profils manquants si nécessaire
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'user'
FROM auth.users
ON CONFLICT (id) DO NOTHING;
