'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, ShoppingBag, Heart, Settings, LogOut, Loader, Crown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

interface Profile {
  id: string
  full_name: string
  email: string
  phone: string | null
  city: string | null
  role: string
}

export default function ProfilePage() {
  const { user, signOut, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (!error && data) {
            setProfile(data)
          } else {
            // Fallback if profile doesn't exist (should match trigger)
            setProfile({
              id: user.id,
              full_name: user.user_metadata.full_name || 'Пользователь',
              email: user.email!,
              phone: null,
              city: null,
              role: 'user'
            })
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchProfile()
    }
  }, [user, authLoading, router, supabase])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-wood-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-fire-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Мой Профиль</h1>
        <p className="text-wood-600 mb-12">Управляйте вашим аккаунтом и заказами</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profil Info */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-wood-900 mb-6 flex items-center gap-2">
              <User className="text-fire-600" />
              Личная информация
              {profile?.role === 'admin' && (
                <Link href="/admin" className="ml-auto flex items-center gap-1 text-xs bg-wood-900 text-white px-2 py-1 rounded">
                  <Crown size={12} />
                  Admin Panel
                </Link>
              )}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-wood-600">Имя</label>
                <p className="text-lg text-wood-900">{profile?.full_name || 'Не указано'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-wood-600">Email</label>
                <p className="text-lg text-wood-900">{profile?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-wood-600">Телефон</label>
                <p className="text-lg text-wood-900">{profile?.phone || 'Не указано'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-wood-600">Город</label>
                <p className="text-lg text-wood-900">{profile?.city || 'Не указано'}</p>
              </div>
            </div>
          </div>

          {/* Menu Lateral */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h3 className="text-xl font-bold text-wood-900 mb-4">Меню</h3>
            <nav className="space-y-2">
              <Link
                href="/profile/orders"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-wood-100 transition text-wood-700"
              >
                <ShoppingBag size={18} />
                <span>Мои Заказы</span>
              </Link>
              <Link
                href="/favorites"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-wood-100 transition text-wood-700"
              >
                <Heart size={18} />
                <span>Избранное</span>
              </Link>
              <Link
                href="/profile/settings"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-wood-100 transition text-wood-700"
              >
                <Settings size={18} />
                <span>Настройки</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-red-100 transition text-red-600 font-semibold"
              >
                <LogOut size={18} />
                <span>Выход</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
