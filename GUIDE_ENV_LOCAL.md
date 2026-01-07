# Guide de configuration du fichier .env.local

## 📋 Contenu du fichier .env.local

Le fichier `.env.local` doit contenir les variables d'environnement suivantes pour Supabase :

```env
# Configuration Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
```

## 🔑 Comment obtenir ces valeurs

### 1. Créer un projet Supabase (si ce n'est pas déjà fait)
- Allez sur https://app.supabase.com
- Créez un nouveau projet ou sélectionnez un projet existant

### 2. Obtenir l'URL du projet
- Dans votre projet Supabase, allez dans **Settings** > **API**
- Copiez la valeur de **Project URL**
- C'est votre `NEXT_PUBLIC_SUPABASE_URL`
- Format : `https://xxxxx.supabase.co`

### 3. Obtenir la clé anonyme (anon key)
- Toujours dans **Settings** > **API**
- Dans la section **Project API keys**
- Copiez la valeur de **anon public**
- C'est votre `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Format : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 Étapes pour créer le fichier .env.local

1. **Créez le fichier** `.env.local` à la racine du projet (même niveau que `package.json`)

2. **Copiez le contenu** suivant et remplacez les valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
```

3. **Remplacez** `votre-projet.supabase.co` et `votre_cle_anon_ici` par vos vraies valeurs

4. **Sauvegardez** le fichier

## ⚠️ Important

- Le fichier `.env.local` est déjà dans `.gitignore` et ne sera **pas** commité sur Git
- Ne partagez **jamais** vos clés Supabase publiquement
- La clé `anon` est publique et peut être utilisée côté client, mais elle est protégée par les Row Level Security (RLS) policies

## ✅ Vérification

Après avoir créé le fichier `.env.local` :

1. **Redémarrez** le serveur de développement :
   ```bash
   npm run dev
   ```

2. Les avertissements "Supabase environment variables are not configured" devraient disparaître

3. Les fonctionnalités Supabase (authentification, panier, favoris, commandes) devraient fonctionner

## 🗄️ Configuration de la base de données

N'oubliez pas d'exécuter le script SQL dans Supabase :
- Ouvrez l'éditeur SQL de votre projet Supabase
- Exécutez le contenu du fichier `supabase-setup.sql`
- Cela créera toutes les tables nécessaires (profiles, orders, order_items, user_cart, user_favorites)


