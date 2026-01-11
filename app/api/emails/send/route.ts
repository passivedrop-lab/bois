import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'
import { createClient } from '@/lib/supabase/server'

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

      let itemsHtml = ''
      try {
        const supabase = await createClient()
        const { data: items } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId)

        if (items && items.length > 0) {
          itemsHtml = items.map((item: any) =>
            `<li style="margin-bottom: 5px;">
                            ${item.product_name} <br/>
                            <span style="color: #666; font-size: 0.9em;">Qté: ${item.quantity} | Prix: ${item.price}₽</span>
                        </li>`
          ).join('')
        } else {
          itemsHtml = '<li>Aucun article trouvé</li>'
        }
      } catch (e) {
        console.error('Error fetching items for email:', e)
        itemsHtml = '<li>Erreur chargement détails</li>'
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const confirmLink = `${baseUrl}/api/admin/orders/action?id=${orderId}&action=verified`
      const rejectLink = `${baseUrl}/api/admin/orders/action?id=${orderId}&action=rejected`

      html = `
           <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
             <h1>Nouvelle commande reçue</h1>
             <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Client:</strong> ${customerName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p style="margin: 5px 0;"><strong>Montant Total:</strong> <span style="color: #ea580c; font-weight: bold;">${orderTotal}₽</span></p>
                <p style="margin: 5px 0;"><strong>ID Commande:</strong> #${orderId}</p>
             </div>
             
             <h3>Articles commandés :</h3>
             <ul style="border: 1px solid #e5e7eb; padding: 15px 15px 15px 30px; border-radius: 8px;">
                ${itemsHtml}
             </ul>

             <div style="margin-top: 30px; padding: 20px; border-top: 1px solid #eee; text-align: center;">
               <p style="margin-bottom: 15px;">Action rapide :</p>
               <a href="${confirmLink}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-right: 15px; font-weight: bold;">✅ Valider</a>
               <a href="${rejectLink}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">❌ Rejeter</a>
             </div>

             <p style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 0.9em;">
               <a href="${baseUrl}/admin/orders" style="color: #4b5563;">Voir tous les détails dans le Dashboard</a>
             </p>
           </div>
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
