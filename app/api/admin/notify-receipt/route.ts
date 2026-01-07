import { NextResponse } from 'next/server'

// Note: Vous devrez installer resend : npm install resend
// import { Resend } from 'resend'
// const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
    try {
        const { orderId, customerEmail, totalAmount, receiptUrl } = await request.json()

        console.log(`Notification Admin: Nouveau reçu pour la commande ${orderId}`)

        // Simulation d'envoi via Resend (Décommentez après installation)
        /*
        await resend.emails.send({
          from: 'ДРОВА ПРЕМИУМ <noreply@votre-domaine.com>',
          to: 'admin@votre-domaine.com',
          subject: `Nouveau reçu de paiement - Commande #${orderId.slice(0, 8)}`,
          html: `
            <h1>Nouveau reçu de paiement reçu</h1>
            <p><strong>Commande :</strong> #${orderId}</p>
            <p><strong>Client :</strong> ${customerEmail}</p>
            <p><strong>Montant :</strong> ${totalAmount} ₽</p>
            <p><strong>Lien du reçu :</strong> <a href="${receiptUrl}">Voir le reçu</a></p>
            <br/>
            <p>Veuillez valider cette commande sur votre dashboard admin.</p>
          `
        })
        */

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error sending admin notification:', error)
        return NextResponse.json({ error: 'Failed to notify admin' }, { status: 500 })
    }
}
