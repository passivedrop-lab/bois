# 📊 Guide - Dashboard Admin Fonctionnel

## 🎯 Vue d'ensemble

Le dashboard admin affiche **les vraies données** comptées en temps réel depuis Supabase:

- ✅ Commandes en attente (comptées depuis la BD)
- ✅ Nombre total de produits
- ✅ Nombre total de commandes
- ✅ Chiffre d'affaires total (somme des montants)

## 🚀 Accès au Dashboard

### Connexion Admin

```
URL: /admin/login
Email: admin@tsarstvadereva.ru
Pwd: TsarstvoDereva2025
```

### Mode Test (Sans Supabase)

Le dashboard affiche des **données de test** si Supabase n'est pas configuré:

```javascript
// Si NEXT_PUBLIC_SUPABASE_URL n'existe pas:
setStats({
  pendingOrders: 3,
  totalProducts: 24,
  totalOrders: 142,
  totalRevenue: 45680,
})
```

## 📈 Statistiques en Temps Réel

### 1. Commandes en Attente

```typescript
// Compte les commandes avec status = 'pending'
const pendingOrders = orders.filter((o) => o.status === 'pending').length
```

**Affichage:** Nombre jaune avec icône panier
**Mise à jour:** Automatique lors du chargement

### 2. Total Produits

```typescript
// Compte les produits dans la table
const totalProducts = products.length
```

**Affichage:** Nombre bleu avec icône package
**Source:** Table `products` Supabase

### 3. Total Commandes

```typescript
// Tous les ordres (tous statuts)
const totalOrders = orders.length
```

**Affichage:** Nombre vert avec icône tendance
**Source:** Table `orders` Supabase

### 4. Revenu Total

```typescript
// Somme de tous les montants
const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
```

**Affichage:** Montant en ₽ format abrégé (45.6k₽)
**Calcul:** Temps réel
**Format:** `{(totalRevenue / 1000).toFixed(1)}k₽`

## 🔄 Chargement des Données

### Flux de Chargement

```typescript
useEffect(() => {
  const token = localStorage.getItem('adminToken')
  if (!token) {
    router.push('/admin/login')
  } else {
    setIsAuthenticated(true)
    loadStats()  // ← Charger les stats
  }
}, [router])

async function loadStats() {
  try {
    // Créer client Supabase
    const supabase = createClient(url, key)
    
    // Requête parallèle des deux tables
    const [ordersRes, productsRes] = await Promise.all([
      supabase.from('orders').select('id, total, status'),
      supabase.from('products').select('id'),
    ])
    
    // Calculer les stats
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    
    // Mettre à jour
    setStats({
      pendingOrders,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
    })
  } finally {
    setLoading(false)
  }
}
```

## 🎨 Affichage des Cartes

### Carte Statistique

```
┌─────────────────────────────────┐
│  Commandes en attente           │
│                              🛒  │
│  3                              │
│  (icône jaune)                  │
└─────────────────────────────────┘
```

**Code:**
```tsx
{statCards.map((stat) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-wood-600 text-sm">{stat.label}</p>
        <p className="text-3xl font-bold">{stat.value}</p>
      </div>
      <div className={stat.bgColor}>
        <Icon size={24} className={stat.color} />
      </div>
    </div>
  </div>
))}
```

## 🎯 Actions Rapides

### Boutons du Dashboard

**1. Ajouter un Produit**
```
+ Ajouter un produit → /admin/products/new
```

**2. Gérer les Commandes**
```
Gérer les commandes (3) → /admin/orders
```
*Le nombre entre parenthèses = commandes en attente*

## 🔐 Protection du Dashboard

Le dashboard est **protégé** par authentification:

```typescript
useEffect(() => {
  const token = localStorage.getItem('adminToken')
  if (!token) {
    router.push('/admin/login')  // ← Redirection si pas connecté
  }
}, [router])
```

**Flux:**
```
Accès /admin
    ↓
Vérifier token localStorage
    ↓
   Token existe?
   ├─ OUI → Charger le dashboard
   └─ NON → Redirection /admin/login
```

## 📊 Mise à Jour des Données

### Automatique

Les données sont **chargées au démarrage** et mises en cache localement.

### Manuel

Pour **rafraîchir** les données:

