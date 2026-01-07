'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { useCartStore } from '@/lib/store/cartStore'
import { createClient } from '@/lib/supabase/client'
import { calculatePriceBreakdown } from '@/lib/utils/taxes'
import { MapPin, User, Phone, CreditCard, Truck, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const cartItems = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const clearCart = useCartStore((state) => state.clearCart)

  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'Россия',
  })

  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')

  const loadProfile = useCallback(async () => {
    if (!user?.id) return

    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          postal_code: data.postal_code || '',
          country: data.country || 'Россия',
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }, [user?.id, supabase])

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout')
      return
    }

    if (cartItems.length === 0) {
      router.push('/cart')
      return
    }

    loadProfile()
  }, [user, router, cartItems, loadProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const subtotal = getTotal()
      const priceBreakdown = calculatePriceBreakdown(subtotal)

      if (!user?.id) {
        throw new Error('Пользователь не авторизован')
      }

      // Save profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          postal_code: profileData.postal_code,
          country: profileData.country,
        })
        .eq('id', user.id)

      if (profileError) {
        console.error('Error updating profile:', profileError)
        // Continue anyway, don't block order creation
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: priceBreakdown.total,
          status: 'pending',
          shipping_address: profileData.address,
          shipping_city: profileData.city,
          shipping_postal_code: profileData.postal_code,
          shipping_country: profileData.country,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItemsData = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData)

      if (itemsError) throw itemsError

      // Clear cart
      await clearCart()

      // Clear user cart in Supabase
      if (user?.id) {
        await supabase
          .from('user_cart')
          .delete()
          .eq('user_id', user.id)
      }

      toast.success('Заказ успешно оформлен!')
      router.push(`/checkout/receipt?orderId=${order.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Ошибка оформления заказа')
    } finally {
      setLoading(false)
    }
  }

  const subtotal = getTotal()
  const priceBreakdown = calculatePriceBreakdown(subtotal)

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-white to-wood-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-wood-900 mb-8">
            Оформление заказа
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <div className="card-premium p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-fire-100 rounded-lg">
                      <Truck className="text-fire-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-semibold text-wood-900">Доставка</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-wood-700 mb-2">
                        <User size={16} className="inline mr-2" />
                        ФИО
                      </label>
                      <input
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                        required
                        className="input-elegant"
                        placeholder="Иванов Иван Иванович"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-wood-700 mb-2">
                        <Phone size={16} className="inline mr-2" />
                        Телефон
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        required
                        className="input-elegant"
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-wood-700 mb-2">
                        <MapPin size={16} className="inline mr-2" />
                        Адрес доставки
                      </label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        required
                        className="input-elegant"
                        placeholder="Улица, дом, квартира"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-wood-700 mb-2">
                          Город
                        </label>
                        <input
                          type="text"
                          value={profileData.city}
                          onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                          required
                          className="input-elegant"
                          placeholder="Москва"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-wood-700 mb-2">
                          Индекс
                        </label>
                        <input
                          type="text"
                          value={profileData.postal_code}
                          onChange={(e) => setProfileData({ ...profileData, postal_code: e.target.value })}
                          required
                          className="input-elegant"
                          placeholder="123456"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="card-premium p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-fire-100 rounded-lg">
                      <CreditCard className="text-fire-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-semibold text-wood-900">Оплата</h2>
                  </div>

                  <div className="bg-wood-50 border border-wood-200 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-wood-900 mb-4">Реквизиты для банковского перевода</h3>
                    <div className="space-y-3 text-wood-700">
                      <div className="flex justify-between">
                        <span className="font-medium">Банк:</span>
                        <span>WoodBank Russia</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Получатель:</span>
                        <span>ДРОВА ПРЕМИУМ OOO</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">IBAN / Счет:</span>
                        <span className="font-mono">RU12 3456 7890 1234 5678 9012 34</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">BIC / БИК:</span>
                        <span className="font-mono">WOODRU22</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-full text-amber-600 shrink-0">
                      <Lock size={18} />
                    </div>
                    <p className="text-sm text-amber-800">
                      <strong>Важное примечание:</strong> После нажатия кнопки "Оформить заказ", вам необходимо будет сделать перевод и <strong>обязательно загрузить квитанцию об оплате</strong> на следующей странице для подтверждения вашего заказа.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="card-premium p-6 sticky top-24">
                  <h2 className="text-xl font-semibold text-wood-900 mb-6">Ваш заказ</h2>

                  <div className="space-y-3 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-wood-600">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-semibold text-wood-900">
                          {(item.price * item.quantity).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-wood-200 pt-4 space-y-3 mb-6">
                    <div className="flex justify-between text-wood-700">
                      <span>Подытог</span>
                      <span>{priceBreakdown.subtotal.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽</span>
                    </div>
                    <div className="flex justify-between text-wood-700">
                      <span>НДС (20%)</span>
                      <span>{priceBreakdown.tax.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽</span>
                    </div>
                    <div className="flex justify-between text-wood-700">
                      <span>Доставка</span>
                      <span>{priceBreakdown.shipping === 0 ? 'Бесплатно' : `${priceBreakdown.shipping.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`}</span>
                    </div>
                    <div className="border-t border-wood-200 pt-3">
                      <div className="flex justify-between text-xl font-bold text-wood-900">
                        <span>Всего</span>
                        <span>{priceBreakdown.total.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽</span>
                      </div>
                      <p className="text-xs text-wood-500 mt-2">НДС включен</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary mb-4 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Lock size={20} />
                    {loading ? 'Оформление...' : 'Оформить заказ'}
                  </button>

                  <p className="text-xs text-wood-500 text-center">
                    Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
