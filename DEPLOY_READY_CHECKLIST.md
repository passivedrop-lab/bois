# 🚀 Liste de Contrôle pour le Déploiement "ДРОВА ПРЕМИУМ"

Votre projet est **code-ready** ! Toutes les fonctionnalités demandées (virement, téléversement de reçu, admin dashboard, emails premium) sont implémentées. Voici les étapes finales pour le mettre en ligne.

## 1. Configuration Supabase (Crucial)
- [ ] **Exécuter le SQL** : Copiez le contenu de `supabase-setup.sql` et exécutez-le dans l'éditeur SQL de Supabase. Cela créera les tables, les politiques RLS et le stockage des reçus.
- [ ] **Vérifier le Bucket** : Assurez-vous qu'un bucket nommé `receipts` a été créé dans la section **Storage**. S'il n'est pas là, créez-le manuellement et mettez-le en "Public".
- [ ] **Activer les Codes OTP** : Dans **Authentication > Settings**, réglez **OTP Length** sur `6`.
- [ ] **Templates d'Emails** : Copiez les designs depuis `EMAIL_TEMPLATES_ULTRA_PREMIUM.md` vers vos paramètres Auth dans Supabase.

## 2. Variables d'Environnement
- [ ] **.env.local** : Remplissez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` avec vos valeurs réelles (trouvées dans Settings > API).
- [ ] **Resend** : Ajoutez votre clé `RESEND_API_KEY` pour activer les notifications de reçu.

## 3. Déploiement (Vercel / Netlify)
- [ ] Ajoutez ces mêmes variables d'environnement dans votre interface de déploiement.
- [ ] **Dépendances** : Si vous utilisez les notifications par email, lancez `npm install resend`.

## 4. Test Final après déploiement
- [ ] Créez un compte test.
- [ ] Ajoutez un produit au panier.
- [ ] Passez commande (Virement bancaire).
- [ ] Téléversez un reçu de test.
- [ ] Connectez-vous avec un compte ayant le rôle `admin` dans la table `profiles` et vérifiez la commande sur `/admin/orders`.

---

**Le projet est maintenant une machine de vente de bois russe ultra-élégante et fonctionnelle !** 🪵🔥
