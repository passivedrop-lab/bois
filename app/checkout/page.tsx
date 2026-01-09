'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ShoppingCart, Loader, Copy, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import { useCartStore } from '@/lib/store/cartStore'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  const { items, getTotal, clearCart } = useCartStore()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    instructions: ''
  })

  const cartTotal = getTotal()
  const shippingCost = cartTotal > 100000 ? 0 : 5000
  const grandTotal = cartTotal + shippingCost

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Пожалуйста, войдите для оформления заказа')
      router.push('/login?next=/checkout')
    }
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email! }))
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-fire-600" size={48} />
      </div>
    )
  }

  if (!user) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Скопировано в буфер обмена')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error('Ваша корзина пуста')
      return
    }

    setLoading(true)

    try {
      if (!user) {
        toast.error('Пожалуйста, войдите для оформления заказа')
        router.push('/login?next=/checkout')
        return
      }

      // 1. Create Order in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_email: formData.email,
          delivery_address: `${formData.address}, ${formData.postalCode} ${formData.city}`,
          total_price: grandTotal,
          status: 'pending',
          notes: formData.instructions
        })
        .select()
        .single()

      console.log('Order created:', order)
      if (orderError) throw orderError
      if (!order) throw new Error('Order data is missing after insertion')

      // 2. Insert Order Items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id, // Use string ID as-is (e.g., "bc-1")
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // 3. Trigger Email Notification (Order Confirmation)
      try {
        await fetch('/api/emails/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'confirmation',
            email: formData.email,
            orderId: order.id,
            orderTotal: grandTotal,
            customerName: `${formData.firstName} ${formData.lastName}`
          })
        })

        // Send Admin Notification
        await fetch('/api/emails/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'admin_notification',
            email: 'admin@tsarstvodereva.ru',
            orderId: order.id,
            orderTotal: grandTotal,
            customerName: `${formData.firstName} ${formData.lastName}`
          })
        })
      } catch (emailErr) {
        console.error('Email error:', emailErr)
        // Don't block the user if email fail
      }

      // 4. Clear Cart
      await clearCart()

      console.log('Redirecting to receipt with:', { orderId: order.id, amount: grandTotal })
      toast.success('Заказ успешно создан')

      const orderIdStr = String(order.id)
      const amountStr = String(grandTotal)
      router.push(`/checkout/receipt?orderId=${orderIdStr}&amount=${amountStr}`)
    } catch (error: any) {
      const detailedError = error.message || error.details || error.code || 'Техническая ошибка';
      console.error('CRITICAL Order Creation Error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        error
      })
      toast.error(`Ошибка при создании заказа: ${detailedError}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Оформить заказ</h1>
        <p className="text-wood-600 mb-12">Завершите покупку в несколько простых шагов</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1: Informations personnelles */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-wood-900 mb-4">1. Личная информация</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="firstName"
                    type="text"
                    required
                    placeholder="Имя"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                  <input
                    name="lastName"
                    type="text"
                    required
                    placeholder="Фамилия"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="Телефон"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
              </div>
            </div>

            {/* Section 2: Informations de livraison */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-wood-900 mb-4">2. Информация о доставке</h2>
              <div className="space-y-4">
                <input
                  name="address"
                  type="text"
                  required
                  placeholder="Полный адрес"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="city"
                    type="text"
                    required
                    placeholder="Город"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                  <input
                    name="postalCode"
                    type="text"
                    required
                    placeholder="Почтовый код"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                </div>
                <textarea
                  name="instructions"
                  placeholder="Особые инструкции (по желанию)"
                  rows={3}
                  value={formData.instructions}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                ></textarea>
              </div>
            </div>

            {/* Section 3: Informations de paiement */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-blue-100">
              <h2 className="text-xl font-bold text-wood-900 mb-4 flex items-center gap-2">
                3. Способ оплаты: Банковский перевод
              </h2>

              <div className="bg-blue-50 rounded-lg p-5 space-y-4 mb-6">
                <p className="text-sm text-blue-800 font-medium">
                  Используйте следующие реквизиты для оплаты вашего заказа:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border border-blue-200 relative group">
                    <span className="text-[10px] uppercase text-blue-600 font-bold block mb-1">Получатель</span>
                    <span className="text-wood-900 font-bold">Коссиви Жоашим Микаель Эдем С.</span>
                    <button type="button" onClick={() => copyToClipboard('Коссиви Жоашим Микаель Эдем С.')} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                      <Copy size={14} className="text-blue-600" />
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded border border-blue-200 relative group">
                    <span className="text-[10px] uppercase text-blue-600 font-bold block mb-1">Номер карты</span>
                    <span className="text-wood-900 font-bold font-mono">2202 2069 4562 7276</span>
                    <button type="button" onClick={() => copyToClipboard('2202 2069 4562 7276')} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                      <Copy size={14} className="text-blue-600" />
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded border border-blue-200 relative group">
                    <span className="text-[10px] uppercase text-blue-600 font-bold block mb-1">Банк</span>
                    <span className="text-wood-900 font-bold font-mono">СБЕРБАНК</span>
                    <button type="button" onClick={() => copyToClipboard('СБЕРБАНК')} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                      <Copy size={14} className="text-blue-600" />
                    </button>
                  </div>

                  <div className="bg-orange-100 p-3 rounded border border-orange-200">
                    <span className="text-[10px] uppercase text-orange-700 font-bold block mb-1">Сумма к оплате</span>
                    <span className="text-orange-700 font-bold text-lg">{grandTotal.toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded flex items-start gap-3">
                <Info className="text-amber-500 shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-amber-900">
                  <p className="font-bold mb-1">Внимание !</p>
                  <p>На следующей странице вы <strong>ОБЯЗАНЫ загрузить квитанцию</strong> (скан или фото) вашего перевода. Без этого документа ваш заказ не будет обработан.</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <Link
                href="/cart"
                className="px-6 py-3 border-2 border-wood-300 text-wood-900 rounded-lg hover:bg-wood-50 transition font-semibold"
              >
                Назад в корзину
              </Link>
              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="flex-1 px-6 py-3 bg-fire-600 text-white rounded-lg hover:bg-fire-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader className="animate-spin" /> : 'Подтвердить заказ'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </div>

          {/* Sidebar - Корзина */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h3 className="text-lg font-bold text-wood-900 mb-4 flex items-center gap-2">
                <ShoppingCart size={20} className="text-fire-600" />
                Ваша корзина
              </h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-wood-200">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="text-wood-900 font-medium line-clamp-1">{item.name}</p>
                      <p className="text-wood-500 text-xs">Кол-во: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-wood-900 whitespace-nowrap ml-4">
                      {(item.price * item.quantity).toLocaleString()} ₽
                    </span>
                  </div>
                ))}

                {items.length === 0 && (
                  <p className="text-sm text-wood-500 text-center py-4">Корзина пуста</p>
                )}

                <div className="flex justify-between text-sm pt-2">
                  <span className="text-wood-700">Итого товары</span>
                  <span className="font-semibold">{cartTotal.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-wood-700">Доставка</span>
                  <span className="font-semibold">{shippingCost.toLocaleString()} ₽</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-wood-900 mb-6">
                <span>Итого к оплате:</span>
                <span className="text-xl text-fire-600">{grandTotal.toLocaleString()} ₽</span>
              </div>

              {cartTotal < 100000 ? (
                <div className="text-[10px] text-wood-500 text-center">
                  Добавьте товаров на {(100000 - cartTotal).toLocaleString()}₽ для бесплатной доставки
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-900 text-center">
                  ✓ Бесплатная доставка применена
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
