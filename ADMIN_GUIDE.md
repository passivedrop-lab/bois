# 🔐 Dashboard Admin - Guide Complet

## Accès au Dashboard Admin

### URL de Connexion
```
https://votre-domaine.com/admin/login
```

### Identifiants de Connexion (Démo)
- **Email:** `admin@tsarstvadereva.ru`
- **Mot de passe:** `TsarstvoDereva2025`

> ⚠️ **Important:** En production, changer ces identifiants et utiliser une authentification sécurisée (Supabase, OAuth, etc.)

---

## 📊 Dashboard Principal (`/admin`)

Le dashboard affiche:
- **Commandes en attente**: Nombre de commandes en cours de vérification
- **Produits**: Total des produits dans le catalogue
- **Commandes totales**: Historique complet des commandes

### Actions Rapides
- ➕ Ajouter un produit
- 📋 Voir les commandes

---

## 📦 Gestion des Produits (`/admin/products`)

### Fonctionnalités

#### ➕ Créer un Produit (`/admin/products/new`)
1. Cliquer sur "+ Ajouter un produit"
2. Remplir les informations:
   - **Nom du produit** (requis)
   - **Catégorie** (sélectionner parmi les 8 catégories disponibles)
   - **Prix en RUB** (requis)
   - **Prix promotionnel** (optionnel - affiche une réduction)
   - **Description** (requis - visible aux clients)
3. Cliquer "Créer le produit"

#### Catégories Disponibles
1. Bois de construction
2. Bois scié
3. Drog et Biotoplivо
4. Bois pour sauna
5. Bois décoratif
6. Panneaux et voiles
7. Bois d'extérieur
8. Bois brut/industriel

#### 🔍 Rechercher des Produits
- Utiliser la barre de recherche
- Recherche par nom ou catégorie
- Résultats en temps réel

#### ✏️ Modifier un Produit
- Cliquer l'icône ✏️ (edit)
- Mettre à jour les informations
- Sauvegarder

#### 🗑️ Supprimer un Produit
- Cliquer l'icône 🗑️ (delete)
- Confirmer la suppression
- Le produit n'apparaît plus dans le catalogue

---

## 📧 Gestion des Commandes (`/admin/orders`)

### Liste des Commandes
Affiche toutes les commandes avec:
- Numéro de commande
- Date de création
- Nom du client
- Montant total
- **Statut**: 
  - 🟡 **En attente** - Reçu téléversé, en attente de vérification
  - 🟢 **Validée** - Commande approuvée, prête pour l'expédition
  - 🔴 **Rejetée** - Commande refusée

### Actions sur une Commande

#### 👁️ Voir les Détails
1. Cliquer "Détails"
2. Modal affiche:
   - Informations client
   - Récapitulatif du montant
   - Fichier du reçu (si téléversé)

#### ✅ Valider une Commande
1. Cliquer "Valider" (pour statut "En attente")
2. La commande passe à statut **"Validée"**
3. Un email de confirmation est envoyé au client
4. Le client voit le changement de statut dans son historique

#### ❌ Rejeter une Commande
1. Cliquer "Rejeter" (pour statut "En attente")
2. Entrer une raison (optionnelle)
3. La commande passe à statut **"Rejetée"**
4. Un email d'explication est envoyé au client

---

## 📥 Téléversement de Reçus (Automatisé)

### Flux Client → Admin

#### 1️⃣ Client Téléverse le Reçu
- Page `/checkout/receipt`
- Client glisse-dépose ou sélectionne un fichier
- Formats acceptés: PNG, JPG, PDF (Max 10 Mo)

#### 2️⃣ Système Envoie à l'Admin
- Le fichier est uploadé via l'API `/api/receipts/upload`
- **Email automatique** à l'admin contenant:
  - Fichier du reçu de virement
  - ID de la commande
  - Email du client
  - Informations du paiement

#### 3️⃣ Admin Peut Vérifier et Valider
- Récupérer le reçu depuis le mail
- Vérifier l'authenticité du virement
- Aller dans `/admin/orders`
- Cliquer sur la commande
- Cliquer "Valider" ou "Rejeter"

