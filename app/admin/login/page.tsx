'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Pour la démo, on utilise des credentials simples
      // En production, cela devrait être connecté à Supabase ou un service d'auth
      if (email === 'admin@tsarstvadereva.ru' && password === 'TsarstvoDereva2025') {
        // Stocker dans localStorage (en production, utiliser des cookies sécurisés)
        localStorage.setItem('adminToken', 'verified')
        localStorage.setItem('adminEmail', email)
        router.push('/admin')
      } else {
        setError('Email ou mot de passe incorrect')
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
          Admin TsarstvoDereva
        </h1>
        <p className="text-center text-wood-600 mb-8">
          Connectez-vous pour accéder au dashboard administrateur
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-wood-900 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-wood-300 rounded-lg focus:outline-none focus:border-fire-600 focus:ring-2 focus:ring-fire-200"
              placeholder="admin@tsarstvadereva.ru"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-wood-900 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-wood-300 rounded-lg focus:outline-none focus:border-fire-600 focus:ring-2 focus:ring-fire-200"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-fire-600 text-white py-2 px-4 rounded-lg hover:bg-fire-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-900">
            <strong>Accès démo:</strong><br />
            Email: admin@tsarstvadereva.ru<br />
            Mot de passe: TsarstvoDereva2025
          </p>
        </div>
      </div>
    </div>
  )
}
