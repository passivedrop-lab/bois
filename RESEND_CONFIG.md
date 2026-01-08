# Configuration Resend pour les Emails Admin

## Installation

```bash
npm install resend
```

## Variables d'Environnement

Ajouter à `.env.local`:

```
RESEND_API_KEY=re_your_api_key_here
ADMIN_EMAIL=admin@tsarstvadereva.ru
```

## Routes API avec Resend

### 1. Envoyer le Reçu à l'Admin

Fichier: `app/api/receipts/upload/route.ts` (modifié)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const orderId = formData.get('orderId') as string
    const file = formData.get('file') as File
    const customerEmail = formData.get('customerEmail') as string

    if (!orderId || !file) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    // Convertir le fichier en buffer
    const fileBuffer = await file.arrayBuffer()
    const base64File = Buffer.from(fileBuffer).toString('base64')

    // Envoyer l'email à l'admin avec le reçu en pièce jointe
    const response = await resend.emails.send({
      from: 'noreply@tsarstvadereva.ru',
      to: process.env.ADMIN_EMAIL || 'admin@tsarstvadereva.ru',
      subject: `Nouveau reçu de virement - Commande #${orderId}`,
      html: `
        <h2>Nouveau reçu de virement reçu</h2>
        <p><strong>Commande #:</strong> ${orderId}</p>
        <p><strong>Email client:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
        <p><strong>Date de réception:</strong> ${new Date().toLocaleString('fr-FR')}</p>
        <p><strong>Fichier reçu:</strong> ${file.name}</p>
        <hr />
        <p>
          <a href="https://votre-domaine.com/admin/orders" style="background-color: #dc2626; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
            Voir dans le dashboard
          </a>
        </p>
      `,
      attachments: [
        {
          filename: file.name,
          content: fileBuffer,
        },
      ],
    })

    if (response.error) {
      console.error('Erreur Resend:', response.error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Reçu envoyé à l\'admin avec succès',
        orderId,
        emailId: response.data?.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du reçu' },
      { status: 500 }
    )
  }
}
```

### 2. Envoyer la Confirmation au Client

Fichier: `app/api/orders/update-status/route.ts` (modifié)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface UpdateOrderRequest {
  orderId: string
  status: 'verified' | 'rejected'
  customerEmail: string
  reason?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: UpdateOrderRequest = await request.json()
    const { orderId, status, customerEmail, reason } = body

    if (!orderId || !status || !customerEmail) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    let emailSubject = ''
    let emailHtml = ''

    if (status === 'verified') {
      emailSubject = `✓ Commande #${orderId} validée`
      emailHtml = `
        <h2>Votre commande a été validée! 🎉</h2>
        <p>Bonjour,</p>
        <p>Votre commande <strong>#${orderId}</strong> a été validée avec succès.</p>
        <p>Notre équipe prépare maintenant votre commande pour l'expédition.</p>
        <p>Vous recevrez une notification SMS/email quand votre colis sera en route.</p>
        <hr />
        <p>
          <a href="https://votre-domaine.com/profile/orders" style="background-color: #16a34a; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
            Voir mon historique de commandes
          </a>
        </p>
        <p><strong>TsarstvoDereva</strong></p>
      `
    } else if (status === 'rejected') {
      emailSubject = `⚠️ Commande #${orderId} rejetée`
      emailHtml = `
        <h2>Concernant votre commande #${orderId}</h2>
        <p>Bonjour,</p>
        <p>Malheureusement, votre commande <strong>#${orderId}</strong> a été rejetée.</p>
        ${reason ? `<p><strong>Raison:</strong> ${reason}</p>` : ''}
        <p>Veuillez nous contacter pour plus d'informations ou pour passer une nouvelle commande.</p>
        <hr />
        <p>
          <a href="https://votre-domaine.com/contacts" style="background-color: #2563eb; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
            Nous contacter
          </a>
        </p>
        <p><strong>TsarstvoDereva</strong></p>
      `
    }

    // Envoyer l'email au client
    const response = await resend.emails.send({
      from: 'orders@tsarstvadereva.ru',
      to: customerEmail,
      subject: emailSubject,
      html: emailHtml,
    })

    if (response.error) {
      console.error('Erreur Resend:', response.error)
      // Ne pas échouer si l'email n'est pas envoyé
      // Car la commande doit quand même être mise à jour
    }

    return NextResponse.json(
      {
        success: true,
        message: `Commande #${orderId} ${status === 'verified' ? 'validée' : 'rejetée'}`,
        orderId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la commande' },
      { status: 500 }
    )
  }
}
```

## Configuration des Domaines d'Envoi

### Dans Resend Dashboard

1. Aller sur https://resend.com/domains
2. Ajouter le domaine `tsarstvadereva.ru`
3. Vérifier les enregistrements DNS:
   ```
   CNAME: bounce.resend.dev
   DKIM: resend.dev
   ```
4. Une fois vérifié, utiliser:
   - `noreply@tsarstvadereva.ru` pour les notifications
   - `orders@tsarstvadereva.ru` pour les confirmations de commande

## Tests

### Test d'Envoi

```bash
curl -X POST http://localhost:3000/api/receipts/upload \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "001",
    "customerEmail": "client@example.com",
    "fileName": "receipt.pdf"
  }'
```

### Test de Mise à Jour

```bash
curl -X POST http://localhost:3000/api/orders/update-status \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "001",
    "status": "verified",
    "customerEmail": "client@example.com"
  }'
```

## Modèles d'Email avec React (Optionnel)

Pour des emails plus élaborés, créer des composants React:

```typescript
// lib/emails/OrderConfirmation.tsx
import React from 'react'

interface OrderConfirmationProps {
  orderId: string
  status: 'verified' | 'rejected'
  reason?: string
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderId,
  status,
  reason,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px' }}>
    <h2>{status === 'verified' ? '✓ Commande validée' : '⚠️ Commande rejetée'}</h2>
    <p>Commande #{orderId}</p>
    {reason && <p>Raison: {reason}</p>}
  </div>
)
```

Puis utiliser dans la route API:

```typescript
import { render } from '@react-email/render'
import { OrderConfirmation } from '@/lib/emails/OrderConfirmation'

const emailHtml = render(<OrderConfirmation orderId={orderId} status={status} reason={reason} />)

await resend.emails.send({
  from: 'orders@tsarstvadereva.ru',
  to: customerEmail,
  subject: emailSubject,
  html: emailHtml,
})
```

---

## Logs et Monitoring

### Vérifier les Emails Envoyés

1. Aller sur https://resend.com/emails
2. Voir tous les emails envoyés
3. Vérifier les statuts: delivered, bounced, complained

### Logs Vercel

```bash
vercel logs # Voir les logs en production
```

---

**Status:** ✅ Prêt pour la production
**API:** Resend v3.0+
