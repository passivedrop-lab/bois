# 🚀 Guide Complet: Créer la Table OTP et Corriger les Permissions

## ⚠️ Problème Détecté

Vous avez vu **seulement "public"** dans les résultats du script de diagnostic. Cela signifie:
- ❌ Soit la table `otps` n'existe pas
- ❌ Soit les politiques RLS ne sont pas correctes

## ✅ Solution: Créer la Table de Zéro

### **Étape 1: Exécuter le script de création**

1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Copiez le contenu du fichier **`SUPABASE_CREATE_OTPS_TABLE.sql`**
5. Collez dans l'éditeur
6. Cliquez sur **Run**

---

## 📋 Ce que fait le script

### **Partie 1: Créer la table**
```sql
CREATE TABLE IF NOT EXISTS otps (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### **Partie 2: Activer RLS**
```sql
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;
```

### **Partie 3: Créer les politiques RLS**
- ✅ Service role peut **INSERT** (ajouter des OTP)
- ✅ Service role peut **SELECT** (lire/vérifier les OTP)
- ✅ Service role peut **DELETE** (supprimer les OTP expirés)
- ❌ Autres rôles sont **BLOQUÉS**

---

## 🔍 Vérifier que ça fonctionne

Le script affichera 4 vérifications:

### ✅ Vérification 1: Table existe
```
Table otps | EXISTE ✅
```

### ✅ Vérification 2: 4 colonnes
```
Colonnes otps | OK (4 colonnes) ✅
```

### ✅ Vérification 3: RLS activé
```
RLS activé | OUI ✅
```

### ✅ Vérification 4: Politiques RLS
```
Politiques RLS | 4 politiques trouvées ✅
```

Et vous verrez les 4 politiques:
```
Block all other access
Service role delete otps
Service role insert otps
Service role select otps
```

---

## 🧪 Tester après

Une fois le script exécuté:

### **Test 1: Vérifier que la table existe**

```sql
SELECT COUNT(*) FROM otps;
```
**Résultat attendu:** 0 (table vide mais fonctionnelle)

### **Test 2: Vérifier les permissions**

Allez sur **Database → RLS** dans Supabase:
- Cliquez sur la table `otps`
- Vous devez voir 4 politiques listées
- **RLS** doit être **ON** (bleu)

### **Test 3: Tester l'inscription**

1. Allez sur `http://localhost:3000/login`
2. Entrez un email
3. Cliquez **Envoyer un code**
4. **Résultat attendu:** ✅ "Code OTP envoyé à votre email"

---

## 📊 Résumé des politiques

| Politique | Rôle | Action | Résultat |
|-----------|------|--------|----------|
| Service role insert otps | service_role | INSERT | ✅ Autorisé |
| Service role select otps | service_role | SELECT | ✅ Autorisé |
| Service role delete otps | service_role | DELETE | ✅ Autorisé |
| Block all other access | authenticated, anon | ALL | ❌ Bloqué |

---

## ⚙️ Si vous devez recommencer à zéro

Si vous avez des données anciennes et voulez recommencer:

1. Dans le script `SUPABASE_CREATE_OTPS_TABLE.sql`, décommentez ces lignes (au début):
```sql
DROP TABLE IF EXISTS otps CASCADE;
```

2. Exécutez le script complètement

3. Ça va supprimer la table ET la recréer vierge

---

## 🎯 Checklist finale

- [ ] Script `SUPABASE_CREATE_OTPS_TABLE.sql` exécuté
- [ ] 4 vérifications affichent ✅
- [ ] Table `otps` existe avec 4 colonnes
- [ ] RLS est activé
- [ ] 4 politiques RLS sont créées
- [ ] Inscription fonctionne sans erreur
- [ ] Code OTP est reçu par email

---

**Une fois tout ✅, votre système OTP est opérationnel!** 🚀
