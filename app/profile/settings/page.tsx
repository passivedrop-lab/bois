'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, Save, Loader } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user } = useAuth()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: ''
  })

  useEffect(() => {
    if (user) {
      const loadProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data) {
          setFormData({
            fullName: data.full_name || '',
            phone: data.phone || '',
            city: data.city || ''
          })
        }
        setLoading(false)
      }
      loadProfile()
    }
  }, [user, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          city: formData.city,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Профиль успешно обновлен')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Ошибка при обновлении профиля')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-wood-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-fire-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-fire-600 hover:text-fire-700 mb-6"
        >
          <ArrowLeft size={18} />
          Назад к профилю
        </Link>

        <h1 className="text-4xl font-bold text-wood-900 mb-2">Настройки</h1>
        <p className="text-wood-600 mb-8">Редактирование личных данных</p>

        <div className="max-w-2xl">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-wood-900 mb-6 flex items-center gap-2">
              <User className="text-fire-600" size={24} />
              Личные данные
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-wood-900 mb-2">Имя и Фамилия</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  placeholder="Иван Петров"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-wood-900 mb-2">Телефон</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  placeholder="+7 (81754) 0-00-00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-wood-900 mb-2">Город</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  placeholder="Никольск"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-fire-600 text-white px-6 py-2 rounded-lg hover:bg-fire-700 transition font-semibold disabled:opacity-70"
                >
                  {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
