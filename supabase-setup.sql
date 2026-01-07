-- ============================================
-- SQL SCHEMA PRO "ДРОВА ПРЕМИУМ" (VERSION FINALE PROPRE)
-- Optimisé pour Supabase
-- ============================================

-- 1. EXTENSIONS & STORAGE
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Création du bucket pour les reçus
-- Note: Si l'insertion SQL échoue, créez manuellement un bucket nommé 'receipts' en Public.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Policies pour le storage (reçus de virement)
CREATE POLICY "Public Access to Receipts" ON storage.objects FOR SELECT USING (bucket_id = 'receipts');
CREATE POLICY "Authenticated users can upload receipts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'receipts' AND auth.role() = 'authenticated');

-- 2. TABLES PRINCIPALES

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'Россия',
    avatar_url TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    sku TEXT UNIQUE,
    wood_species TEXT,
    moisture_content TEXT,
    dimensions TEXT,
    badge TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    average_rating NUMERIC(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    main_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_verification', 'payment_validated', 'processing', 'shipped', 'delivered', 'cancelled')),
    total_amount NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) DEFAULT 0,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_postal_code TEXT NOT NULL,
    shipping_country TEXT DEFAULT 'Россия',
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending_verification', 'paid', 'refunded')),
    payment_method TEXT DEFAULT 'bank_transfer',
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles de commande
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL
);

-- Panier et Favoris
CREATE TABLE IF NOT EXISTS user_cart (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS user_favorites (
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
);

-- Avis
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    user_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. FONCTIONS ET TRIGGERS

-- Timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Création auto du profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'customer');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. SÉCURITÉ (RLS)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by owner" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles updateable by owner" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all orders" ON orders FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins update orders" ON orders FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own items" ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Admins view all items" ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE user_cart ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Manage own cart" ON user_cart FOR ALL USING (auth.uid() = user_id);

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Manage own favorites" ON user_favorites FOR ALL USING (auth.uid() = user_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Auth users post reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. DONNÉES DE DÉPART (SEED)

INSERT INTO categories (name, slug, description, icon) VALUES 
('Дрова для отопления', 'firewood', 'Высококачественные дрова различных пород дерева', 'TreePine'),
('Пеллеты и гранулы', 'pellets', 'Экологичные пеллеты премиум класса', 'Package'),
('Печи и камины', 'stoves', 'Современные печи и камины для дома', 'Flame'),
('Котлы', 'boilers', 'Эффективные котлы на твердом топливе', 'Wrench'),
('Аксессуары', 'accessories', 'Все необходимое для отопления', 'Truck')
ON CONFLICT (slug) DO NOTHING;

DO $$ 
DECLARE 
    cat_firewood UUID;
BEGIN
    SELECT id INTO cat_firewood FROM categories WHERE slug = 'firewood';
    INSERT INTO products (category_id, name, slug, price, badge, wood_species, dimensions) VALUES
    (cat_firewood, 'Дрова дубовые 30 см - 3,1 стера', 'oak-firewood-30cm', 4510.00, 'Хит продаж', 'Дуб', '30 см');
END $$;
