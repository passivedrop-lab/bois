import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Récupérer depuis le store créé dans send-otp
let otpStore: Record<string, { code: string; expiresAt: number }> = {}

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email et code requis' },
        { status: 400 }
      )
    }

    // Vérifier le code OTP
    const storedOtp = otpStore[email]
    if (!storedOtp) {
      return NextResponse.json(
        { error: 'Code invalide ou expiré' },
        { status: 400 }
      )
    }

    if (storedOtp.code !== otp) {
      return NextResponse.json(
        { error: 'Code invalide' },
        { status: 400 }
      )
    }

    if (storedOtp.expiresAt < Date.now()) {
      delete otpStore[email]
      return NextResponse.json(
        { error: 'Code expiré' },
        { status: 400 }
      )
    }

    // Code valide! Nettoyer
    delete otpStore[email]

    // Vérifier si l'utilisateur existe
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      // En développement, créer un token simple
      const token = Buffer.from(JSON.stringify({ email })).toString('base64')
      return NextResponse.json({
        success: true,
        token,
        userId: email, // Temporaire, remplacer par UUID
        message: 'OTP vérifié',
        needsRegistration: true, // Toujours vrai en test
      })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Rechercher l'utilisateur
    const { data: profile, error: queryError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', email)
      .single()

    // Utilisateur trouvé - Connexion réussie
    if (profile && !queryError) {
      const token = Buffer.from(JSON.stringify({ userId: profile.id, email })).toString('base64')
      return NextResponse.json({
        success: true,
        token,
        userId: profile.id,
        message: 'Connexion réussie',
        needsRegistration: false,
      })
    }

    // Utilisateur non trouvé - Rediriger vers inscription
    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Code vérifié. Complétez votre profil',
      needsRegistration: true,
    })
  } catch (error) {
    console.error('Erreur verify-otp:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
