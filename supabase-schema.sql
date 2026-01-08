-- ============================================================
-- SCRIPT COMPLET SUPABASE - BOIS RUSSE
-- ============================================================
-- Exécutez ce script dans le SQL Editor de Supabase
-- Créera toutes les tables nécessaires avec RLS configuré correctement
-- ============================================================

-- ============================================================
-- 1. CRÉER LES TABLES DE BASE
-- ============================================================

-- Table des produits
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  promo_price DECIMAL(10, 2),
  description TEXT,
  image_path TEXT,
  vedette BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Table des OTP (authentification par email)
DROP TABLE IF EXISTS otps CASCADE;
CREATE TABLE otps (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Table des profils utilisateurs
DROP TABLE IF EXISTS profiles CASCADE;
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user', -- 'user', 'admin'
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Table des commandes
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Table des éléments de commande
DROP TABLE IF EXISTS order_items CASCADE;
CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Table des favoris
DROP TABLE IF EXISTS favorites CASCADE;
CREATE TABLE favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Table des contacts/messages
DROP TABLE IF EXISTS contacts CASCADE;
CREATE TABLE contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- 'new', 'read', 'responded'
  created_at TIMESTAMP DEFAULT now()
);

-- ============================================================
-- 2. CRÉER LES INDEXES POUR LA PERFORMANCE
-- ============================================================

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_vedette ON products(vedette);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_otps_email ON otps(email);
CREATE INDEX idx_otps_expires_at ON otps(expires_at);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);
CREATE INDEX idx_contacts_status ON contacts(status);

-- ============================================================
-- 3. CONFIGURER LA ROW LEVEL SECURITY (RLS)
-- ============================================================

-- ========== TABLE PRODUCTS ==========
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Politique 1: Tout le monde peut lire les produits
CREATE POLICY "Allow public read on products"
  ON products FOR SELECT
  USING (true);

-- Politique 2: Seul le service role peut modifier (utilisé par l'API admin)
-- Remarque: Le service role bypass les RLS, donc cette politique est surtout pour les clients authentifiés
CREATE POLICY "Allow admin to modify products"
  ON products FOR ALL
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ========== TABLE OTPS ==========
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;

-- Politique: Le service role gère les OTPs (l'API utilisera le service role)
-- Désactiver l'accès public complètement
CREATE POLICY "Block all direct access to otps"
  ON otps FOR ALL
  USING (false)
  WITH CHECK (false);

-- ========== TABLE PROFILES ==========
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique 1: Chaque utilisateur peut lire son propre profil
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Politique 2: Chaque utilisateur peut mettre à jour son propre profil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Politique 3: Le service role peut insérer des profils (lors de l'inscription)
-- Cette politique permet aux appels API avec service role de créer des profils
CREATE POLICY "Service role can manage profiles"
  ON profiles FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ========== TABLE ORDERS ==========
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Politique 1: Les utilisateurs peuvent lire leurs propres commandes
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IS NULL); -- NULL pour les clients non authentifiés

-- Politique 2: Le service role peut tout faire (créer, lire, mettre à jour)
CREATE POLICY "Service role can manage orders"
  ON orders FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ========== TABLE ORDER_ITEMS ==========
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Politique: Accès via les commandes parentes
CREATE POLICY "Users can read order items via orders"
  ON order_items FOR SELECT
  USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Politique: Le service role peut tout faire
CREATE POLICY "Service role can manage order items"
  ON order_items FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ========== TABLE FAVORITES ==========
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Politique 1: Les utilisateurs peuvent lire leurs propres favoris
CREATE POLICY "Users can read own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Politique 2: Les utilisateurs peuvent gérer leurs propres favoris
CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========== TABLE CONTACTS ==========
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Politique: Le service role gère les contacts
CREATE POLICY "Service role can manage contacts"
  ON contacts FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Politique: Tout le monde peut créer un contact
CREATE POLICY "Allow public to create contacts"
  ON contacts FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- 4. CRÉER LES BUCKETS DE STORAGE
-- ============================================================
-- Note: Vous devez exécuter ces commandes via la CLI Supabase ou l'interface web:
--
-- Via CLI:
-- supabase storage create product-images --public false
-- supabase storage create receipts --public false
--
-- Ou via l'interface web Supabase:
-- 1. Allez à Storage
-- 2. Créez un bucket "product-images" (private)
-- 3. Créez un bucket "receipts" (private)

-- ============================================================
-- 5. CRÉER UN ADMIN PAR DÉFAUT (OPTIONNEL)
-- ============================================================
-- Note: Vous devez d'abord créer un utilisateur via Supabase Auth
-- Puis exécutez ce script pour le rendre admin:
--
-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE email = 'votre-email@example.com';

-- ============================================================
-- FIN DU SCRIPT
-- ============================================================
