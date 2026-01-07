# Configuration Supabase

## Étape 1 : Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - **Name** : ДРОВА ПРЕМИУМ (ou votre nom)
   - **Database Password** : Choisissez un mot de passe fort
   - **Region** : Choisissez la région la plus proche
5. Cliquez sur "Create new project"

## Étape 2 : Récupérer les clés API

1. Dans votre projet Supabase, allez dans **Settings** > **API**
2. Copiez les valeurs suivantes :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Étape 3 : Configurer les variables d'environnement

1. Créez un fichier `.env.local` à la racine du projet
2. Ajoutez les variables :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Étape 4 : Créer les tables

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur "New query"
3. Copiez le contenu du fichier `supabase-setup.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur "Run" (ou Ctrl+Enter)

## Étape 5 : Configurer l'authentification

1. Dans Supabase, allez dans **Authentication** > **URL Configuration**
2. Ajoutez votre URL de redirection :
   - **Site URL** : `http://localhost:3000` (pour le développement)
   - **Redirect URLs** : `http://localhost:3000/auth/callback`

Pour la production, ajoutez également :
- **Site URL** : `https://votre-domaine.com`
- **Redirect URLs** : `https://votre-domaine.com/auth/callback`

## Étape 6 : Configurer les emails (optionnel)

1. Dans **Authentication** > **Email Templates**
2. Personnalisez les templates d'email si nécessaire
3. Par défaut, Supabase envoie les emails de confirmation

Pour utiliser un service d'email personnalisé :
1. Allez dans **Settings** > **Auth**
2. Configurez votre SMTP dans "SMTP Settings"

## Vérification

Pour vérifier que tout fonctionne :

1. Lancez le serveur de développement :
```bash
npm run dev
```

2. Allez sur `http://localhost:3000`
3. Essayez de créer un compte
4. Vérifiez que vous recevez l'email de confirmation
5. Connectez-vous et testez les fonctionnalités

## Problèmes courants

### Erreur "Invalid API key"
- Vérifiez que les variables d'environnement sont correctement définies
- Redémarrez le serveur de développement après avoir modifié `.env.local`

### Erreur "relation does not exist"
- Vérifiez que vous avez bien exécuté le script SQL `supabase-setup.sql`
- Vérifiez que toutes les tables ont été créées dans l'onglet "Table Editor"

### Les emails ne sont pas envoyés
- Vérifiez la configuration SMTP dans Supabase
- Vérifiez les logs dans **Authentication** > **Logs**
- Pour le développement, utilisez le mode "Magic Link" qui fonctionne sans SMTP

### Erreur RLS (Row Level Security)
- Vérifiez que les politiques RLS sont bien créées
- Vérifiez que l'utilisateur est bien authentifié
- Consultez les logs dans **Database** > **Logs**

## Support

Pour plus d'aide :
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Next.js avec Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)



