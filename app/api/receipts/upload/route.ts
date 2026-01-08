import { NextRequest, NextResponse } from 'next/server'

// Upload receipt and email admin via Resend if configured
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const orderId = formData.get('orderId') as string
    const file = formData.get('file') as File
    const customerEmail = formData.get('customerEmail') as string

    if (!orderId || !file) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    const fileBuffer = await file.arrayBuffer()
    const base64File = Buffer.from(fileBuffer).toString('base64')

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tsarstvadereva.ru'
    const resendKey = process.env.RESEND_API_KEY

    if (resendKey) {
      try {
        // Lazy import to avoid failing when package not installed locally
        const { Resend } = await import('resend')
        const resend = new Resend(resendKey)

        const subject = `Reçu de commande #${orderId}`
        const html = `<p>Reçu uploadé pour la commande <strong>#${orderId}</strong></p>
          <p>Client: ${customerEmail || '—'}</p>`

        const payload: any = {
          from: process.env.SENDER_EMAIL || `no-reply@${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost').hostname.replace(/^www\./, '')}`,
          to: adminEmail,
          subject,
          html,
          attachments: [
            {
              filename: file.name,
              content_type: file.type || 'application/octet-stream',
              data: base64File,
            },
          ],
        }

        await (resend as any).emails.send(payload)

        console.log('Reçu envoyé à', adminEmail)
        return NextResponse.json({ success: true, message: 'Reçu envoyé à l\'admin avec succès', orderId }, { status: 200 })
      } catch (err) {
        console.error('Erreur Resend:', err)
        // Fallthrough to simulated response below
      }
    }

    // Fallback simulation (if Resend not configured or failed)
    console.log('Simulation: Email envoyé à', adminEmail)
    console.log('Reçu de commande #' + orderId)
    console.log('Fichier:', file.name)

    return NextResponse.json({ success: true, message: 'Reçu traité (simulation)', orderId }, { status: 200 })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'envoi du reçu' }, { status: 500 })
  }
}
