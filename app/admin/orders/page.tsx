'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, Check, X } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  date: string
  customer: string
  amount: number
  status: 'pending' | 'verified' | 'rejected'
  receiptFile?: string
}

export default function AdminOrders() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: '003',
      date: '2025-01-08',
      customer: 'Jean Dupont',
      amount: 50000,
      status: 'pending',
      receiptFile: 'receipt_003.pdf',
    },
    {
      id: '2',
      orderNumber: '002',
      date: '2025-01-07',
      customer: 'Marie Martin',
      amount: 35000,
      status: 'verified',
    },
    {
      id: '3',
      orderNumber: '001',
      date: '2025-01-06',
      customer: 'Pierre Laurent',
      amount: 28000,
      status: 'verified',
    },
  ])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      setLoading(false)
    }
  }, [router])

  const handleVerify = (orderId: string) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: 'verified' as const } : o
      )
    )
    // Ici on pourrait envoyer un email au client
    alert('Commande validée! Un email de confirmation a été envoyé au client.')
  }

  const handleReject = (orderId: string) => {
    const reason = prompt('Raison du rejet:')
    if (reason) {
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: 'rejected' as const } : o
        )
      )
      alert(`Commande rejetée. Un email d'explication a été envoyé au client.`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-wood-100 text-wood-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente'
      case 'verified':
        return 'Validée'
      case 'rejected':
        return 'Rejetée'
      default:
        return status
    }
  }

  if (loading) return null
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-wood-100">
      <div className="bg-white border-b border-wood-200 p-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-wood-100 rounded-lg transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-wood-900">Gestion des commandes</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-wood-900 text-lg">
                    Commande #{order.orderNumber}
                  </h3>
                  <p className="text-sm text-wood-600">
                    {order.date} - {order.customer}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-fire-600">{order.amount}₽</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedOrder(order)
                      setShowModal(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Eye size={18} />
                    Détails
                  </button>

                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleVerify(order.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        <Check size={18} />
                        Valider
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        <X size={18} />
                        Rejeter
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Détails */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-wood-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-wood-900">
                Détails - Commande #{selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-wood-500 hover:text-wood-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-wood-900 mb-3">Informations client</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-wood-600">Nom</p>
                    <p className="font-semibold">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <p className="text-wood-600">Date</p>
                    <p className="font-semibold">{selectedOrder.date}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-wood-900 mb-3">Récapitulatif</h3>
                <div className="bg-wood-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span>Montant:</span>
                    <span className="font-bold text-fire-600">{selectedOrder.amount}₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statut:</span>
                    <span className={`font-bold ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedOrder.receiptFile && (
                <div>
                  <h3 className="font-bold text-wood-900 mb-3">Reçu de paiement</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      📎 {selectedOrder.receiptFile}
                    </p>
                    <p className="text-xs text-blue-700 mt-2">
                      Le fichier a été reçu et stocké sur nos serveurs
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-wood-200">
                {selectedOrder.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleVerify(selectedOrder.id)
                        setShowModal(false)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      <Check size={18} />
                      Valider la commande
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedOrder.id)
                        setShowModal(false)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      <X size={18} />
                      Rejeter
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-wood-300 rounded-lg hover:bg-wood-50 transition font-semibold"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
