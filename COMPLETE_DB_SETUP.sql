-- ============================================================
-- SCRIPT COMPLET ET FINAL - BOIS RUSSE (TSARSTVODEREVA)
-- ============================================================
-- Ce script configure l'intégralité de la base de données.
-- Il peut être exécuté dans l'éditeur SQL de Supabase.
-- ============================================================

-- 1. NETTOYAGE (Optionnel - décommentez pour repartir de zéro)
-- DROP TABLE IF EXISTS contacts CASCADE;
-- DROP TABLE IF EXISTS favorites CASCADE;
-- DROP TABLE IF EXISTS user_cart CASCADE;
-- DROP TABLE IF EXISTS order_items CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================================
-- 2. TABLES
-- ============================================================

-- A. Table des profils (Liée à auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT, -- Ajouté pour le dashboard
  city TEXT,  -- Ajouté pour le dashboard
  role TEXT DEFAULT 'user', -- 'user' ou 'admin'
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- B. Table des produits
CREATE TABLE IF NOT EXISTS products (
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

-- C. Table des commandes
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected', 'processing', 'shipped', 'delivered', 'cancelled'
  delivery_address TEXT,
  shipping_city TEXT, -- Ajout optionnel pour filtrage facile
  rejection_reason TEXT, -- Ajouté pour la gestion admin
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- D. Table des éléments de commande (Liaison commande <-> produit)
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name TEXT, -- Snapshot du nom au moment de la commande
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL, -- Snapshot du prix au moment de la commande
  created_at TIMESTAMP DEFAULT now()
);

-- E. Panier utilisateur (Persistant)
CREATE TABLE IF NOT EXISTS user_cart (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- F. Favoris
CREATE TABLE IF NOT EXISTS favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- G. Contacts / Messages
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT now()
);

-- ============================================================
-- 3. TRIGGERS & FONCTIONS
-- ============================================================

-- Fonction pour créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS) - POLITIQUES
-- ============================================================

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- --- PROFILES ---
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
-- Permettre aux admins de tout voir (optionnel, mais utile)
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (
  exists(select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- --- PRODUCTS ---
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admins write products" ON products FOR ALL USING (
  exists(select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- --- ORDERS ---
-- Les utilisateurs voient leurs propres commandes
CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
-- Les utilisateurs peuvent créer des commandes
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Les admins voient et gèrent toutes les commandes
CREATE POLICY "Admins manage all orders" ON orders FOR ALL USING (
  exists(select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- --- ORDER ITEMS ---
-- Accès via la commande parente ou admin
CREATE POLICY "Users read own order items" ON order_items FOR SELECT USING (
  exists(select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
CREATE POLICY "Users create order items" ON order_items FOR INSERT WITH CHECK (
  exists(select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
CREATE POLICY "Admins manage order items" ON order_items FOR ALL USING (
  exists(select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- --- USER CART ---
CREATE POLICY "Users manage own cart" ON user_cart FOR ALL USING (auth.uid() = user_id);

-- --- FAVORITES ---
CREATE POLICY "Users manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- --- CONTACTS ---
CREATE POLICY "Public create contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage contacts" ON contacts FOR ALL USING (
  exists(select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ============================================================
-- 5. STOCKAGE (Rappel)
-- ============================================================
-- N'oubliez pas de créer les buckets 'product-images' et 'receipts' dans l'onglet Storage de Supabase.
