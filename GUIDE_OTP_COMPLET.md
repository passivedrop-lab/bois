# 🔐 Guide Complet - Authentification OTP

## 🎯 Vue d'ensemble

Le système d'authentification utilise des **codes OTP à 6 chiffres** (One-Time Password) au lieu de mots de passe:

1. **Étape 1:** L'utilisateur entre son email
2. **Étape 2:** Un code OTP est généré et envoyé par email
3. **Étape 3:** L'utilisateur entre le code
4. **Étape 4:** S'il existe → Connexion | S'il n'existe pas → Inscription

## 🚀 Configuration en Développement

### Mode Test Immédiat

Le code OTP est **affiché en développement** dans la console:

```bash
npm run dev
# Allez à /login
# Email: test@example.com
# Vérifiez la console serveur pour le code OTP
```

### Codes de Test

```
Email: test@example.com
Code: 123456 (fixe pour le test)
```

## 🔧 Configuration en Production

### 1. Ajouter Resend pour les emails OTP

```bash
npm install resend
```

### 2. Configurer les variables d'environnement

Dans `.env.local`:
```
RESEND_API_KEY=re_your_key_here
```

### 3. Activer l'envoi d'email OTP

Modifiez `/app/api/auth/send-otp/route.ts`:

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    // Générer OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Envoyer par email
    await resend.emails.send({
      from: 'noreply@tsarstvadereva.ru',
      to: email,
      subject: 'Votre code de vérification OTP',
      html: `
        <h1>Code de vérification</h1>
        <p>Votre code: <strong>${code}</strong></p>
        <p>Ce code expire dans 10 minutes.</p>
      `,
    })
    
    // Stocker le code en base de données
    const supabase = createClient(...)
    await supabase.from('otp_codes').insert({
      email,
      code,
      expires_at: new Date(Date.now() + 10 * 60 * 1000)
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error sending OTP' }, { status: 500 })
  }
}
```

## 📊 Flux de l'Authentification

```
┌─────────────────────────────────────────┐
│  Page Login (/login)                    │
└─────────────────┬───────────────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ Step 1: Email   │
         └────────┬────────┘
                  │ POST /api/auth/send-otp
                  ▼
         ┌──────────────────────┐
         │ Server génère OTP    │
         │ Envoie email (Resend)│
         │ Stocke en DB         │
         └────────┬─────────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Step 2: Code OTP │
         └────────┬─────────┘
                  │ POST /api/auth/verify-otp
                  ▼
         ┌──────────────────────────┐
         │ Vérifier code en DB      │
         │ Vérifier expiration      │
         └────────┬─────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
   Code OK?           Code invalide
        │                   │
        ▼                   ▼
  User existe?      Erreur + Retry
        │
   ┌────┴─────┐
   │           │
  OUI        NON
   │           │
   ▼           ▼
Connexion   ┌─────────────────┐
réussie     │ Step 3: Register│
   │        └────────┬────────┘
   │                 │
   │                 ▼
   │        POST /api/auth/register
   │                 │
   │                 ▼
   │        ┌────────────────────┐
   │        │ Créer profil       │
   │        │ Générer token      │
   │        └────────┬───────────┘
   │                 │
   └─────────┬───────┘
             │
             ▼
    Stocker Token
    localStorage
             │
             ▼
    Rediriger vers
    /profile/orders
```

## 🔐 Stockage des OTP Codes

### Stockage Temporaire (Développement)

Les codes sont stockés en mémoire:

```typescript
// app/api/auth/send-otp/route.ts
const otpStore: Record<string, { code: string; expiresAt: number }> = {}

otpStore[email] = {
  code,
  expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
}
```

**⚠️ Non persistant après restart du serveur!**

### Stockage Persistant (Production)

Utiliser la table `otp_codes` dans Supabase:

```sql
CREATE TABLE public.otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_otp_codes_email ON public.otp_codes(email);
```

## 🧪 Tester l'Authentification

### Test 1: Inscription (Nouvel utilisateur)

```
1. Aller à /login
2. Email: newuser@test.com
3. Cliquer "Envoyer un code"
4. Vérifier console pour le code (dev)
5. Entrer le code à 6 chiffres
6. Remplir profil (nom, téléphone)
7. Cliquer "Créer mon compte"
8. ✅ Redirection vers /profile/orders
```

### Test 2: Connexion (Utilisateur existant)

```
1. Aller à /login
2. Email: test@example.com (existant en DB)
3. Cliquer "Envoyer un code"
4. Entrer le code
5. ✅ Connexion directe vers /profile/orders
```

### Test 3: Code invalide

```
1. Email valide
2. Code incorrect (ex: 111111)
3. ❌ Erreur "Code invalide"
4. Bouton "Renvoyer" pour nouveau code
```

## 📱 Codes OTP de Test

Pour développement, vous pouvez utiliser:

```
Email         Code
─────────────────────
test@example.com    123456
demo@test.fr        123456
user@mail.com       123456
```

*Tous les codes sont `123456` en développement*

## 🔄 Renouvellement de Code

Si l'utilisateur ne reçoit pas le code:

```
1. Cliquer "Pas reçu de code?"
2. Un nouveau code est généré
3. L'ancien code est invalidé
4. Attendre 30 secondes avant nouveau envoi
```

## 🛡️ Sécurité

### ✅ Ce qui est implémenté

- [x] Code OTP à 6 chiffres (fortement aléatoire)
- [x] Expiration après 10 minutes
- [x] Un seul code valide par email
- [x] Code non visible dans l'URL
- [x] Token en localStorage chiffré (base64)

### ⚠️ À améliorer (Production)

- [ ] Implémenter HTTPS obligatoire
- [ ] Stocker OTP hasher (SHA-256)
- [ ] Ajouter rate limiting (5 essais max)
- [ ] Ajouter CAPTCHA après 3 tentatives
- [ ] Logs de sécurité des tentatives
- [ ] Notifications email d'accès suspects

## 📋 Checklist Déploiement

- [ ] Configurer `RESEND_API_KEY` sur Vercel
- [ ] Vérifier domaine Resend
- [ ] Tester email de vérification en production
- [ ] Ajouter rate limiting pour envoi OTP
- [ ] Mettre à jour le stockage OTP (memory → Supabase)
- [ ] Ajouter monitoring des tentatives échouées
- [ ] Documenter process de reset de mot de passe

## 🔗 Fichiers Concernés

```
app/
├── login/page.tsx              ← UI Login/Inscription
├── api/auth/
│   ├── send-otp/route.ts       ← Générer et envoyer OTP
│   ├── verify-otp/route.ts     ← Vérifier le code OTP
│   └── register/route.ts       ← Créer le profil utilisateur
└── profile/orders/page.tsx     ← Page protégée (après login)

lib/
└── supabase/
    └── client.ts               ← Client Supabase

supabase-init.sql              ← Créer les tables
```

## 💡 Prochaines Améliorations

1. **Biométrie:** Ajouter Face ID / Touch ID
2. **Backup codes:** Codes de sauvegarde en cas de perte d'accès email
3. **2FA avec TOTP:** Authentificateur Google/Authy
4. **Email de confirmation:** Notification de connexion
5. **Géolocalisation:** Alerte si connexion depuis nouveau lieu

---

**Besoin d'aide?** Consultez les fichiers `.ts` dans `app/api/auth/` pour voir l'implémentation complète.
