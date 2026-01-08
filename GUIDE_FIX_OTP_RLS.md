# 🔧 Guide de Diagnostic et Correction des Permissions OTP

## Problème
L'API `/api/auth/send-otp` retourne une erreur lors de l'insertion de l'OTP dans Supabase.

**Cause probable:** Les permissions RLS (Row Level Security) sur la table `otps` bloquent les insertions du service role.

---

## ✅ Solution Complète

### Étape 1: Ajouter la colonne `city` (si non existante)

1. Allez dans **Supabase Dashboard → SQL Editor**
2. Créez une nouvelle requête
3. Copiez-collez le contenu de `MIGRATION_ADD_CITY.sql`
4. Cliquez sur **Run**

**Contenu:**
```sql
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS city TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
```

---

### Étape 2: Corriger les Permissions RLS sur `otps`

1. Allez dans **Supabase Dashboard → SQL Editor**
2. Créez une nouvelle requête
3. Copiez-collez le contenu de `SUPABASE_FIX_RLS_OTP.sql`
4. Cliquez sur **Run**

**Ce script fait:**
- ✅ Vérifie l'état actuel de la table `otps`
- ✅ Supprime les anciennes politiques restrictives
- ✅ Crée 4 nouvelles politiques RLS:
  - `Service role can insert otps` - permet les INSERT
  - `Service role can delete otps` - permet les DELETE (expiration)
  - `Service role can read otps` - permet les SELECT (vérification)
  - `Block public access to otps` - bloque l'accès public

---

## 🔍 Vérification du Diagnostic

Après avoir exécuté `SUPABASE_FIX_RLS_OTP.sql`, vous devez voir:

### Sortie 1: Table existe
```
✅ tablename: otps
```

### Sortie 2: Colonnes correctes
```
✅ email (text)
✅ code (text)
✅ expires_at (timestamp with time zone)
✅ created_at (timestamp with time zone)
```

### Sortie 3: RLS activé
```
✅ rowsecurity: true
```

### Sortie 4: Politiques RLS
```
✅ Block public access to otps
✅ Service role can delete otps
✅ Service role can insert otps
✅ Service role can read otps
```

---

## 🧪 Tester l'Inscription

Une fois terminé:

1. Allez sur `http://localhost:3000/login` (ou votre URL de production)
2. Entrez un email
3. Cliquez sur **Envoyer un code**
4. Vous devez voir: ✅ "Code OTP envoyé à votre email"
5. Vérifiez vos emails pour le code
6. Continuez avec l'inscription complète

---

## ❌ Si ça ne fonctionne pas?

### Vérifier les logs Supabase

1. Allez dans **Supabase Dashboard → Logs**
2. Cherchez des erreurs de permission
3. Regardez les messages d'erreur exacts

### Vérifier le code API

Allez dans **Supabase Dashboard → Database → RLS** et:
- Cliquez sur la table `otps`
- Vérifiez que les 4 politiques sont listées
- Assurez-vous que "RLS" est **ON** (bleu)

### Tester directement dans Supabase

Dans le SQL Editor, exécutez:
```sql
-- Vérifier les politiques
SELECT policyname, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'otps'
ORDER BY policyname;
```

---

## 📋 Checklist Finale

- [ ] Colonne `city` ajoutée à `profiles`
- [ ] RLS activé sur `otps`
- [ ] 4 politiques RLS créées
- [ ] Service role peut insérer dans `otps`
- [ ] Public access est bloqué
- [ ] Inscription fonctionne sans erreur
- [ ] Emails OTP sont reçus

---

**Si tous les points sont cochés, votre système est prêt! 🚀**
