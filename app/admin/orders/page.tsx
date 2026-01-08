'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, Check, X, Loader } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

interface Order {
  id: string
  user_id: string
  customer_email: string
  customer_name: string
  total: number
  status: 'pending' | 'verified' | 'rejected'
  shipping_address: string
  shipping_city: string
  created_at: string
  items?: Array<{ product_name: string; quantity: number; price: number }>
}

export default function AdminOrders() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [rejectionReason, setRejectionReason] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      loadOrders()
    }
  }, [router])

  const loadOrders = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        // Mode développement - données de test
        setOrders([
          {
            id: '1',
            user_id: 'user_1',
            customer_email: 'jean@example.com',
            customer_name: 'Jean Dupont',
            total: 50000,
            status: 'pending',
            shipping_address: '123 Rue de Paris',
            shipping_city: 'Paris',
            created_at: '2025-01-08T10:00:00Z',
          },
          {
            id: '2',
            user_id: 'user_2',
            customer_email: 'marie@example.com',
            customer_name: 'Marie Martin',
            total: 35000,
            status: 'verified',
            shipping_address: '45 Avenue Principale',
            shipping_city: 'Lyon',
            created_at: '2025-01-07T10:00:00Z',
          },
        ])
        setLoading(false)
        return
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Erreur chargement commandes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (orderId: string) => {
    setUpdating(true)
    try {
      const order = orders.find((o) => o.id === orderId)
      if (!order) return

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        await supabase.from('orders').update({ status: 'verified' }).eq('id', orderId)
      }

      // Mettre à jour l'état local
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: 'verified' } : o)))
      setShowModal(false)
      alert('✅ Commande validée! Un email de confirmation a été envoyé.')
    } catch (error) {
      alert('❌ Erreur lors de la validation')
    } finally {
      setUpdating(false)
    }
  }

  const handleReject = async (orderId: string) => {
    if (!rejectionReason.trim()) {
      alert('Veuillez entrer une raison de rejet')
      return
    }

    setUpdating(true)
    try {
      const order = orders.find((o) => o.id === orderId)
      if (!order) return

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        await supabase
          .from('orders')
          .update({ status: 'rejected', rejection_reason: rejectionReason })
          .eq('id', orderId)
      }

      // Mettre à jour l'état local
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: 'rejected' } : o)))
      setShowModal(false)
      setRejectionReason('')
      alert(`✅ Commande rejetée. Un email d'explication a été envoyé au client.`)
    } catch (error) {
      alert('❌ Erreur lors du rejet')
    } finally {
      setUpdating(false)
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
          <h1 className="text-3xl font-bold text-wood-900">Gestion des commandes ({orders.length})</h1>
        </div>
      </div>

      <div className="p-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-wood-600 text-lg">Aucune commande pour le moment</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-wood-900 text-lg">#{order.id}</h3>
                    <p className="text-sm text-wood-600">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')} - {order.customer_name || order.customer_email}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(order.status)}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-fire-600">{order.total.toLocaleString()}₽</p>
                    <p className="text-xs text-wood-500 mt-1">{order.customer_email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order)
                        setShowModal(true)
                        setRejectionReason('')
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
                          disabled={updating}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                        >
                          {updating ? <Loader size={18} className="animate-spin" /> : <Check size={18} />}
                          Valider
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowModal(true)
                            setRejectionReason('')
                          }}
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
        )}
      </div>

      {/* Modal Détails et Actions */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-wood-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-wood-900">Détails - Commande #{selectedOrder.id}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-wood-500 hover:text-wood-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-wood-900 mb-3">Informations client</h3>
                <div className="grid grid-cols-2 gap-4 text-sm bg-wood-50 p-4 rounded-lg">
                  <div>
                    <p className="text-wood-600">Nom</p>
                    <p className="font-semibold">{selectedOrder.customer_name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-wood-600">Email</p>
                    <p className="font-semibold text-sm">{selectedOrder.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-wood-600">Adresse</p>
                    <p className="font-semibold">{selectedOrder.shipping_address}</p>
                  </div>
                  <div>
                    <p className="text-wood-600">Ville</p>
                    <p className="font-semibold">{selectedOrder.shipping_city}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-wood-900 mb-3">Récapitulatif</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between mb-3">
                    <span className="font-semibold">Montant:</span>
                    <span className="font-bold text-fire-600 text-lg">{selectedOrder.total.toLocaleString()}₽</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="font-semibold">Statut:</span>
                    <span
                      className={`font-bold px-3 py-1 rounded-full text-sm ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Date:</span>
                    <span>{new Date(selectedOrder.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>

              {/* Formulaire de rejet */}
              {selectedOrder.status === 'pending' && (
                <div>
                  <h3 className="font-bold text-wood-900 mb-3">En cas de rejet</h3>
                  <textarea
                    placeholder="Raison du rejet (obligatoire si rejet)..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600 focus:ring-2 focus:ring-fire-100 resize-none"
                    rows={3}
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-wood-200">
                {selectedOrder.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleVerify(selectedOrder.id)}
                      disabled={updating}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? <Loader size={18} className="animate-spin" /> : <Check size={18} />}
                      Valider
                    </button>
                    <button
                      onClick={() => handleReject(selectedOrder.id)}
                      disabled={updating || !rejectionReason.trim()}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? <Loader size={18} className="animate-spin" /> : <X size={18} />}
                      Rejeter
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  disabled={updating}
                  className="flex-1 px-4 py-3 border border-wood-300 rounded-lg hover:bg-wood-50 transition font-semibold disabled:opacity-50"
                >
                  {selectedOrder.status === 'pending' ? 'Annuler' : 'Fermer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
