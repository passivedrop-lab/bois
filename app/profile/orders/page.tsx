'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { Package, Calendar, MapPin, CheckCircle, Clock, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Order {
  id: string
  total: number
  status: string
  created_at: string
  shipping_address: string
  shipping_city: string
  order_items: Array<{
    product_name: string
    price: number
    quantity: number
  }>
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setOrders(data || [])
    } catch (error: any) {
      toast.error('Ошибка загрузки заказов')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user?.id) {
      loadOrders()
    }
  }, [user?.id, authLoading, router])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="text-green-600" size={20} />
      case 'cancelled':
        return <XCircle className="text-red-600" size={20} />
      default:
        return <Clock className="text-fire-600" size={20} />
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'В обработке',
      processing: 'Обрабатывается',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменен',
    }
    return statusMap[status] || status
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-wood-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fire-600 mx-auto"></div>
          <p className="mt-4 text-wood-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-white to-wood-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-wood-900 mb-8">
            Мои заказы
          </h1>

          {orders.length === 0 ? (
            <div className="card-premium p-12 text-center">
              <Package size={64} className="text-wood-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-wood-900 mb-2">
                У вас пока нет заказов
              </h2>
              <p className="text-wood-600 mb-6">
                Начните покупки, чтобы увидеть свои заказы здесь
              </p>
              <a href="/products" className="btn-primary inline-block">
                Перейти к каталогу
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="card-premium p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b border-wood-200">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="text-fire-600" size={24} />
                        <h3 className="text-xl font-semibold text-wood-900">
                          Заказ #{order.id.slice(0, 8)}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-wood-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          {new Date(order.created_at).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          {order.shipping_city}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <div className="text-2xl font-bold text-wood-900 mb-2">
                        {order.total.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-medium text-wood-700">
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.order_items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-wood-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-wood-900">{item.product_name}</p>
                          <p className="text-sm text-wood-600">
                            Количество: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-wood-900">
                            {(item.price * item.quantity).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
