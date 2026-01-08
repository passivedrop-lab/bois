'use client'

import Link from 'next/link'
import { ArrowLeft, Package } from 'lucide-react'

export default function OrdersPage() {
  const orders = [
    { id: '001', date: '2025-12-15', amount: '4,500₽', status: 'Livré' },
    { id: '002', date: '2025-11-28', amount: '2,850₽', status: 'En cours' },
    { id: '003', date: '2025-01-08', amount: '50,000₽', status: 'En attente de vérification' },
  ]

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <Link 
          href="/profile" 
          className="inline-flex items-center gap-2 text-fire-600 hover:text-fire-700 mb-6"
        >
          <ArrowLeft size={18} />
          Retour au profil
        </Link>
        
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Mes Commandes</h1>
        <p className="text-wood-600 mb-8">Suivi de vos commandes</p>
        
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-wood-100 p-3 rounded-lg">
                      <Package className="text-wood-600" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-wood-900">Commande #{order.id}</p>
                      <p className="text-sm text-wood-600">{order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-wood-900">{order.amount}</p>
                    <p className={`text-sm font-semibold ${order.status === 'Livré' ? 'text-green-600' : order.status === 'En attente de vérification' ? 'text-yellow-600' : 'text-orange-600'}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="mx-auto text-wood-300 mb-4" size={48} />
            <p className="text-wood-600 mb-6">Aucune commande pour le moment</p>
            <Link href="/catalogue" className="inline-block bg-fire-600 text-white px-6 py-2 rounded-lg hover:bg-fire-700 transition">
              Continuer les achats
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
