import { NextRequest, NextResponse } from 'next/server'

// Upload receipt and email admin via Resend
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const orderId = formData.get('orderId') as string
    const file = formData.get('file') as File
    const customerEmail = formData.get('customerEmail') as string

    if (!orderId || !file) {
      return NextResponse.json({ error: 'Отсутствующие параметры' }, { status: 400 })
    }

    const fileBuffer = await file.arrayBuffer()
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tsarstvadereva.ru'

    // Use shared resend client
    const { resend } = await import('@/lib/resend')
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // Fetch order details and items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('Order Fetch Error:', orderError)
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const approveUrl = `${baseUrl}/api/admin/orders/action?id=${orderId}&action=verified`
    const rejectUrl = `${baseUrl}/api/admin/orders/action?id=${orderId}&action=rejected`

    const itemsHtml = order.order_items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product_name || item.product_id}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">x${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString()} ₽</td>
      </tr>
    `).join('')

    const subject = `🔥 Новая квитанция : Заказ #${orderId}`
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Получена новая квитанция об оплате</h2>
        
        <div style="margin: 20px 0;">
          <p><strong>Заказ :</strong> #${orderId}</p>
          <p><strong>Клиент :</strong> ${order.customer_name} (<a href="mailto:${order.customer_email}">${order.customer_email}</a>)</p>
          <p><strong>Адрес :</strong> ${order.delivery_address || 'Не указан'}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #eee;">Товар</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #eee;">Кол-во</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #eee;">Цена</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">ИТОГО:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; color: #dc2626; font-size: 1.2em;">${order.total_price.toLocaleString()} ₽</td>
            </tr>
          </tfoot>
        </table>

        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; text-align: center; margin-top: 30px;">
          <h3 style="margin-top: 0; color: #991b1b;">Быстрые действия</h3>
          <p style="font-size: 0.9em; color: #7f1d1d; margin-bottom: 20px;">Нажмите кнопку ниже, чтобы немедленно изменить статус.</p>
          
          <div style="text-align: center;">
            <a href="${approveUrl}" style="display: inline-block; background-color: #16a34a; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-right: 10px;">✅ ПОДТВЕРДИТЬ</a>
            <a href="${rejectUrl}" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: bold;">❌ ОТКЛОНИТЬ</a>
          </div>
        </div>

        <p style="font-size: 0.8em; color: #666; margin-top: 30px; text-align: center;">
          Квитанция приложена к этому письму.
        </p>
      </div>
    `

    // Use configured sender email or fallback to onboarding
    const fromEmail = process.env.SENDER_EMAIL || 'TsarstvoDereva <onboarding@resend.dev>'

    const { data, error: sendError } = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject,
      html,
      attachments: [
        {
          filename: file.name,
          content: Buffer.from(fileBuffer),
        },
      ],
    })

    if (sendError) {
      console.error('❌ Resend Send Error:', sendError)
      return NextResponse.json({
        error: 'Erreur lors de l\'envoi de l\'email',
        details: sendError
      }, { status: 500 })
    }

    console.log('✅ Email envoyé avec succès à', adminEmail, 'ID:', data?.id)
    return NextResponse.json({
      success: true,
      message: 'Reçu envoyé à l\'admin avec succès',
      orderId,
      emailId: data?.id
    }, { status: 200 })

  } catch (error) {
    console.error('❌ Erreur globale:', error)
    return NextResponse.json({
      error: 'Erreur lors du traitement du reçu',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
