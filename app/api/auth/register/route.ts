import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, otp, fullName, phone } = await request.json()

    if (!email || !fullName) {
      return NextResponse.json(
        { error: 'Email et nom requis' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      // En développement, créer un ID fictif
      const userId = `user_${Date.now()}`
      const token = Buffer.from(JSON.stringify({ userId, email })).toString('base64')
      
      return NextResponse.json({
        success: true,
        token,
        userId,
        message: 'Profil créé',
      })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Créer le profil
    const { data: profile, error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          email,
          full_name: fullName,
          phone: phone || null,
        },
      ])
      .select()
      .single()

    if (insertError || !profile) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du profil' },
        { status: 500 }
      )
    }

    // Générer un token
    const token = Buffer.from(JSON.stringify({ userId: profile.id, email })).toString('base64')

    return NextResponse.json({
      success: true,
      token,
      userId: profile.id,
      message: 'Inscription réussie',
    })
  } catch (error) {
    console.error('Erreur register:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
