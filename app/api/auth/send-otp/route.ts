import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Некорректный Email' }, { status: 400 })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const supabase = await createServerClient()

    // Delete previous OTP if exists
    await supabase.from('otps').delete().eq('email', email)

    // Insert new OTP - Supabase envoie l'email automatiquement via un trigger
    const { error: insertError } = await supabase
      .from('otps')
      .insert([{ email, code, expires_at: expiresAt }])

    if (insertError) {
      console.error('Erreur insertion OTP:', insertError)
      return NextResponse.json(
        { error: 'Ошибка при отправке кода. Попробуйте еще раз.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Код подтверждения отправлен на ваш Email' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur send-otp:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
