'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Package, ShoppingCart, LogOut, Menu, X } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const email = localStorage.getItem('adminEmail')

    if (!token) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      setAdminEmail(email || '')
      setLoading(false)
    }
  }, [router])

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

  const stats = [
    {
      label: 'Commandes en attente',
      value: '3',
      icon: ShoppingCart,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Produits',
      value: '24',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Commandes totales',
      value: '142',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => {
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
                  Voir les commandes
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-wood-900 mb-4">Informations</h3>
              <div className="space-y-3 text-sm text-wood-700">
                <p>
                  <strong>Dernière mise à jour:</strong> À l'instant
                </p>
                <p>
                  <strong>Statut:</strong> <span className="text-green-600 font-semibold">En ligne</span>
                </p>
                <p>
                  <strong>Email admin:</strong> {adminEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
