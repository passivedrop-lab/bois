import { NextRequest, NextResponse } from 'next/server'

interface UpdateOrderRequest {
  orderId: string
  status: 'verified' | 'rejected'
  reason?: string
}

// Simulé pour la démo
export async function POST(request: NextRequest) {
  try {
    const body: UpdateOrderRequest = await request.json()
    const { orderId, status, reason } = body

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    // En production, mettre à jour la BD ici
    // Pour la démo, on simule

    // Préparer le contenu de l'email
    let emailSubject = ''
    let emailBody = ''

    if (status === 'verified') {
      emailSubject = `Votre commande #${orderId} a été validée`
      emailBody = `
Bonjour,

Votre commande #${orderId} a été validée avec succès.
Notre équipe prepare maintenant votre commande pour l'expédition.

Vous recevrez une notification quand votre colis sera en route.

Cordialement,
TsarstvoDereva
      `
    } else if (status === 'rejected') {
      emailSubject = `Votre commande #${orderId} a été rejetée`
      emailBody = `
Bonjour,

Votre commande #${orderId} a été rejetée.
${reason ? `Raison: ${reason}` : ''}

Veuillez nous contacter pour plus d'informations.

Cordialement,
TsarstvoDereva
      `
    }

    // En production, utiliser Resend pour envoyer l'email
    console.log('Email envoyé au client')
    console.log('Sujet:', emailSubject)
    console.log('Contenu:', emailBody)

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
