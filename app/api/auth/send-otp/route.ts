import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 10 * 60 * 1000

    const supabase = await createServerClient()

    // Insert into otps table (create this table in Supabase: email, code, expires_at bigint)
    const { error } = await supabase.from('otps').insert([{ email, code, expires_at: expiresAt }])
    if (error) {
      console.error('Erreur insertion OTP:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }

    // Option: rely on Supabase triggers or external jobs to send the OTP email.
    // For development, return the code in response.
    return NextResponse.json({ success: true, message: 'Code OTP enregistré', ...(process.env.NODE_ENV === 'development' && { code }) })
  } catch (error) {
    console.error('Erreur send-otp:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
