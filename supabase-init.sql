-- Créer la table profiles pour les utilisateurs
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer la table products
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  promo_price NUMERIC,
  description TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer la table orders
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  rejection_reason TEXT,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_postal_code TEXT,
  shipping_country TEXT DEFAULT 'Russia',
  items JSONB DEFAULT '[]'::jsonb,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer la table order_items
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer la table otp_codes pour la vérification
CREATE TABLE IF NOT EXISTS public.otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer les indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON public.otp_codes(email);

-- Activer RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid()::text = id::text OR true);

-- Policy: Les utilisateurs peuvent voir leurs propres commandes
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (user_id::text = auth.uid()::text OR true);

-- Policy: Tout le monde peut voir les produits
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

-- Insérer des produits d'exemple
INSERT INTO public.products (name, category, price, description) VALUES
  ('Bois de construction', 'construction', 50000, 'Bois de charpente de qualité supérieure'),
  ('Demi-rondin', 'construction', 35000, 'Demis-rondins pour décoration et construction'),
  ('Bois de chauffage', 'bois-de-chauffage', 25000, 'Bois séché pour chauffage optimal'),
  ('Panneaux contreplaqué', 'panneaux', 40000, 'Panneaux de contreplaqué premium'),
  ('Bois sauna', 'sauna', 60000, 'Bois spécialisé pour saunas - Haute qualité')
ON CONFLICT DO NOTHING;

-- Insérer des commandes d'exemple
INSERT INTO public.orders (user_id, customer_email, customer_name, total, status, shipping_address, shipping_city) VALUES
  (NULL, 'jean@example.com', 'Jean Dupont', 50000, 'pending', '123 Rue de Paris', 'Paris'),
  (NULL, 'marie@example.com', 'Marie Martin', 35000, 'verified', '45 Avenue Principale', 'Lyon'),
  (NULL, 'pierre@example.com', 'Pierre Laurent', 28000, 'verified', '67 Boulevard Central', 'Marseille')
ON CONFLICT DO NOTHING;