```typescript
// Solution 1: Recharger la page
location.reload()

// Solution 2: Implémenter bouton refresh
const handleRefresh = () => {
  setLoading(true)
  loadStats()
}
```

## 🗄️ Base de Données Utilisée

### Tables Requises

**1. `orders`**
```sql
SELECT id, total, status FROM orders
```

Statuts: `pending`, `verified`, `rejected`

**2. `products`**
```sql
SELECT id FROM products
```

Simplement le compte des produits

### Exemple de Requête

```sql
-- Commandes en attente
SELECT COUNT(*) FROM orders WHERE status = 'pending'

-- Revenue total
SELECT SUM(total) FROM orders

-- Total produits
SELECT COUNT(*) FROM products

-- Tous les ordres
SELECT id, total, status FROM orders
```

## 🔌 Intégration Supabase

### Configuration .env

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxx
```

### Code Client

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Requête
const { data: orders, error } = await supabase
  .from('orders')
  .select('id, total, status')
```

## 🧪 Tester le Dashboard

### Étape 1: Lancer le serveur

```bash
cd /home/deo/Desktop/bois
npm run dev
```

### Étape 2: Aller à la page login admin

```
http://localhost:3000/admin/login
```

### Étape 3: Se connecter

```
Email: admin@tsarstvadereva.ru
Pwd: TsarstvoDereva2025
```

### Étape 4: Vérifier les statistiques

```
- Commandes en attente: 3 (ou votre nombre)
- Produits: 24 (ou votre nombre)
- Commandes totales: 142 (ou votre nombre)
- Revenu: 45680₽ (ou votre montant)
```

## 📈 Cas d'Usage Réels

### Scénario 1: Vous ajoutez un produit

```
1. /admin/products/new
2. Remplir le formulaire
3. Soumettre
4. Retour au /admin
5. Total produits: 25 (au lieu de 24)
```

### Scénario 2: Nouvelle commande client

```
1. Client passe commande 50000₽
2. Revenu total: 45680₽ → 95680₽
3. Commandes totales: 142 → 143
4. Commandes en attente: 3 → 4
```

### Scénario 3: Validation d'une commande

```
1. /admin/orders
2. Cliquer "Valider" sur une commande
3. Revenir au /admin
4. Commandes en attente: 4 → 3
```

## ⚙️ Personnalisation

### Changer les Couleurs des Cartes

```typescript
const statCards = [
  {
    label: 'Commandes en attente',
    value: stats.pendingOrders.toString(),
    icon: ShoppingCart,
    color: 'text-yellow-600',        // ← Couleur icône
    bgColor: 'bg-yellow-50',         // ← Couleur fond
  },
  // ...
]
```

### Ajouter Nouvelle Statistique

```typescript
{
  label: 'Clients',
  value: stats.totalClients.toString(),
  icon: Users,
  color: 'text-purple-600',
  bgColor: 'bg-purple-50',
}
```

## 🚀 Déploiement

### Sur Vercel

```bash
git add -A
git commit -m "feat: working admin dashboard"
git push origin main
# Vercel déploie automatiquement
```

### Vérifier en Production

```
https://votre-domaine.com/admin/login
```

## 🐛 Troubleshooting

### "Dashboard vide" / Pas de données

**Cause:** Supabase non configuré
**Solution:** Vérifier .env avec clés Supabase

### "Erreur 401 Unauthorized"

**Cause:** Token admin invalide
**Solution:** Se reconnecter via /admin/login

### "Les stats ne se mettent pas à jour"

**Cause:** Cache navigateur
**Solution:** `Ctrl+F5` pour hard refresh

### "Revenu négatif ou erreur de calcul"

**Cause:** Données corrompues en BD
**Solution:** Vérifier colonne `total` INTEGER/NUMERIC

## 📞 Support

Fichiers concernés:
- [app/admin/page.tsx](app/admin/page.tsx) - Dashboard principal
- [app/admin/orders/page.tsx](app/admin/orders/page.tsx) - Gestion ordres
- [lib/supabase/client.ts](lib/supabase/client.ts) - Client Supabase

---

**État:** ✅ **Opérationnel et fonctionnel**
**Mise à jour:** Temps réel depuis Supabase
**Authentification:** Token localStorage
