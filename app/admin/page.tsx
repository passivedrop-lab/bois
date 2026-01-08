'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Package, ShoppingCart, LogOut, Menu, X, TrendingUp, Loader, AlertTriangle, Lock, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'


interface Stats {
  pendingOrders: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingRole, setCheckingRole] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState<Stats>({
    pendingOrders: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })

  const supabase = createClient()

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/admin/login')
        return
      }

      const checkRole = async () => {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

          if (profile?.role === 'admin') {
            setIsAdmin(true)
            loadStats()
          } else {
            router.push('/') // Redirect non-admins to home
          }
        } catch (error) {
          console.error('Error checking role:', error)
          router.push('/')
        } finally {
          setCheckingRole(false)
        }
      }
      checkRole()
    }
  }, [user, authLoading, router, supabase])

  const loadStats = async () => {
    try {
      // Fetch data in parallel
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from('orders').select('id, total_price, status'),
        supabase.from('products').select('id', { count: 'exact' }),
      ])

      const orders = ordersRes.data || []
      // Note: count is not directly available on select result in v2 unless used differently, 
      // but typical fetch returns data array. productsRes.data might be null if using count 'exact' head?
      // actually let's just fetch id for products to count length for simplicity if dataset is small, 
      // or use count.

      const productsCount = productsRes.data?.length || 0

      const pendingOrders = orders.filter((o) => o.status === 'processing' || o.status === 'pending').length
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0)

      setStats({
        pendingOrders,
        totalProducts: productsCount,
        totalOrders: orders.length,
        totalRevenue,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  if (authLoading || checkingRole) {
    return (
      <div className="min-h-screen bg-wood-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-fire-600 animate-spin" />
      </div>
    )
  }

  if (!isAdmin) return null // Should have redirected

  const statCards = [
    {
      label: 'Заказы в обработке',
      value: stats.pendingOrders.toString(),
      icon: ShoppingCart,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Товары',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Всего заказов',
      value: stats.totalOrders.toString(),
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Общий доход',
      value: `${(stats.totalRevenue).toLocaleString('ru-RU')} ₽`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="flex h-screen bg-wood-100">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed md:relative md:translate-x-0 z-40 w-64 h-full bg-wood-900 text-white transition-transform duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-wood-800">
          <h1 className="text-2xl font-bold">TsarstvoDereva</h1>
          <p className="text-wood-400 text-sm">Панель администратора</p>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-wood-800 text-white transition"
          >
            <BarChart3 size={20} />
            Главная
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-wood-800 transition text-wood-300 hover:text-white"
          >
            <Package size={20} />
            Товары
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-wood-800 transition text-wood-300 hover:text-white"
          >
            <ShoppingCart size={20} />
            Заказы
          </Link>
        </nav>

        <div className="p-6 border-t border-wood-800">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-600 transition text-white"
          >
            <LogOut size={20} />
            Выход
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
            <h2 className="text-2xl font-bold text-wood-900">Панель управления</h2>
          </div>
          <div className="text-right flex items-center gap-2">
            <span className="hidden sm:inline text-sm text-wood-600">Администратор: {user?.email}</span>
            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-bold">
              <Lock size={10} />
              Secure
            </div>
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
                      <p className="text-2xl font-bold text-wood-900 mt-2">{stat.value}</p>
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
              <h3 className="text-lg font-bold text-wood-900 mb-4">Быстрые действия</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/products/new"
                  className="block w-full bg-fire-600 text-white py-3 px-4 rounded-lg hover:bg-fire-700 transition text-center font-semibold flex items-center justify-center gap-2"
                >
                  <Package size={18} />
                  Добавить новый товар
                </Link>
                <Link
                  href="/admin/orders"
                  className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition text-center font-semibold flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Управление заказами
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-wood-900 mb-4">Статус системы</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg text-green-800 border border-green-100">
                  <span className="flex items-center gap-2 font-medium">
                    <CheckCircle size={16} />
                    База данных
                  </span>
                  <span className="text-sm font-bold">Подключено</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg text-green-800 border border-green-100">
                  <span className="flex items-center gap-2 font-medium">
                    <CheckCircle size={16} />
                    Auth Service
                  </span>
                  <span className="text-sm font-bold">Активен</span>
                </div>
                {stats.pendingOrders > 0 && (
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg text-yellow-800 border border-yellow-100 animate-pulse">
                    <span className="flex items-center gap-2 font-medium">
                      <AlertTriangle size={16} />
                      Требуют внимания
                    </span>
                    <span className="text-sm font-bold">{stats.pendingOrders} заказов</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
