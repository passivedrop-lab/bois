import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const supabase = await createServerClient()

    // Delete previous OTP if exists
    await supabase.from('otps').delete().eq('email', email)

    // Insert new OTP
    const { error: insertError } = await supabase
      .from('otps')
      .insert([{ email, code, expires_at: expiresAt }])

    if (insertError) {
      console.error('Erreur insertion OTP:', insertError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi du code. Réessayez.' },
        { status: 500 }
      )
    }

    // Send email with Resend
    try {
      await resend.emails.send({
        from: 'noreply@drovaspremiium.com',
        to: email,
        subject: 'Votre code de vérification - ДРОВА ПРЕМИУМ',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
            <div style="max-width: 500px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
              <h2 style="color: #8B4513; margin-bottom: 20px;">Vérification de votre compte</h2>
              <p style="color: #333; margin-bottom: 15px;">Votre code de vérification est:</p>
              <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin-bottom: 20px; border-radius: 4px;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #c41e3a;">${code}</span>
              </div>
              <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                Ce code expirera dans 10 minutes. Ne le partagez avec personne.
              </p>
              <p style="color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px;">
                Si vous n'avez pas demandé ce code, ignorez cet email.
              </p>
              <p style="color: #999; font-size: 12px; margin-top: 20px;">
                © 2026 ДРОВА ПРЕМИУМ - Tous droits réservés
              </p>
            </div>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError)
      // Don't fail completely if email fails, code is stored
      return NextResponse.json(
        { success: true, message: 'Code généré (envoi email échoué - vérifiez les logs)' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Code OTP envoyé à votre email' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur send-otp:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