---

## 🔄 Processus de Commande Complet

### Côté Client
1. Ajoute produits au panier → `/cart`
2. Clique "Passer la commande" → `/checkout`
3. Remplit infos personnelles et livraison
4. Reçoit coordonnées bancaires
5. Va à `/checkout/payment`
6. Effectue le virement
7. Va à `/checkout/receipt`
8. Téléverse le reçu
9. Reçoit confirmation "En attente de vérification"
10. Statut visible dans `/profile/orders`

### Côté Admin
1. Reçoit email avec reçu de virement
2. Va dans `/admin/orders`
3. Vérifie les détails de la commande
4. Clique "Valider" ou "Rejeter"
5. Client reçoit email de confirmation
6. Statut se met à jour pour le client

---

## 🔐 Sécurité & Authentification

### Authentification Actuelle (Démo)
- localStorage basique
- Vérifier `/admin/login` avant chaque action

### À Implémenter en Production
```typescript
// Utiliser Supabase Auth
const { session } = await supabase.auth.getSession()

// Ou JWT tokens
const isAdmin = verifyToken(token, adminSecret)

// Protéger les routes API
if (!isAuthenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
```

---

## 📧 Intégration Resend (À Configurer)

### Configuration Requise
1. Créer un compte [Resend.com](https://resend.com)
2. Ajouter à `.env.local`:
   ```
   RESEND_API_KEY=your_api_key_here
   ```

3. Mettre à jour les routes API:
   ```typescript
   // app/api/receipts/upload/route.ts
   import { Resend } from 'resend'
   
   const resend = new Resend(process.env.RESEND_API_KEY)
   
   await resend.emails.send({
     from: 'noreply@tsarstvadereva.ru',
     to: 'admin@tsarstvadereva.ru',
     subject: 'Nouveau reçu de virement',
     html: `<p>Reçu pour commande #${orderId}</p>`,
     attachments: [{ filename: file.name, content: fileBuffer }]
   })
   ```

---

## 💾 Base de Données

### Structure Recommandée (Supabase)

#### Table: products
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  price INT NOT NULL,
  promo_price INT,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)
```

#### Table: orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  order_number VARCHAR UNIQUE,
  customer_email VARCHAR,
  customer_name VARCHAR,
  amount INT NOT NULL,
  status VARCHAR DEFAULT 'pending', -- pending, verified, rejected
  receipt_file VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

---

## 🚀 Déploiement sur Vercel

### Variables d'Environnement à Ajouter
1. Aller sur [vercel.com](https://vercel.com)
2. Sélectionner le projet
3. Settings → Environment Variables
4. Ajouter:
   ```
   RESEND_API_KEY=your_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### Après Déploiement
- Admin accessible via: `https://votre-domaine.com/admin/login`
- Les reçus seront envoyés automatiquement à l'admin
- Les statuts des commandes se mettront à jour en temps réel

---

## ✅ Checklist de Configuration

- [ ] Changer les identifiants de connexion par défaut
- [ ] Configurer Supabase pour la BD
- [ ] Configurer Resend pour les emails
- [ ] Ajouter les variables d'environnement sur Vercel
- [ ] Tester le flux complet: produit → commande → reçu → validation
- [ ] Configurer un SSL/HTTPS
- [ ] Ajouter une authentification sécurisée (OAuth, Supabase Auth)
- [ ] Mettre en place des logs d'audit
- [ ] Tester les emails de notification

---

## 🆘 Dépannage

### Admin ne peut pas se connecter
1. Vérifier les identifiants
2. Vérifier localStorage (ouvrir DevTools > Application)
3. Effacer le cache du navigateur

### Les reçus ne sont pas reçus par email
1. Vérifier la clé API Resend
2. Vérifier les logs Vercel
3. Vérifier le dossier spam

### Les statuts de commande ne se mettent pas à jour
1. Vérifier que l'API `/api/orders/update-status` répond
2. Vérifier la connexion à la BD
3. Actualiser la page du client

---

**Dernière mise à jour:** 8 janvier 2026
**Version:** 1.0
