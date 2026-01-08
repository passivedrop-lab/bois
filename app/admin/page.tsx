'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Package, ShoppingCart, LogOut, Menu, X, TrendingUp } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

interface Stats {
  pendingOrders: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    pendingOrders: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const email = localStorage.getItem('adminEmail')

    if (!token) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      setAdminEmail(email || '')
      loadStats()
    }
  }, [router])

  const loadStats = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        // Mode développement - données simulées
        setStats({
          pendingOrders: 3,
          totalProducts: 24,
          totalOrders: 142,
          totalRevenue: 45680,
        })
        setLoading(false)
        return
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      // Récupérer les statistiques
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from('orders').select('id, total, status'),
        supabase.from('products').select('id'),
      ])

      const orders = ordersRes.data || []
      const products = productsRes.data || []

      const pendingOrders = orders.filter((o) => o.status === 'pending').length
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

      setStats({
        pendingOrders,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
      })
    } catch (error) {
      console.error('Erreur chargement stats:', error)
      // Garder les valeurs par défaut
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    router.push('/admin/login')
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  const statCards = [
    {
      label: 'Commandes en attente',
      value: stats.pendingOrders.toString(),
      icon: ShoppingCart,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Produits',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Commandes totales',
      value: stats.totalOrders.toString(),
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Revenu total',
      value: `${(stats.totalRevenue / 1000).toFixed(1)}k₽`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="flex h-screen bg-wood-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 z-40 w-64 h-full bg-wood-900 text-white transition-transform duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-wood-800">
          <h1 className="text-2xl font-bold">TsarstvoDereva</h1>
          <p className="text-wood-400 text-sm">Admin Panel</p>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-wood-800 transition"
          >
            <BarChart3 size={20} />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-wood-800 transition"
          >
            <Package size={20} />
            Produits
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-wood-800 transition"
          >
            <ShoppingCart size={20} />
            Commandes
          </Link>
        </nav>

        <div className="p-6 border-t border-wood-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-600 transition text-white"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-wood-200 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-wood-100 rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="text-2xl font-bold text-wood-900">Dashboard</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-wood-600">Connecté en tant que</p>
            <p className="font-semibold text-wood-900">{adminEmail}</p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-wood-600 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-wood-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon size={24} className={stat.color} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-wood-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/products/new"
                  className="block w-full bg-fire-600 text-white py-2 px-4 rounded-lg hover:bg-fire-700 transition text-center font-semibold"
                >
                  + Ajouter un produit
                </Link>
                <Link
                  href="/admin/orders"
                  className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-center font-semibold"
                >
                  Gérer les commandes ({stats.pendingOrders})
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-wood-900 mb-4">Résumé</h3>
              <div className="space-y-3 text-sm text-wood-700">
                <p>
                  <strong>En attente:</strong> <span className="text-yellow-600 font-bold">{stats.pendingOrders} commandes</span>
                </p>
                <p>
                  <strong>Produits:</strong> <span className="text-blue-600 font-bold">{stats.totalProducts}</span>
                </p>
                <p>
                  <strong>Chiffre d'affaires:</strong> <span className="text-purple-600 font-bold">{stats.totalRevenue.toLocaleString()}₽</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
