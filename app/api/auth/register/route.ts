import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { email, fullName, phone } = await request.json()

    if (!email || !fullName) {
      return NextResponse.json(
        { error: 'Email et nom requis' },
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
        { error: 'Cet email est déjà enregistré' },
        { status: 400 }
      )
    }

    // Créer le profil avec un UUID valide
    const userId = uuidv4()
    const { data: profile, error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          email,
          full_name: fullName,
          phone: phone || null,
          role: 'user',
        },
      ])
      .select('id, email, full_name')
      .single()

    if (insertError || !profile) {
      console.error('Erreur création profil:', insertError)
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
