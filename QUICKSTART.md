# 🚀 Démarrage Rapide - Dashboard Admin

## Accès Immédiat

### 1. Aller au Login Admin
```
URL: http://localhost:3000/admin/login
ou
https://votre-domaine.com/admin/login
```

### 2. Credentials de Connexion (Démo)
```
Email: admin@tsarstvadereva.ru
Mot de passe: TsarstvoDereva2025
```

⚠️ **À changer en production!**

---

## 📊 Dashboard Admin - Quickstart

### 👁️ Voir le Dashboard
```
/admin
```
Vue d'ensemble avec statistiques clés

---

## 📦 Gérer les Produits

### Lister les Produits
```
/admin/products
```
- Voir tous les produits
- Rechercher par nom
- Cliquer ✏️ pour modifier
- Cliquer 🗑️ pour supprimer

### Ajouter un Produit
```
/admin/products/new
```
Remplir:
- **Nom** - "Bois de construction brut"
- **Catégorie** - (sélectionner dans les 8 options)
- **Prix** - 15000 ₽
- **Prix promo** - 12000 ₽ (optionnel)
- **Description** - Détails du produit

Cliquer **"Créer le produit"**

---

## 📧 Gérer les Commandes

### Voir toutes les Commandes
```
/admin/orders
```

Affiche:
- 🟡 **En attente** (reçu reçu, attend vérif)
- 🟢 **Validée** (approuvée)
- 🔴 **Rejetée** (refusée)

### Valider une Commande

1. Cliquer sur commande "En attente"
2. Cliquer **"Détails"**
3. Vérifier les infos et le reçu (PDF/IMG)
4. Cliquer **"Valider la commande"**

✅ **Client recevra email** de confirmation  
✅ **Statut change** à "Validée" dans son historique

### Rejeter une Commande

1. Cliquer sur commande "En attente"
2. Cliquer **"Rejeter"**
3. Entrer une **raison** (optionnel)
   - "Montant invalide"
   - "Reçu illisible"
   - etc.
4. Cliquer **"Rejeter"**

❌ **Client recevra email** d'explication  
❌ **Statut change** à "Rejetée"

---

## 🔄 Flux Complet (Simul.)

### Client Part 1: Commande
```
1. Visite accueil → /
2. Browse catalogue → /catalogue
3. Ajoute au panier → /cart
4. Passe commande → /checkout
   - Remplie infos + livraison
5. Voit virement → /checkout/payment
   - Банк: СБЕРБАНК
   - Получатель: Коссиви Жоашим Микаель Эдем С.
   - Номер карты: 2202 2069 4562 7276
   - Montant: 50000 ₽
6. Effectue virement (dans sa banque)
7. Téléverse reçu → /checkout/receipt
   - Glisse-dépose PDF/IMG
8. Voir statut "En attente" → /profile/orders
```

### Admin Part 2: Validation
```
1. Se connecte → /admin/login
2. Va aux commandes → /admin/orders
3. Reçoit email (Resend) avec reçu
4. Clique sur commande
5. Vérifie le reçu
6. Valide ou rejette ✅/❌
```

### Client Part 3: Confirmation
```
1. Reçoit email (Resend)
   - ✅ Validée
   - ou ❌ Rejetée
2. Voit changement dans /profile/orders
```

---

## 💾 Données de Test

### Produit Test
```
Nom: Bois de construction brut
Catégorie: Bois de construction
Prix: 15000 ₽
Prix promo: 12000 ₽
Description: Bois de qualité premium pour tous vos projets
```

### Commande Test
```
Commande #: 003
Client: Jean Dupont
Email: jean@example.com
Montant: 50000 ₽
Status: En attente
Reçu: receipt_003.pdf
```

---

## 🔧 Troubleshooting Rapide

### Problème: Impossible de se connecter
```
❌ Erreur: "Email ou mot de passe incorrect"

✅ Solution:
1. Vérifier email exact: admin@tsarstvadereva.ru
2. Vérifier pwd: TsarstvoDereva2025
3. Effacer cache navigateur
4. Essayer incognito
```

### Problème: Recherche produits ne fonctionne pas
```
❌ Pas de résultats

✅ Solution:
1. Vérifier orthographe
2. Essayer catégorie au lieu du nom
3. Actualiser la page
4. Vérifier que des produits existent
```

### Problème: Boutons "Valider/Rejeter" grisés
```
❌ Boutons désactivés

✅ Solution:
1. Vérifier statut = "En attente"
2. Actualiser la page
3. Vérifier connexion admin
```

---

## 📧 Intégration Resend (En Attente)

### À Configurer
1. Créer compte [Resend.com](https://resend.com)
2. Ajouter à `.env.local`:
   ```
   RESEND_API_KEY=re_your_api_key
   ```
3. Redéployer sur Vercel

### Puis les Emails Fonctionneront
- ✉️ Admin reçoit reçus
- ✉️ Client reçoit confirmations
- ✉️ Automatic flow activé

---

## 🔐 Changer Identifiants (Important!)

### En Production
Modifier dans `app/admin/login/page.tsx`:

```typescript
// AVANT:
if (email === 'admin@tsarstvadereva.ru' && password === 'TsarstvoDereva2025') {

// APRÈS:
if (email === 'votre-email@example.com' && password === 'votre-mot-de-passe') {
```

**Meilleure solution:** Utiliser Supabase Auth
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})
```

---

## 🚀 Déployer sur Vercel

```bash
# 1. Configurer variables Vercel
vercel env add RESEND_API_KEY
vercel env add ADMIN_EMAIL

# 2. Push code
git push origin main

# 3. Vercel auto-deploys
# Voir: https://vercel.com/projects/bois

# 4. Accéder
https://bois-production.vercel.app/admin/login
```

---

## 📞 Support Rapide

| Besoin | Action |
|--------|--------|
| Créer produit | `/admin/products/new` |
| Lister produits | `/admin/products` |
| Voir commandes | `/admin/orders` |
| Valider commande | Click ✅ in `/admin/orders` |
| Rejeter commande | Click ❌ in `/admin/orders` |
| Changer email | Modifier `app/admin/login/page.tsx` |
| Aide générale | Consulter `ADMIN_GUIDE.md` |

---

## ✅ Checklist Initial

- [ ] Accès login fonctionne
- [ ] Dashboard affiche stats
- [ ] Peut lister produits
- [ ] Peut ajouter produit
- [ ] Peut valider commande
- [ ] Peut rejeter commande
- [ ] Email démo reçu (optionnel)

---

**Dernière mise à jour:** 8 janvier 2026  
**Version:** 1.0  
**Status:** ✅ Prêt à l'emploi
