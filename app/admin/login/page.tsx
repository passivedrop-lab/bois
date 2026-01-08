'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader } from 'lucide-react'

const ADMIN_CODE = '0987654321RUSSEBOISE'

export default function AdminLoginPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (code === ADMIN_CODE) {
        // Stocker dans localStorage (en production, utiliser des cookies sécurisés)
        localStorage.setItem('adminToken', 'verified')
        localStorage.setItem('adminCode', code)
        router.push('/admin')
      } else {
        setError('❌ Code d\'accès incorrect')
        setCode('')
      }
    } catch (err) {
      setError('Erreur lors de la connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-900 to-fire-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-fire-600 text-white p-4 rounded-full">
            <Lock size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-wood-900 mb-2">
          🔐 Admin TsarstvoDereva
        </h1>
        <p className="text-center text-wood-600 mb-8">
          Entrez le code d'accès administrateur
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-wood-900 mb-2">
              Code d'accès
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 border border-wood-300 rounded-lg focus:outline-none focus:border-fire-600 focus:ring-2 focus:ring-fire-200 text-lg tracking-widest"
                placeholder="••••••••••••••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-wood-600 hover:text-wood-900"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full bg-fire-600 text-white py-3 px-4 rounded-lg hover:bg-fire-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader size={18} className="animate-spin" />}
            {loading ? 'Vérification...' : 'Accéder au Dashboard'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-900">
            <strong>⚠️ Sécurité:</strong><br />
            Ce code est confidentiel et unique. Ne le partager avec personne.
          </p>
        </div>
      </div>
    </div>
  )
}
