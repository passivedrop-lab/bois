'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Phone, MapPin, Package, Heart, Settings } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface ProfileData {
  full_name: string | null
  phone: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  country: string | null
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: null,
    phone: null,
    address: null,
    city: null,
    postal_code: null,
    country: null,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadProfile = useCallback(async () => {
    if (!user?.id) return
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setProfileData(data)
      } else {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
          })

        if (insertError) throw insertError
      }
    } catch (error: any) {
      toast.error('Ошибка загрузки профиля')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadProfile()
    }
  }, [user, authLoading, router, loadProfile])

  const handleSave = async () => {
    if (!user?.id) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email || '',
          ...profileData,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      toast.success('Профиль обновлен!')
    } catch (error: any) {
      toast.error('Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-wood-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fire-600 mx-auto"></div>
          <p className="mt-4 text-wood-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-white to-wood-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-wood-900 mb-8">
            Мой профиль
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card-premium p-6 space-y-4">
                <div className="text-center pb-6 border-b border-wood-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <h2 className="font-semibold text-wood-900">{profileData.full_name || 'Пользователь'}</h2>
                  <p className="text-sm text-wood-600">{user.email}</p>
                </div>

                <nav className="space-y-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 bg-fire-50 text-fire-700 rounded-lg font-medium"
                  >
                    <User size={20} />
                    Личные данные
                  </Link>
                  <Link
                    href="/profile/orders"
                    className="flex items-center gap-3 px-4 py-3 text-wood-700 hover:bg-wood-50 rounded-lg transition"
                  >
                    <Package size={20} />
                    Мои заказы
                  </Link>
                  <Link
                    href="/profile/favorites"
                    className="flex items-center gap-3 px-4 py-3 text-wood-700 hover:bg-wood-50 rounded-lg transition"
                  >
                    <Heart size={20} />
                    Избранное
                  </Link>
                  <Link
                    href="/profile/settings"
                    className="flex items-center gap-3 px-4 py-3 text-wood-700 hover:bg-wood-50 rounded-lg transition"
                  >
                    <Settings size={20} />
                    Настройки
                  </Link>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="card-premium p-8">
                <h2 className="text-2xl font-semibold text-wood-900 mb-6">Личные данные</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-wood-700 mb-2">
                      <Mail size={16} className="inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="input-elegant bg-wood-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-wood-500 mt-1">
                      Изменить email можно в настройках безопасности
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-wood-700 mb-2">
                      Имя
                    </label>
                    <input
                      type="text"
                      value={profileData.full_name ?? ''}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value || null })}
                      className="input-elegant"
                      placeholder="Ваше имя"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-wood-700 mb-2">
                      <Phone size={16} className="inline mr-2" />
                      Телефон
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone ?? ''}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value || null })}
                      className="input-elegant"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-wood-700 mb-2">
                      <MapPin size={16} className="inline mr-2" />
                      Адрес
                    </label>
                    <input
                      type="text"
                      value={profileData.address ?? ''}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value || null })}
                      className="input-elegant"
                      placeholder="Улица, дом, квартира"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-wood-700 mb-2">
                        Город
                      </label>
                      <input
                        type="text"
                        value={profileData.city ?? ''}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value || null })}
                        className="input-elegant"
                        placeholder="Москва"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-wood-700 mb-2">
                        Индекс
                      </label>
                      <input
                        type="text"
                        value={profileData.postal_code ?? ''}
                        onChange={(e) => setProfileData({ ...profileData, postal_code: e.target.value || null })}
                        className="input-elegant"
                        placeholder="123456"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-wood-700 mb-2">
                      Страна
                    </label>
                    <input
                      type="text"
                      value={profileData.country ?? 'Россия'}
                      onChange={(e) => setProfileData({ ...profileData, country: e.target.value || null })}
                      className="input-elegant"
                    />
                  </div>

                  <div className="pt-4 border-t border-wood-200">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary disabled:opacity-50"
                    >
                      {saving ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
