'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock, Loader, Mail, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback?next=/admin`,
        },
      })

      if (error) throw error

      setSuccess(true)
      toast.success('Lien de connexion envoyé !')
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-wood-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-wood-900 mb-4">Vérifiez vos emails</h2>
          <p className="text-wood-600 mb-8">
            Un lien de connexion magique a été envoyé à <strong>{email}</strong>.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="text-fire-600 hover:text-fire-700 font-medium"
          >
            Retour
          </button>
        </div>
      </div>
    )
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
          Admin Portal
        </h1>
        <p className="text-center text-wood-600 mb-8">
          Accès réservé aux administrateurs
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-wood-900 mb-2">
              Email administrateur
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-wood-500" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-wood-300 rounded-lg focus:outline-none focus:border-fire-600 focus:ring-2 focus:ring-fire-200"
                placeholder="admin@tsarstvodereva.ru"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-fire-600 text-white py-3 px-4 rounded-lg hover:bg-fire-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {loading ? <Loader size={18} className="animate-spin" /> : 'Recevoir le lien magique'}
          </button>
        </form>
      </div>
    </div>
  )
}
