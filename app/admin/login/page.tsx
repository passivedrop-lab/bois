'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader, KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

export default function AdminLoginPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Vérification du code secret
      if (code === '0987654321BOISRUSSES') {
        // Définir le cookie d'accès
        Cookies.set('admin_secret_access', 'true', { expires: 1 }) // Expire dans 1 jour

        toast.success('Доступ разрешен!')
        router.push('/admin')
        router.refresh()
      } else {
        throw new Error('Неверный код')
      }
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Доступ запрещен')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-900 to-black flex items-center justify-center px-4">
      <div className="bg-white/95 backdrop-blur rounded-xl shadow-2xl p-8 w-full max-w-md border border-wood-800">
        <div className="flex justify-center mb-6">
          <div className="bg-fire-600 text-white p-4 rounded-full shadow-lg">
            <Lock size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-wood-900 mb-2">
          Админ-панель
        </h1>
        <p className="text-center text-wood-600 mb-8">
          Доступ только для администраторов
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-wood-900 mb-2">
              Секретный код
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 text-wood-500" size={20} />
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-wood-300 rounded-lg focus:outline-none focus:border-fire-600 focus:ring-2 focus:ring-fire-200"
                placeholder="••••••••••••••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !code}
            className="w-full bg-fire-600 text-white py-3 px-4 rounded-lg hover:bg-fire-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {loading ? <Loader size={18} className="animate-spin" /> : 'Войти в систему'}
          </button>
        </form>
      </div>
    </div>
  )
}
