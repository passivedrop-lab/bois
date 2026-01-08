'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Package, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'

interface Order {
  id: number
  created_at: string
  total_price: number
  status: string
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (!error && data) {
          setOrders(data)
        }
        setLoading(false)
      }
      fetchOrders()
    }
  }, [user, supabase])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'delivered':
        return { icon: CheckCircle, color: 'text-green-600', text: 'Доставлено' }
      case 'shipped':
        return { icon: Truck, color: 'text-blue-600', text: 'В пути' }
      case 'processing':
        return { icon: Clock, color: 'text-yellow-600', text: 'В обработке' }
      case 'cancelled':
        return { icon: AlertCircle, color: 'text-red-600', text: 'Отменено' }
      default:
        return { icon: Clock, color: 'text-gray-600', text: 'Ожидание' }
    }
  }

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-fire-600 hover:text-fire-700 mb-6"
        >
          <ArrowLeft size={18} />
          Назад к профилю
        </Link>

        <h1 className="text-4xl font-bold text-wood-900 mb-2">Мои Заказы</h1>
        <p className="text-wood-600 mb-8">История ваших покупок</p>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-wood-50 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status)
              const StatusIcon = statusInfo.icon

              return (
                <div key={order.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-wood-100 p-3 rounded-lg">
                        <Package className="text-wood-600" size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-wood-900">Заказ #{order.id}</p>
                        <p className="text-sm text-wood-600">
                          {new Date(order.created_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-wood-900">
                        {order.total_price.toLocaleString('ru-RU')} ₽
                      </p>
                      <div className={`flex items-center justify-end gap-1.5 text-sm font-semibold ${statusInfo.color}`}>
                        <StatusIcon size={16} />
                        {statusInfo.text}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="mx-auto text-wood-300 mb-4" size={48} />
            <p className="text-wood-600 mb-6">У вас пока нет заказов</p>
            <Link href="/catalogue" className="inline-block bg-fire-600 text-white px-6 py-2 rounded-lg hover:bg-fire-700 transition">
              Перейти в каталог
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
