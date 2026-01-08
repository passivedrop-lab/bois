'use client'

import Link from 'next/link'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'

export default function CartPage() {
  const cartItems = []

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Mon Panier</h1>
        <p className="text-wood-600 mb-8">Vérifiez et modifiez vos articles</p>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-wood-900">Produit</h3>
                    <p className="text-sm text-wood-600">Prix: 1,000₽</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-1 hover:bg-wood-100 rounded">
                      <Minus size={18} className="text-wood-600" />
                    </button>
                    <span className="px-4 font-semibold">1</span>
                    <button className="p-1 hover:bg-wood-100 rounded">
                      <Plus size={18} className="text-wood-600" />
                    </button>
                  </div>
                  <button className="p-1 hover:bg-red-100 rounded">
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Summary */}
            <div className="bg-white rounded-lg shadow p-6 h-fit">
              <h2 className="text-xl font-bold text-wood-900 mb-4">Résumé</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-wood-600">
                  <span>Sous-total</span>
                  <span>0₽</span>
                </div>
                <div className="flex justify-between text-wood-600">
                  <span>Livraison</span>
                  <span>0₽</span>
                </div>
                <div className="border-t border-wood-200 pt-3 flex justify-between font-bold text-wood-900">
                  <span>Total</span>
                  <span>0₽</span>
                </div>
              </div>
              <button className="w-full bg-fire-600 text-white py-2 rounded-lg hover:bg-fire-700 transition font-semibold">
                <Link href="/checkout" className="block w-full h-full">
                  Passer la commande
                </Link>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <ShoppingCart className="mx-auto text-wood-300 mb-4" size={48} />
            <p className="text-wood-600 mb-6">Votre panier est vide</p>
            <Link href="/catalogue" className="inline-block bg-fire-600 text-white px-6 py-2 rounded-lg hover:bg-fire-700 transition">
              Continuer les achats
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
