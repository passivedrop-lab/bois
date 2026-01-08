import { NextRequest, NextResponse } from 'next/server'

// Store OTPs in memory (en production, utiliser une DB avec expiration)
const otpStore: Record<string, { code: string; expiresAt: number }> = {}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    // Générer un code OTP à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Stocker le code avec expiration (10 minutes)
    otpStore[email] = {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
    }

    // En production, envoyer par email via Resend
    // Pour maintenant, on affiche dans la console
    console.log(`OTP pour ${email}: ${code}`)

    return NextResponse.json({
      success: true,
      message: 'Code OTP envoyé',
      // En développement seulement:
      ...(process.env.NODE_ENV === 'development' && { code }),
    })
  } catch (error) {
    console.error('Erreur send-otp:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
