'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, X, ExternalLink, Clock, DollarSign, User } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminOrdersPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState<any[]>([])

    const fetchOrders = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            toast.error('Erreur lors du chargement des commandes')
        } else {
            setOrders(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const handleValidate = async (orderId: string) => {
        const { error } = await supabase
            .from('orders')
            .update({
                status: 'payment_validated',
                payment_status: 'paid'
            })
            .eq('id', orderId)

        if (error) {
            toast.error('Erreur lors de la validation')
        } else {
            toast.success('Paiement validé !')
            fetchOrders()
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>

    return (
        <div className="min-h-screen bg-wood-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-serif font-bold text-wood-900 mb-8">Tableau de Bord Admin - Commandes</h1>

                <div className="grid gap-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-wood-200">
                            <div className="p-6">
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-wood-100 rounded-lg text-wood-600">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-wood-900">Commande #{order.id.slice(0, 8)}</h3>
                                            <p className="text-sm text-wood-500">{new Date(order.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'payment_validated' ? 'bg-green-100 text-green-700' :
                                                order.status === 'in_verification' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-wood-100 text-wood-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6 mb-6">
                                    <div className="flex items-start gap-3">
                                        <User size={18} className="text-wood-400 mt-1" />
                                        <div>
                                            <p className="text-xs text-wood-500 uppercase font-bold">Client</p>
                                            <p className="text-wood-900 font-medium">{order.customer_name}</p>
                                            <p className="text-sm text-wood-600">{order.customer_email}</p>
                                            <p className="text-sm text-wood-600">{order.customer_phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <DollarSign size={18} className="text-wood-400 mt-1" />
                                        <div>
                                            <p className="text-xs text-wood-500 uppercase font-bold">Montant</p>
                                            <p className="text-wood-900 font-bold text-lg">{order.total_amount.toLocaleString('ru-RU')} ₽</p>
                                            <p className="text-sm text-wood-600">Méthode: {order.payment_method}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        {order.receipt_url && (
                                            <a
                                                href={order.receipt_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-fire-300 rounded-lg hover:bg-fire-50 transition text-fire-600"
                                            >
                                                <ExternalLink size={24} className="mb-1" />
                                                <span className="text-xs font-bold">VOIR LE REÇU</span>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {order.status === 'in_verification' && (
                                    <div className="flex gap-3 border-t border-wood-100 pt-4">
                                        <button
                                            onClick={() => handleValidate(order.id)}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition"
                                        >
                                            <Check size={18} /> Valider le Paiement
                                        </button>
                                        <button
                                            className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {orders.length === 0 && (
                        <div className="bg-white p-12 text-center rounded-xl border border-wood-200">
                            <p className="text-wood-500">Aucune commande trouvée.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
