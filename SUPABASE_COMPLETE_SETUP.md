# 📋 Guide Complet Setup Supabase - BOIS RUSSE

## Étape 1: Exécuter le Script SQL

1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor** (en haut à gauche)
4. Créez une nouvelle requête
5. Copiez le contenu complet du fichier `supabase-schema.sql`
6. Collez-le dans l'éditeur SQL
7. Cliquez sur **Run** (ou Ctrl+Entrée)

**⚠️ Attention:** Ce script:
- Supprime les tables existantes (DROP TABLE IF EXISTS)
- Recrée les tables vides
- Configure la Row Level Security (RLS)

Si vous avez des données existantes à préserver, **sauvegardez-les d'abord!**

---

## Étape 2: Créer les Buckets de Storage

Vous avez 2 options:

### Option A: Via l'interface web (Plus facile)

1. Allez dans **Storage** (en haut à gauche)
2. Cliquez sur **Create bucket**
3. Créez le bucket **`product-images`** avec les paramètres:
   - **Public**: OFF (décoché - pour garder les images privées)
   - **File size limit**: 10 MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/gif`

4. Créez le bucket **`receipts`** avec les paramètres:
   - **Public**: OFF
   - **File size limit**: 50 MB
   - **Allowed MIME types**: `application/pdf, image/jpeg, image/png`

### Option B: Via CLI (Si vous avez Supabase CLI installée)

```bash
# Connectez-vous à Supabase
supabase login

# Créez les buckets
supabase storage create product-images --public false
supabase storage create receipts --public false
```

---

## Étape 3: Créer un Utilisateur Admin

1. Allez dans **Authentication** → **Users**
2. Cliquez sur **Add user**
3. Remplissez:
   - **Email**: votre email admin (ex: `admin@boisrusse.com`)
   - **Password**: un mot de passe fort
4. Cliquez sur **Create user**

---

## Étape 4: Rendre l'Utilisateur Admin

1. Allez dans **SQL Editor**
2. Créez une nouvelle requête avec ce code (remplacez l'email):

```sql
-- Rendre un utilisateur admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@boisrusse.com';
```

3. Cliquez sur **Run**

**Vérification:**

```sql
-- Vérifier que l'admin a bien le rôle
SELECT id, email, role FROM profiles WHERE email = 'admin@boisrusse.com';
```

---

## Étape 5: Vérifier la Configuration

Exécutez ces requêtes dans le SQL Editor pour vérifier:

```sql
-- 1. Vérifier que les tables existent
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 2. Vérifier qu'il y a au moins un admin
SELECT COUNT(*) as admin_count FROM profiles WHERE role = 'admin';

-- 3. Vérifier les indexes
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY indexname;
```

---

## Étape 6: Configurer les RLS (Row Level Security)

Les RLS sont déjà configurées par le script SQL. Voici ce qui a été fait:

### Table `products`:
- ✅ **Publique en lecture**: Tout le monde peut voir les produits
- ✅ **Modification admin seulement**: Seuls les utilisateurs avec `role = 'admin'` peuvent créer/modifier/supprimer

### Table `otps`:
- ✅ **Blocage total public**: Pas d'accès direct
- ✅ **Service role only**: Les API utilisent le service role (bypass RLS)

### Table `profiles`:
- ✅ **Lecture privée**: Chacun voit seulement son profil
- ✅ **Modification privée**: Chacun ne peut modifier que son profil
- ✅ **Service role management**: Les API peuvent créer des profils

### Table `orders`:
- ✅ **Utilisateurs voient leurs commandes**: Chacun ne voit que ses propres commandes
- ✅ **Service role management**: Les API gèrent toutes les commandes

### Table `favorites`:
- ✅ **Utilisateurs gèrent leurs favoris**: Chacun gère ses propres favoris

---

## Étape 7: Tester que Tout Fonctionne

### Test 1: Créer un produit via le dashboard admin

1. Allez sur `http://localhost:3000/admin/products`
2. Cliquez sur "Créer un nouveau produit"
3. Remplissez le formulaire:
   - Nom: "Test Bois"
   - Catégorie: "Bois de chauffage"
   - Prix: "50"
   - Description: "Test"
   - Image: téléchargez une image
