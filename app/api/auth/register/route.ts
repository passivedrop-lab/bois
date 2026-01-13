import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, phone, city } = await request.json()

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Требуются Email, имя и фамилия' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Vérifier que l'utilisateur n'existe pas déjà
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Этот email уже зарегистрирован' },
        { status: 400 }
      )
    }

    // Créer le profil avec un UUID valide
    const userId = uuidv4()
    const fullName = `${firstName} ${lastName}`
    const { data: profile, error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          email,
          full_name: fullName,
          phone: phone || null,
          city: city || null,
          role: 'user',
        },
      ])
      .select('id, email, full_name')
      .single()

    if (insertError || !profile) {
      console.error('Erreur création profil:', insertError)
      return NextResponse.json(
        { error: 'Ошибка при создании профиля' },
        { status: 500 }
      )
    }

    // Générer un token
    const token = Buffer.from(JSON.stringify({ userId: profile.id, email })).toString('base64')

    return NextResponse.json({
      success: true,
      token,
      userId: profile.id,
      email: profile.email,
      message: 'Регистрация успешна!',
    })
  } catch (error) {
    console.error('Erreur register:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
