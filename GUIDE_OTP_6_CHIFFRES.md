# Configuration des Codes à 6 chiffres dans Supabase

Pour remplacer les liens de confirmation par des codes à 6 chiffres, suivez ces étapes dans votre tableau de bord Supabase :

## 1. Configurer la longueur du code (OTP)

1. Allez dans **Authentication** > **Settings**.
2. Recherchez la section **OTP Settings**.
3. Réglez **OTP Length** sur `6`.
4. Enregistrez les modifications.

## 2. Modifier les Templates d'Emails

Vous devez modifier vos templates pour afficher le code `{{ .Token }}` au lieu du lien `{{ .ConfirmationURL }}`.

### Inscription (Confirm signup)
**Sujet :** `Votre code de confirmation - ДРОВА ПРЕМИУМ`
**Corps :**
```html
<h2>Bienvenue !</h2>
<p>Votre code de confirmation est : <strong>{{ .Token }}</strong></p>
<p>Utilisez ce code pour valider votre compte sur notre site.</p>
```

### Réinitialisation de mot de passe (Reset password)
**Sujet :** `Réinitialisation de mot de passe - ДРОВА ПРЕМИУМ`
**Corps :**
```html
<h2>Réinitialisation de mot de passe</h2>
<p>Votre code de réinitialisation est : <strong>{{ .Token }}</strong></p>
<p>Entrez ce code sur la page de réinitialisation.</p>
```

### Changement d'email (Change email address)
**Sujet :** `Code de changement d'email - ДРОВА ПРЕМИУМ`
**Corps :**
```html
<h2>Changement d'email</h2>
<p>Votre code de confirmation est : <strong>{{ .Token }}</strong></p>
```

## 3. Mise à jour du Code (Côté Client)

Dans votre code React/Next.js, vous devrez utiliser la méthode `verifyOtp` au lieu d'attendre une redirection automatique :

```javascript
const { data, error } = await supabase.auth.verifyOtp({
  email,
  token: '123456',
  type: 'signup' // ou 'recovery', 'email_change'
})
```
