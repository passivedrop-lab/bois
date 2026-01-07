# Configuration des Emails Automatiques dans Supabase

Ce guide vous explique comment configurer les emails automatiques pour :
- ✅ Confirmation d'email lors de l'inscription
- ✅ Réinitialisation de mot de passe
- ✅ Changement de mot de passe
- ✅ Changement d'email
- ✅ Magic Link (connexion sans mot de passe)

## 📋 Étape 1 : Accéder aux paramètres d'authentification

1. Connectez-vous à votre projet Supabase
2. Allez dans **Authentication** > **Settings** (ou **Configuration**)
3. Faites défiler jusqu'à la section **Email Auth**

## 📧 Étape 2 : Activer l'envoi automatique d'emails

### 2.1 Configuration de base

Dans **Authentication** > **Settings** > **Email Auth**, assurez-vous que :

- ✅ **Enable email confirmations** est activé (pour la confirmation d'email)
- ✅ **Enable secure email change** est activé (pour le changement d'email)
- ✅ **Enable email change confirmations** est activé

### 2.2 Configuration des URLs de redirection

Dans **Authentication** > **URL Configuration** :

**Pour le développement :**
- **Site URL** : `http://localhost:3000`
- **Redirect URLs** : 
  ```
  http://localhost:3000/auth/callback
  http://localhost:3000/**
  ```

**Pour la production :**
- **Site URL** : `https://votre-domaine.com`
- **Redirect URLs** : 
  ```
  https://votre-domaine.com/auth/callback
  https://votre-domaine.com/**
  ```

## 📨 Étape 3 : Configurer les templates d'emails

Allez dans **Authentication** > **Email Templates**

### 3.1 Template : Confirmation d'email (Confirm signup)

**Sujet :**
```
Confirmez votre adresse email - ДРОВА ПРЕМИУМ
```

**Corps (HTML) :**
```html
<h2>Bienvenue sur ДРОВА ПРЕМИУМ !</h2>
<p>Merci de vous être inscrit. Veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :</p>
<p><a href="{{ .ConfirmationURL }}">Confirmer mon email</a></p>
<p>Si le lien ne fonctionne pas, copiez et collez cette URL dans votre navigateur :</p>
<p>{{ .ConfirmationURL }}</p>
<p>Ce lien expirera dans 24 heures.</p>
<p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
<hr>
<p><small>ДРОВА ПРЕМИУМ - Votre partenaire pour le chauffage</small></p>
```

### 3.2 Template : Réinitialisation de mot de passe (Reset password)

**Sujet :**
```
Réinitialisation de votre mot de passe - ДРОВА ПРЕМИУМ
```

**Corps (HTML) :**
```html
<h2>Réinitialisation de mot de passe</h2>
<p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
<p><a href="{{ .ConfirmationURL }}">Réinitialiser mon mot de passe</a></p>
<p>Si le lien ne fonctionne pas, copiez et collez cette URL dans votre navigateur :</p>
<p>{{ .ConfirmationURL }}</p>
<p>Ce lien expirera dans 1 heure.</p>
<p><strong>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe ne sera pas modifié.</strong></p>
<hr>
<p><small>ДРОВА ПРЕМИУМ - Votre partenaire pour le chauffage</small></p>
```

### 3.3 Template : Changement d'email (Change email address)

**Sujet :**
```
Confirmez votre nouvelle adresse email - ДРОВА ПРЕМИУМ
```

**Corps (HTML) :**
```html
<h2>Changement d'adresse email</h2>
<p>Vous avez demandé à changer votre adresse email. Veuillez confirmer votre nouvelle adresse en cliquant sur le lien ci-dessous :</p>
<p><a href="{{ .ConfirmationURL }}">Confirmer ma nouvelle adresse email</a></p>
<p>Si le lien ne fonctionne pas, copiez et collez cette URL dans votre navigateur :</p>
<p>{{ .ConfirmationURL }}</p>
<p>Ce lien expirera dans 24 heures.</p>
<p><strong>Si vous n'avez pas demandé ce changement, ignorez cet email.</strong></p>
<hr>
<p><small>ДРОВА ПРЕМИУМ - Votre partenaire pour le chauffage</small></p>
```

### 3.4 Template : Magic Link (Magic Link)

**Sujet :**
```
Lien de connexion - ДРОВА ПРЕМИУМ
```

**Corps (HTML) :**
```html
<h2>Connexion à ДРОВА ПРЕМИУМ</h2>
<p>Cliquez sur le lien ci-dessous pour vous connecter sans mot de passe :</p>
<p><a href="{{ .ConfirmationURL }}">Se connecter</a></p>
<p>Si le lien ne fonctionne pas, copiez et collez cette URL dans votre navigateur :</p>
<p>{{ .ConfirmationURL }}</p>
<p>Ce lien expirera dans 1 heure.</p>
<p>Si vous n'avez pas demandé ce lien de connexion, ignorez cet email.</p>
<hr>
<p><small>ДРОВА ПРЕМИУМ - Votre partenaire pour le chauffage</small></p>
```

### 3.5 Template : Invitation (Invite user)

**Sujet :**
```
Invitation à rejoindre ДРОВА ПРЕМИУМ
```

**Corps (HTML) :**
```html
<h2>Vous avez été invité !</h2>
<p>Vous avez été invité à rejoindre ДРОВА ПРЕМИУМ. Cliquez sur le lien ci-dessous pour accepter l'invitation :</p>
<p><a href="{{ .ConfirmationURL }}">Accepter l'invitation</a></p>
<p>Si le lien ne fonctionne pas, copiez et collez cette URL dans votre navigateur :</p>
<p>{{ .ConfirmationURL }}</p>
<hr>
<p><small>ДРОВА ПРЕМИУМ - Votre partenaire pour le chauffage</small></p>
```

## 🔧 Étape 4 : Configuration SMTP (Optionnel mais recommandé)

Par défaut, Supabase utilise son propre service d'email. Pour une meilleure délivrabilité et personnalisation, vous pouvez configurer votre propre SMTP.

### 4.1 Accéder aux paramètres SMTP

1. Allez dans **Settings** > **Auth**
2. Faites défiler jusqu'à **SMTP Settings**
3. Activez **Custom SMTP**

### 4.2 Configuration pour différents fournisseurs

#### Gmail / Google Workspace
```
Host: smtp.gmail.com
Port: 465 (SSL) ou 587 (TLS)
Username: votre-email@gmail.com
Password: [Mot de passe d'application Gmail]
Sender email: votre-email@gmail.com
Sender name: ДРОВА ПРЕМИУМ
```

**Note :** Pour Gmail, vous devez créer un "Mot de passe d'application" dans votre compte Google.

#### SendGrid
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [Votre clé API SendGrid]
Sender email: noreply@votre-domaine.com
Sender name: ДРОВА ПРЕМИУМ
```

#### Mailgun
```
Host: smtp.mailgun.org
Port: 587
Username: [Votre nom d'utilisateur Mailgun]
Password: [Votre mot de passe Mailgun]
Sender email: noreply@votre-domaine.com
Sender name: ДРОВА ПРЕМИУМ
```

#### OVH / Autres
```
Host: [Votre serveur SMTP]
Port: 587 (TLS) ou 465 (SSL)
Username: [Votre nom d'utilisateur]
Password: [Votre mot de passe]
Sender email: noreply@votre-domaine.com
Sender name: ДРОВА ПРЕМИУМ
```

### 4.3 Tester la configuration SMTP

Après avoir configuré SMTP, testez l'envoi :
1. Allez dans **Authentication** > **Users**
2. Créez un utilisateur de test
3. Vérifiez que l'email de confirmation est bien reçu

## ⚙️ Étape 5 : Configuration avancée

### 5.1 Délais d'expiration

Dans **Authentication** > **Settings**, vous pouvez configurer :

- **Email confirmation expiry** : 24 heures (par défaut)
- **Password reset expiry** : 1 heure (par défaut)
- **Magic link expiry** : 1 heure (par défaut)

### 5.2 Rate limiting

Pour éviter le spam, configurez les limites de taux :
- **Max requests per hour** : 4 (par défaut)
- **Max requests per IP** : 20 (par défaut)

### 5.3 Double opt-in pour changement d'email

Activez **Secure email change** pour exiger la confirmation de l'ancienne et de la nouvelle adresse email.

## ✅ Étape 6 : Vérification

### 6.1 Tester la confirmation d'email

1. Créez un nouveau compte sur votre application
2. Vérifiez votre boîte de réception
3. Cliquez sur le lien de confirmation
4. Vérifiez que vous êtes bien connecté

### 6.2 Tester la réinitialisation de mot de passe

1. Allez sur la page de connexion
2. Cliquez sur "Mot de passe oublié"
3. Entrez votre email
4. Vérifiez votre boîte de réception
5. Cliquez sur le lien de réinitialisation
6. Créez un nouveau mot de passe

### 6.3 Vérifier les logs

Allez dans **Authentication** > **Logs** pour voir :
- Les tentatives d'envoi d'emails
- Les erreurs éventuelles
- Les statistiques d'envoi

## 🐛 Dépannage

### Les emails ne sont pas envoyés

1. **Vérifiez la configuration SMTP** : Si vous utilisez un SMTP personnalisé, vérifiez les identifiants
2. **Vérifiez les logs** : Allez dans **Authentication** > **Logs** pour voir les erreurs
3. **Vérifiez le dossier spam** : Les emails peuvent être dans le dossier spam
4. **Vérifiez les limites de taux** : Vous avez peut-être atteint la limite d'envoi

### Les emails arrivent en spam

1. **Configurez SPF/DKIM** : Configurez les enregistrements DNS pour votre domaine
2. **Utilisez un SMTP professionnel** : SendGrid, Mailgun, etc. ont une meilleure réputation
3. **Personnalisez les templates** : Évitez les mots déclencheurs de spam
4. **Vérifiez la réputation de l'IP** : Utilisez des services comme Mail-tester.com

### Les liens ne fonctionnent pas

1. **Vérifiez les URLs de redirection** : Dans **Authentication** > **URL Configuration**
2. **Vérifiez le format des URLs** : Les URLs doivent être absolues et commencer par `http://` ou `https://`
3. **Vérifiez l'expiration** : Les liens peuvent avoir expiré

## 📚 Ressources supplémentaires

- [Documentation Supabase - Email Auth](https://supabase.com/docs/guides/auth/auth-email)
- [Documentation Supabase - Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Documentation Supabase - SMTP](https://supabase.com/docs/guides/auth/auth-smtp)

## 🔐 Sécurité

- ✅ Ne partagez jamais vos identifiants SMTP
- ✅ Utilisez des mots de passe d'application pour Gmail
- ✅ Activez la double authentification sur votre compte email
- ✅ Surveillez les logs d'authentification régulièrement
- ✅ Configurez des limites de taux pour éviter le spam

---

**Note :** Pour le développement local, vous pouvez utiliser le service d'email par défaut de Supabase. Pour la production, il est fortement recommandé de configurer un SMTP personnalisé pour une meilleure délivrabilité.


