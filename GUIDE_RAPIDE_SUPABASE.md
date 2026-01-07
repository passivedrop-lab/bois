# Guide Rapide - Configuration Supabase

## 🚀 Démarrage rapide

### 1. Exécuter le script SQL

1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor**
3. Cliquez sur **New query**
4. Copiez-collez le contenu du fichier `supabase-setup.sql`
5. Cliquez sur **Run** (ou appuyez sur `Ctrl+Enter`)

### 2. Configurer les emails automatiques

Suivez le guide détaillé dans `CONFIGURATION_EMAILS_SUPABASE.md`

**Résumé rapide :**
1. Allez dans **Authentication** > **Settings**
2. Activez **Enable email confirmations**
3. Allez dans **Authentication** > **Email Templates**
4. Personnalisez les templates selon vos besoins
5. (Optionnel) Configurez SMTP dans **Settings** > **Auth** > **SMTP Settings**

### 3. Configurer les URLs de redirection

Dans **Authentication** > **URL Configuration** :

**Développement :**
- Site URL : `http://localhost:3000`
- Redirect URLs : `http://localhost:3000/auth/callback`

**Production :**
- Site URL : `https://votre-domaine.com`
- Redirect URLs : `https://votre-domaine.com/auth/callback`

## 📋 Tables créées

Le script SQL crée les tables suivantes :

- ✅ `profiles` - Profils utilisateurs
- ✅ `orders` - Commandes
- ✅ `order_items` - Articles de commande
- ✅ `user_cart` - Panier utilisateur
- ✅ `user_favorites` - Favoris utilisateur

## 🔒 Sécurité (RLS)

Toutes les tables ont Row Level Security (RLS) activé :
- Les utilisateurs ne peuvent voir/modifier que leurs propres données
- Les politiques de sécurité sont automatiquement créées

## 📧 Emails configurés

Une fois configuré, les emails suivants seront envoyés automatiquement :

- ✅ Confirmation d'email (inscription)
- ✅ Réinitialisation de mot de passe
- ✅ Changement d'email
- ✅ Magic Link (connexion sans mot de passe)
- ✅ Invitation utilisateur

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. Créez un compte de test
2. Vérifiez que vous recevez l'email de confirmation
3. Confirmez votre email
4. Testez la réinitialisation de mot de passe

## 📚 Documentation complète

- `supabase-setup.sql` - Script SQL complet
- `CONFIGURATION_EMAILS_SUPABASE.md` - Guide détaillé pour les emails
- `SUPABASE_SETUP.md` - Guide d'installation général


