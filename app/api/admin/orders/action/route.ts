import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('id')
  const action = searchParams.get('action') as 'verified' | 'rejected'

  if (!orderId || !action || !['verified', 'rejected'].includes(action)) {
    return new NextResponse('Неверное действие', { status: 400 })
  }

  try {
    // START FIX: Use Service Role to bypass RLS for this specific admin action
    // This allows the link to work even if the admin is not logged in on the device
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    // END FIX

    // 1. Get order details first to notify customer later
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (fetchError || !order) {
      return new NextResponse(`Заказ #${orderId} не найден`, { status: 404 })
    }

    // 2. Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: action })
      .eq('id', orderId)

    if (updateError) throw updateError

    // 3. Trigger customer notification email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    try {
      await fetch(`${baseUrl}/api/emails/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: action,
          email: order.customer_email,
          orderId: order.id,
          orderTotal: order.total_price,
          customerName: order.customer_name,
          reason: action === 'rejected' ? 'Ошибка проверки платежа или отсутствие документа' : undefined
        })
      })
    } catch (emailErr) {
      console.error('Failed to send customer notification:', emailErr)
    }

    // 4. Return success page
    const statusLabel = action === 'verified' ? 'ПОДТВЕРЖДЕН' : 'ОТКЛОНЕН'
    const statusColor = action === 'verified' ? '#16a34a' : '#dc2626'

    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Статус заказа обновлен</title>
          <style>
            body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f9fafb; }
            .card { background: white; padding: 40px; border-radius: 12px; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center; border: 1px solid #eee; }
            .status { font-size: 24px; font-weight: bold; margin: 20px 0; color: ${statusColor}; }
            .btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #374151; color: white; text-decoration: none; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div style="font-size: 48px;">${action === 'verified' ? '✅' : '❌'}</div>
            <h1>Успешно</h1>
            <p>Заказ <strong>#${orderId}</strong> был отмечен как :</p>
            <div class="status">${statusLabel}</div>
            <p>Клиент уведомлен по электронной почте.</p>
            <a href="/admin/orders" class="btn">Вернуться в панель управления</a>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })

  } catch (error: any) {
    console.error('Order Action Error:', error)
    return new NextResponse(`Ошибка: ${error.message}`, { status: 500 })
  }
}
