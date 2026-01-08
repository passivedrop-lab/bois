import { NextRequest, NextResponse } from 'next/server'

// Simulé pour la démo - en production, utiliser Resend réel
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const orderId = formData.get('orderId') as string
    const file = formData.get('file') as File
    const customerEmail = formData.get('customerEmail') as string

    if (!orderId || !file) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    // Convertir le fichier en base64 pour la démo
    const fileBuffer = await file.arrayBuffer()
    const base64File = Buffer.from(fileBuffer).toString('base64')

    // En production, ceci utiliserait la véritable API Resend
    // Pour cette démo, on simule l'envoi
    console.log('Email envoyé à admin@tsarstvadereva.ru')
    console.log('Reçu de commande #' + orderId)
    console.log('Fichier:', file.name)

    // Stocker dans une "base de données" locale (localStorage simulé)
    // En production, utiliser une vraie BD
    const receipts = JSON.parse(
      typeof window !== 'undefined'
        ? localStorage.getItem('receipts') || '[]'
        : '[]'
    )
    receipts.push({
      id: orderId,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      customerEmail,
    })

    if (typeof window !== 'undefined') {
      localStorage.setItem('receipts', JSON.stringify(receipts))
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Reçu envoyé à l\'admin avec succès',
        orderId
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du reçu' },
      { status: 500 }
    )
  }
}
