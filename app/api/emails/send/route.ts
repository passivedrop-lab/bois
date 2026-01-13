import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { type, email, orderId, orderTotal, customerName, reason } = await request.json()

    let subject = ''
    let html = ''

    if (type === 'confirmation') {
      subject = `Подтверждение заказа #${orderId}`
      html = `
          <h1>Спасибо за ваш заказ, ${customerName}!</h1>
          <p>Мы получили ваш заказ #${orderId} на сумму ${orderTotal}₽.</p>
          <p>Мы проверим вашу оплату и сообщим вам, как только заказ будет подтвержден.</p>
          <p>С уважением,<br/>Команда TsarstvoDereva</p>
        `
    } else if (type === 'verified') {
      subject = `Заказ #${orderId} подтвержден !`
      html = `
          <h1>Хорошие новости !</h1>
          <p>Ваш заказ #${orderId} был подтвержден.</p>
          <p>Мы готовим заказ к отправке. Вы получите еще одно письмо с деталями отслеживания.</p>
        `
    } else if (type === 'rejected') {
      subject = `Проблема с заказом #${orderId}`
      html = `
          <h1>Важная информация</h1>
          <p>К сожалению, ваш заказ #${orderId} не может быть подтвержден.</p>
          <p><strong>Причина:</strong> ${reason}</p>
          <p>Пожалуйста, свяжитесь с нашей службой поддержки для решения этой проблемы.</p>
        `
    } else if (type === 'admin_notification') {
      subject = `Новый заказ #${orderId}`

      let itemsHtml = ''
      try {
        const supabase = await createClient()
        const { data: items } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId)

        if (items && items.length > 0) {
          itemsHtml = items.map((item: any) =>
            `<li style="margin-bottom: 5px;">
                            ${item.product_name} <br/>
                            <span style="color: #666; font-size: 0.9em;">Кол-во: ${item.quantity} | Цена: ${item.price}₽</span>
                        </li>`
          ).join('')
        } else {
          itemsHtml = '<li>Товары не найдены</li>'
        }
      } catch (e) {
        console.error('Error fetching items for email:', e)
        itemsHtml = '<li>Ошибка загрузки деталей</li>'
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const confirmLink = `${baseUrl}/api/admin/orders/action?id=${orderId}&action=verified`
      const rejectLink = `${baseUrl}/api/admin/orders/action?id=${orderId}&action=rejected`

      html = `
           <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
             <h1>Получен новый заказ</h1>
             <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Клиент:</strong> ${customerName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p style="margin: 5px 0;"><strong>Общая сумма:</strong> <span style="color: #ea580c; font-weight: bold;">${orderTotal}₽</span></p>
                <p style="margin: 5px 0;"><strong>ID Заказа:</strong> #${orderId}</p>
             </div>
             
             <h3>Заказанные товары :</h3>
             <ul style="border: 1px solid #e5e7eb; padding: 15px 15px 15px 30px; border-radius: 8px;">
                ${itemsHtml}
             </ul>

             <div style="margin-top: 30px; padding: 20px; border-top: 1px solid #eee; text-align: center;">
               <p style="margin-bottom: 15px;">Быстрое действие :</p>
               <a href="${confirmLink}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-right: 15px; font-weight: bold;">✅ Подтвердить</a>
               <a href="${rejectLink}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">❌ Отклонить</a>
             </div>

             <p style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 0.9em;">
               <a href="${baseUrl}/admin/orders" style="color: #4b5563;">Посмотреть детали в панели управления</a>
             </p>
           </div>
        `
    }

    const data = await resend.emails.send({
      from: 'TsarstvoDereva <onboarding@resend.dev>', // Use verified domain in prod
      to: [email],
      subject: subject,
      html: html,
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 })
  }
}
