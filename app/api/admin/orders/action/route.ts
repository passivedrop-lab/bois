import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    const action = searchParams.get('action') as 'verified' | 'rejected'

    if (!orderId || !action || !['verified', 'rejected'].includes(action)) {
        return new NextResponse('Action invalide', { status: 400 })
    }

    try {
        const supabase = await createClient()

        // 1. Get order details first to notify customer later
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()

        if (fetchError || !order) {
            return new NextResponse(`Commande #${orderId} introuvable`, { status: 404 })
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
                })
            })
        } catch (emailErr) {
            console.error('Failed to send customer notification:', emailErr)
        }

        // 4. Return success page
        const statusLabel = action === 'verified' ? 'VALIDÉE' : 'REJETÉE'
        const statusColor = action === 'verified' ? '#16a34a' : '#dc2626'

        return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Commande Mise à Jour</title>
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
            <h1>Succès</h1>
            <p>La commande <strong>#${orderId}</strong> a été marquée comme :</p>
            <div class="status">${statusLabel}</div>
            <p>Le client a été prévenu par email.</p>
            <a href="/admin/orders" class="btn">Retour au Dashboard</a>
          </div>
        </body>
      </html>
    `, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        })

    } catch (error: any) {
        console.error('Order Action Error:', error)
        return new NextResponse(`Erreur: ${error.message}`, { status: 500 })
    }
}
