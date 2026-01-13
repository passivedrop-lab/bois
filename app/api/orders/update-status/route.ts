import { NextRequest, NextResponse } from 'next/server'

interface UpdateOrderRequest {
  orderId: string
  status: 'verified' | 'rejected'
  reason?: string
}

// Simulé pour la démo
export async function POST(request: NextRequest) {
  try {
    const body: UpdateOrderRequest = await request.json()
    const { orderId, status, reason } = body

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Отсутствуют параметры' },
        { status: 400 }
      )
    }

    // En production, mettre à jour la BD ici
    // Pour la démo, on simule

    // Préparer le contenu de l'email
    let emailSubject = ''
    let emailBody = ''

    if (status === 'verified') {
      emailSubject = `Ваш заказ #${orderId} подтвержден`
      emailBody = `
Здравствуйте,

Ваш заказ #${orderId} успешно подтвержден.
Наша команда готовит ваш заказ к отправке.

Вы получите уведомление, когда ваш заказ будет отправлен.

С уважением,
TsarstvoDereva
      `
    } else if (status === 'rejected') {
      emailSubject = `Ваш заказ #${orderId} отклонен`
      emailBody = `
Здравствуйте,

Ваш заказ #${orderId} был отклонен.
${reason ? `Причина: ${reason}` : ''}

Пожалуйста, свяжитесь с нами для получения дополнительной информации.

С уважением,
TsarstvoDereva
      `
    }

    // En production, utiliser Resend pour envoyer l'email
    console.log('Email отправлен клиенту')
    console.log('Тема:', emailSubject)
    console.log('Содержание:', emailBody)

    return NextResponse.json(
      {
        success: true,
        message: `Заказ #${orderId} ${status === 'verified' ? 'подтвержден' : 'отклонен'}`,
        orderId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Ошибка:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении заказа' },
      { status: 500 }
    )
  }
}
