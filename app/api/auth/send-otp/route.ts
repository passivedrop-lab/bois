import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    // expires_at DOIT être un TIMESTAMP ISO (format texte), pas un nombre
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const supabase = await createServerClient()

    // Insert into otps table
    const { error } = await supabase.from('otps').insert([{ email, code, expires_at: expiresAt }])
    if (error) {
      console.error('Erreur insertion OTP:', error)
      return NextResponse.json({ error: 'Erreur lors de l\'envoi du code' }, { status: 500 })
    }

    // Le code OTP est envoyé par Supabase automatiquement via email
    return NextResponse.json({ success: true, message: 'Code OTP envoyé à votre email' })
  } catch (error) {
    console.error('Erreur send-otp:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
