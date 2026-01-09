'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, Check, X, Loader, Search, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import toast from 'react-hot-toast'

interface Order {
  id: number
  user_id: string
  customer_email: string
  customer_name: string
  total_price: number
  status: 'pending' | 'verified' | 'rejected' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  delivery_address: string
  created_at: string
  rejection_reason?: string
}

export default function AdminOrders() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [rejectionReason, setRejectionReason] = useState('')
  const [updating, setUpdating] = useState(false)
  const [filter, setFilter] = useState('all')

  const supabase = createClient()

  useEffect(() => {
    // Check for secret cookie access first
    const hasSecretAccess = document.cookie.includes('admin_secret_access=true')

    if (hasSecretAccess) {
      setIsAdmin(true)
      loadOrders()
      return
    }

    if (!authLoading) {
      if (!user) {
        router.push('/admin/login')
        return
      }

      const checkRole = async () => {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (data?.role === 'admin') {
          setIsAdmin(true)
          loadOrders()
        } else {
          router.push('/')
        }
      }
      checkRole()
    }
  }, [user, authLoading, router, supabase])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setOrders(data)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error('Erreur lors du chargement des commandes')
    } finally {
      setLoading(false)
    }
  }

  const sendEmail = async (type: string, order: Order, reason?: string) => {
    try {
      await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          email: order.customer_email,
          orderId: order.id,
          orderTotal: order.total_price,
          customerName: order.customer_name,
          reason
        })
      })
    } catch (error) {
      console.error('Failed to send email:', error)
      toast.error('Erreur lors de l\'envoi de l\'email')
    }
  }

  const handleUpdateStatus = async (orderId: number, newStatus: string, reason?: string) => {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          rejection_reason: reason || null
        })
        .eq('id', orderId)

      if (error) throw error

      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o))

      // Send Email Notification
      const order = orders.find(o => o.id === orderId)
      if (order) {
        if (newStatus === 'verified') {
          await sendEmail('verified', order)
        } else if (newStatus === 'rejected') {
          await sendEmail('rejected', order, reason)
        }
      }

      toast.success(`Commande mis à jour: ${newStatus}`)
      setShowModal(false)
      setRejectionReason('')
    } catch (error: any) {
      console.error('Error updating status:', error)
      toast.error('Erreur: ' + error.message)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'verified': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (authLoading || (!isAdmin && !orders.length && loading)) {
    return (
      <div className="min-h-screen bg-wood-100 flex items-center justify-center">
        <Loader className="w-8 h-8 text-fire-600 animate-spin" />
      </div>
    )
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="min-h-screen bg-wood-100">
      <div className="bg-white border-b border-wood-200 p-6 shadow-sm sticky top-0 z-30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Link href="/admin" className="p-2 hover:bg-wood-100 rounded-lg transition">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-wood-900">Gestion des commandes</h1>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === 'all' ? 'bg-wood-900 text-white' : 'bg-wood-100 text-wood-600'}`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-yellow-50 text-yellow-700'}`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === 'verified' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700'}`}
            >
              Validés
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <Loader className="mx-auto animate-spin mb-2" />
            <p>Chargement des commandes...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Search className="mx-auto text-wood-300 mb-4" size={48} />
            <p className="text-wood-600 text-lg">Aucune commande trouvée</p>
            <button
              onClick={loadOrders}
              className="mt-4 flex items-center justify-center gap-2 text-fire-600 font-medium hover:underline mx-auto"
            >
              <RefreshCw size={16} /> Rafraîchir
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition border border-wood-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-wood-900 text-lg">#{order.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-wood-600">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="font-medium text-wood-800 mt-1">{order.customer_name} <span className="text-wood-400">|</span> {order.customer_email}</p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="text-right">
                      <p className="text-sm text-wood-500">Total</p>
                      <p className="text-xl font-bold text-fire-600">{order.total_price.toLocaleString()} ₽</p>
                    </div>

                    <button
                      onClick={() => { setSelectedOrder(order); setShowModal(true); setRejectionReason(''); }}
                      className="px-4 py-2 bg-wood-100 text-wood-700 rounded-lg hover:bg-wood-200 transition font-medium flex items-center gap-2"
                    >
                      <Eye size={18} />
                      <span className="hidden sm:inline">Gérer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Actions */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-wood-200 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-wood-900">Commande #{selectedOrder.id}</h2>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-wood-100 rounded-full transition">
                <X size={24} className="text-wood-500" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-wood-400 uppercase tracking-wider mb-3">Client</h3>
                  <div className="bg-wood-50 p-4 rounded-lg space-y-1 text-sm">
                    <p><span className="font-medium">Nom:</span> {selectedOrder.customer_name}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.customer_email}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-wood-400 uppercase tracking-wider mb-3">Livraison</h3>
                  <div className="bg-wood-50 p-4 rounded-lg space-y-1 text-sm">
                    <p><span className="font-medium">Adresse:</span> {selectedOrder.delivery_address || 'Non spécifiée'}</p>
                  </div>
                </div>
              </div>

              {/* Items Placeholder (Since order_items fetch not implemented yet in this view for simplicity, or we can fetch it) */}
              {/* If we want order items, we need to fetch them. For now, we show total. */}

              {/* Actions */}
              {selectedOrder.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6">
                  <h3 className="font-bold text-yellow-900 mb-4">Actions requises</h3>

                  <div className="space-y-4">
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'verified')}
                      disabled={updating}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition shadow-lg shadow-green-200 disabled:opacity-50"
                    >
                      {updating ? <Loader className="animate-spin" /> : <Check />}
                      Valider la commande
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-yellow-200" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-yellow-50 px-2 text-yellow-600">Ou</span>
                      </div>
                    </div>

                    <div>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Raison du rejet (obligatoire)..."
                        className="w-full p-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-2 text-sm"
                        rows={2}
                      />
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'rejected', rejectionReason)}
                        disabled={updating || !rejectionReason.trim()}
                        className="w-full flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 py-3 rounded-lg font-bold transition disabled:opacity-50"
                      >
                        {updating ? <Loader className="animate-spin" /> : <X />}
                        Rejeter la commande
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-wood-50 p-4 border-t border-wood-200 text-center">
              <button onClick={() => setShowModal(false)} className="text-wood-600 font-medium hover:text-wood-900">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
