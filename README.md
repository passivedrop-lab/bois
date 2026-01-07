# ДРОВА ПРЕМИУМ - Site de vente de bois de chauffage

Site e-commerce moderne et ultra-élégant pour la vente de bois de chauffage, pellets, poêles et accessoires en Russie.

## 🚀 Technologies utilisées

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling moderne et responsive avec design premium
- **Framer Motion** - Animations fluides et élégantes
- **Supabase** - Backend as a Service (Authentification, Base de données)
- **Zustand** - Gestion d'état pour panier et favoris
- **React Hot Toast** - Notifications élégantes
- **Lucide React** - Icônes modernes

## ✨ Fonctionnalités

### Authentification complète
- ✅ Inscription et connexion avec Supabase
- ✅ Confirmation par email
- ✅ Changement d'email et mot de passe
- ✅ Gestion de session persistante
- ✅ Protection des routes

### Profil utilisateur
- ✅ Profil complet avec informations personnelles
- ✅ Liste des commandes avec statuts
- ✅ Gestion des favoris synchronisée avec Supabase
- ✅ Paramètres de sécurité (changement email/mot de passe)

### E-commerce
- ✅ Panier persistant (localStorage + Supabase)
- ✅ Page checkout complète avec informations de livraison
- ✅ Système de favoris
- ✅ Catalogue de produits avec filtres et tri
- ✅ Design ultra-élégant et professionnel

### Design Premium
- ✅ Animations fluides avec Framer Motion
- ✅ Design responsive parfait
- ✅ Palette de couleurs chaudes (bois, feu)
- ✅ Typographie élégante (Playfair Display, Cormorant Garamond)
- ✅ Effets glassmorphism et gradients
- ✅ Ombres et transitions premium

## 📦 Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer Supabase :
   - Créer un projet sur [supabase.com](https://supabase.com)
   - Copier `.env.local.example` vers `.env.local`
   - Remplir les variables d'environnement :
     ```
     NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
     NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
     ```

3. Créer les tables dans Supabase :
   - Exécuter le SQL suivant dans l'éditeur SQL de Supabase :

```sql
-- Table des profils utilisateurs
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Россия',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commandes
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_postal_code TEXT NOT NULL,
  shipping_country TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles de commande
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL
);

-- Table du panier utilisateur
CREATE TABLE user_cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Table des favoris
CREATE TABLE user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Fonction pour créer automatiquement un profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le profil à l'inscription
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Politique RLS pour les profils
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Politique RLS pour les commandes
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique RLS pour le panier
ALTER TABLE user_cart ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart"
  ON user_cart FOR ALL
  USING (auth.uid() = user_id);

-- Politique RLS pour les favoris
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites"
  ON user_favorites FOR ALL
  USING (auth.uid() = user_id);
```

4. Lancer le serveur de développement :
```bash
npm run dev
```

5. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 📁 Structure du projet

```
Bois/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx            # Page d'accueil
│   ├── login/              # Authentification
│   ├── profile/             # Profil utilisateur
│   │   ├── orders/         # Commandes
│   │   ├── favorites/      # Favoris
│   │   └── settings/       # Paramètres
│   ├── products/           # Pages produits
│   ├── cart/               # Panier
│   ├── checkout/           # Checkout
│   └── favorites/          # Page favoris publique
├── components/             # Composants React
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── AuthProvider.tsx
│   └── ...
├── lib/
│   ├── supabase/           # Configuration Supabase
│   ├── store/              # Stores Zustand
│   └── types/              # Types TypeScript
└── middleware.ts           # Middleware Next.js pour Supabase
```

## 🎯 Fonctionnalités détaillées

### Authentification
- Inscription avec email et mot de passe
- Connexion sécurisée
- Confirmation par email
- Changement d'email (avec vérification)
- Changement de mot de passe
- Déconnexion

### Profil utilisateur
- Édition des informations personnelles
- Gestion de l'adresse de livraison
- Historique des commandes
- Liste des favoris synchronisée
- Paramètres de sécurité

### Panier et commandes
- Panier persistant (localStorage + Supabase)
- Gestion des quantités
- Page checkout complète
- Création de commandes
- Suivi des statuts

## 🎨 Design

Le site utilise un design premium avec :
- **Couleurs** : Palette chaleureuse (bois, feu)
- **Typographie** : Fonts élégantes (Playfair Display, Cormorant Garamond)
- **Animations** : Transitions fluides avec Framer Motion
- **Effets** : Glassmorphism, gradients, ombres premium
- **Responsive** : Design adaptatif pour tous les écrans

## 📝 Notes

- Le site est entièrement en russe
- Toutes les fonctionnalités sont intégrées avec Supabase
- Le panier et les favoris sont synchronisés entre localStorage et Supabase
- Les emails de confirmation sont gérés par Supabase

## 🔒 Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Authentification sécurisée avec Supabase Auth
- Protection des routes avec middleware
- Validation des données côté client et serveur