4. Cliquez sur "Créer"

**Résultat attendu**: 
- ✅ Le produit apparaît dans la liste
- ✅ L'image est stockée dans le bucket `product-images`
- ✅ Un message de succès s'affiche

### Test 2: Lister les produits

```bash
curl 'http://localhost:3000/api/admin/products' \
  -H "Content-Type: application/json"
```

**Résultat attendu**: 
- ✅ Retourne un array de produits avec `image_url` (URL signée)

### Test 3: Tester l'OTP

```bash
curl -X POST 'http://localhost:3000/api/auth/send-otp' \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Résultat attendu**:
- ✅ Retourne `{ code: "123456" }` (en dev mode)
- ✅ Une entrée est créée dans la table `otps`

---

## Étape 8: Variables d'Environnement (.env.local)

Vérifiez que votre `.env.local` contient:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend Email
RESEND_API_KEY=your-resend-api-key
SENDER_EMAIL=your-sender-email@example.com
ADMIN_EMAIL=admin@example.com

# Storage
SUPABASE_PRODUCT_BUCKET=product-images
SUPABASE_RECEIPTS_BUCKET=receipts

# Admin Protection
ALLOW_DELETE_ALL=true
ADMIN_DELETE_TOKEN=your-strong-token-here
```

**Où trouver ces clés?**

1. **SUPABASE_URL & ANON_KEY**:
   - Allez dans **Settings** → **API**
   - Copier depuis la section "Project API keys"

2. **SUPABASE_SERVICE_ROLE_KEY**:
   - Même endroit, sous "Service Role Secret"
   - ⚠️ **NE JAMAIS partager cette clé!**

3. **RESEND_API_KEY**:
   - Allez sur [Resend Dashboard](https://resend.com)
   - Créez une API key
   - ⚠️ **NE JAMAIS partager cette clé!**

---

## ✅ Checklist de Vérification

- [ ] Script SQL exécuté sans erreurs
- [ ] Buckets `product-images` et `receipts` créés
- [ ] Utilisateur admin créé
- [ ] Admin assigné le rôle `admin`
- [ ] Toutes les tables existent (requête SQL #1)
- [ ] Tous les indexes existent (requête SQL #3)
- [ ] Variables d'environnement configurées
- [ ] Test création produit réussi
- [ ] Test OTP réussi

---

## 🐛 Troubleshooting

### "Error: relation 'products' does not exist"
→ Le script SQL n'a pas été exécuté. Allez à l'étape 1.

### "Error: invalid permission insert into 'products'"
→ Les RLS bloquent l'accès. Vérifiez que:
- Vous êtes connecté en tant qu'admin
- Le service role key est correct dans `.env.local`

### "Error: bucket not found"
→ Créez les buckets (étape 2).

### "Cannot read property 'image_url'"
→ Les images ne sont pas téléchargées correctement. Vérifiez:
- Que le bucket existe et est accessible
- Que les permissions du bucket sont correctes

### "OTP not verified"
→ Vérifiez que:
- La table `otps` existe
- L'OTP n'a pas expiré
- Le code est correct (sensible à la casse)

---

## 📚 Ressources Supplémentaires

- [Docs Supabase SQL](https://supabase.com/docs/guides/sql)
- [Docs Supabase RLS](https://supabase.com/docs/learn/auth-deep-dive/row-level-security)
- [Docs Supabase Storage](https://supabase.com/docs/guides/storage)
- [Resend Documentation](https://resend.com/docs)

---

**Besoin d'aide?** Vérifiez les logs:
- Navigateur: F12 → Console et Network tabs
- Terminal: `npm run dev` et cherchez les erreurs rouges
- Supabase: Allez dans **Logs** pour voir les erreurs du serveur
