import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email et code requis' }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Rechercher otp dans la table
    const { data: stored, error: selErr } = await supabase
      .from('otps')
      .select('*')
      .eq('email', email)
      .order('expires_at', { ascending: false })
      .limit(1)
      .single()

    if (selErr || !stored) {
      return NextResponse.json({ error: 'Code invalide ou expiré' }, { status: 400 })
    }

    if (stored.code !== otp) {
      return NextResponse.json({ error: 'Code invalide' }, { status: 400 })
    }

    // Comparer les timestamps ISO (convert to number for comparison)
    const expiresTime = new Date(stored.expires_at).getTime()
    if (expiresTime < Date.now()) {
      // Supprimer l'OTP expiré
      await supabase.from('otps').delete().eq('email', email)
      return NextResponse.json({ error: 'Code expiré' }, { status: 400 })
    }

    // Delete used OTP
    await supabase.from('otps').delete().eq('email', email).eq('code', otp)

    // Rechercher le profil
    const { data: profile, error: queryError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', email)
      .single()

    if (profile && !queryError) {
      const token = Buffer.from(JSON.stringify({ userId: profile.id, email })).toString('base64')
      return NextResponse.json({ success: true, token, userId: profile.id, message: 'Connexion réussie', needsRegistration: false })
    }

    return NextResponse.json({ success: true, verified: true, message: 'Code vérifié. Complétez votre profil', needsRegistration: true })
  } catch (error) {
    console.error('Erreur verify-otp:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
