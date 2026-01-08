import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'

export async function POST(request: Request) {
    try {
        const { type, email, orderId, orderTotal, customerName, reason } = await request.json()

        let subject = ''
        let html = ''

        if (type === 'confirmation') {
            subject = `Confirmation de commande #${orderId}`
            html = `
          <h1>Merci pour votre commande, ${customerName}!</h1>
          <p>Nous avons bien reçu votre commande #${orderId} d'un montant de ${orderTotal}₽.</p>
          <p>Nous allons vérifier votre paiement et vous informerons dès que votre commande sera validée.</p>
          <p>Cordialement,<br/>L'équipe TsarstvoDereva</p>
        `
        } else if (type === 'verified') {
            subject = `Commande #${orderId} validée !`
            html = `
          <h1>Bonne nouvelle !</h1>
          <p>Votre commande #${orderId} a été validée.</p>
          <p>Nous préparons l'expédition. Vous recevrez un autre email avec les détails de suivi.</p>
        `
        } else if (type === 'rejected') {
            subject = `Problème avec la commande #${orderId}`
            html = `
          <h1>Information importante</h1>
          <p>Votre commande #${orderId} n'a pas pu être validée.</p>
          <p><strong>Raison :</strong> ${reason}</p>
          <p>Veuillez contacter notre support pour résoudre ce problème.</p>
        `
        } else if (type === 'admin_notification') {
            subject = `Nouvelle commande #${orderId}`
            html = `
           <h1>Nouvelle commande reçue</h1>
           <p>Client: ${customerName} (${email})</p>
           <p>Montant: ${orderTotal}₽</p>
           <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders">Voir la commande</a>
        `
        }

        const data = await resend.emails.send({
            from: 'TsarstvoDereva <onboarding@resend.dev>', // Use verified domain in prod
            to: [email],
            subject: subject,
            html: html,
        })

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Error sending email' }, { status: 500 })
    }
}
