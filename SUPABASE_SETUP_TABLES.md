# 🔧 Guide de Configuration Supabase - Création des Tables

## ⚠️ Important - Lire d'abord

Si vous créez des produits et recevez une **erreur "Erreur création produit"**, c'est parce que **les tables Supabase ne sont pas créées**.

## ✅ Étapes à Suivre

### 1️⃣ Accédez à Supabase SQL Editor
1. Allez sur [Supabase Console](https://app.supabase.com)
2. Sélectionnez votre projet BOIS
3. Cliquez sur **SQL Editor** dans la barre latérale
4. Cliquez sur **New Query**

### 2️⃣ Copiez et Exécutez le Schéma

Ouvrez le fichier `supabase-schema.sql` dans la racine du projet.

Copiez **TOUT** le contenu et collez-le dans l'éditeur SQL de Supabase.

Cliquez sur **Run** (ou utilisez `Cmd/Ctrl + Enter`)

### 3️⃣ Vérifiez que tout s'est bien passé

Vous devriez voir un message comme:
```
Query executed successfully
```

### 4️⃣ Créez le Bucket de Stockage

Allez dans **Storage** → **Buckets**

1. Cliquez sur **New Bucket**
2. Nommez-le: `product-images`
3. Sélectionnez **Private** (Important!)
4. Cliquez sur **Create Bucket**

### 5️⃣ Testez la Création de Produit

1. Allez à [http://localhost:3000/admin/products/new](http://localhost:3000/admin/products/new)
2. Remplissez le formulaire:
   - **Nom**: Ex. "Sapin du Nord"
   - **Catégorie**: Ex. "Bois de construction"
   - **Prix**: Ex. "50.00"
   - **Description**: Anything
   - **Image**: Sélectionnez une image PNG/JPG (max 5MB)
3. Cliquez sur **Сохранить** (Enregistrer)

### ✅ Si ça marche:
- Vous verrez le message vert "Товар успешно добавлен!" 
- Vous serez redirigé vers `/admin/products`
- Le produit apparaîtra avec sa photo

### ❌ Si vous avez encore une erreur:

1. **Ouvrez la console du navigateur** (F12) → onglet **Network**
2. Refaites la tentative de création
3. Cherchez la requête `POST /api/admin/products`
4. Cliquez dessus et regardez la réponse (onglet **Response**)
5. Le message d'erreur réel s'y trouvera

**Erreurs courantes:**
- `"Erreur: Relation "products" does not exist"` → Les tables n'ont pas été créées
- `"Erreur: Bucket not found"` → Le bucket `product-images` n'existe pas
- `"Erreur: Insert failed"` → Vérifiez les permissions RLS

---

## 🆘 Besoin d'Aide?

Copiez le message d'erreur exact et envoyez-le. Vous pouvez le voir:
1. En bas de l'écran de création de produit (message d'erreur rouge)
2. Dans la console du navigateur (F12)
3. Dans les logs Vercel (si vous déployez)

---

## 📋 Vérification Finale

Pour vérifier que tout est configuré:

Allez dans Supabase Console → **SQL Editor** → **New Query** et exécutez:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

Vous devriez voir:
- `products`
- `otps`
- `profiles`

Pour vérifier les buckets:
1. Allez dans **Storage** → **Buckets**
2. Vous devriez voir `product-images` (privé)
