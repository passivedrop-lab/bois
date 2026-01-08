'use client'

import Link from 'next/link'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'

export default function CartPage() {
  const { items: cartItems, removeItem, updateQuantity, clearCart, getTotal } = useCartStore()

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Корзина</h1>
        <p className="text-wood-600 mb-8">Проверьте и подтвердите ваши товары</p>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
                  {item.image && (
                    <div className="w-20 h-20 bg-wood-100 rounded mr-4 flex-shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-wood-900">{item.name}</h3>
                    <p className="text-sm text-wood-600">Цена: {item.price}₽</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-wood-100 rounded"
                    >
                      <Minus size={18} className="text-wood-600" />
                    </button>
                    <span className="px-4 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-wood-100 rounded"
                    >
                      <Plus size={18} className="text-wood-600" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 hover:bg-red-100 rounded ml-4"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow p-6 h-fit">
              <h2 className="text-xl font-bold text-wood-900 mb-4">Объемы</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-wood-600">
                  <span>Подытог</span>
                  <span>{getTotal()}₽</span>
                </div>
                <div className="flex justify-between text-wood-600">
                  <span>Доставка</span>
                  <span>Рассчитывается далее</span>
                </div>
                <div className="border-t border-wood-200 pt-3 flex justify-between font-bold text-wood-900">
                  <span>Итого</span>
                  <span>{getTotal()}₽</span>
                </div>
              </div>
              <button className="w-full bg-fire-600 text-white py-3 rounded-lg hover:bg-fire-700 transition font-semibold mb-3">
                <Link href="/checkout">
                  Оформить заказ
                </Link>
              </button>
              <button
                onClick={() => clearCart()}
                className="w-full border border-wood-300 text-wood-700 py-2 rounded-lg hover:bg-wood-50 transition font-semibold"
              >
                Очистить корзину
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <ShoppingCart className="mx-auto text-wood-300 mb-4" size={48} />
            <p className="text-wood-600 mb-6">Ваша корзина пуста</p>
            <Link href="/catalogue" className="inline-block bg-fire-600 text-white px-6 py-2 rounded-lg hover:bg-fire-700 transition">
              Продолжить покупки
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
