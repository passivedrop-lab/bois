'use client'

import { useState } from 'react'
import { Mail, Loader } from 'lucide-react'

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'otp' | 'register'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Step 1: Envoyer OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erreur lors de l\'envoi du code')
        setLoading(false)
        return
      }

      setSuccess('Code OTP envoyé à votre email!')
      setStep('otp')
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Vérifier OTP et se connecter ou s'inscrire
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.needsRegistration) {
          // L'utilisateur n'existe pas, aller à l'inscription
          setStep('register')
          setError('')
          setSuccess('Code vérifié! Complétez votre profil.')
        } else {
          setError(data.error || 'Code invalide')
        }
        setLoading(false)
        return
      }

      // Utilisateur existant - connexion réussie
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('userEmail', email)
      window.location.href = '/profile/orders'
    } catch (err) {
      setError('Erreur lors de la vérification')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Compléter l'inscription
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          fullName,
          phone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erreur lors de l\'inscription')
        setLoading(false)
        return
      }

      // Inscription réussie
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('userEmail', email)
      window.location.href = '/profile/orders'
    } catch (err) {
      setError('Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep('email')
    setOtp('')
    setError('')
    setSuccess('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-wood-50 to-white py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <Mail className="w-12 h-12 mx-auto text-fire-600 mb-4" />
            <h1 className="text-2xl font-bold text-wood-900">
              {step === 'email' && 'Connexion / Inscription'}
              {step === 'otp' && 'Vérification du code'}
              {step === 'register' && 'Complétez votre profil'}
            </h1>
            <p className="text-wood-600 mt-2 text-sm">
              {step === 'email' && 'Entrez votre email pour continuer'}
              {step === 'otp' && 'Entrez le code reçu par email'}
              {step === 'register' && 'Complétez vos informations personnelles'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* STEP 1: EMAIL */}
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-wood-900 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600 focus:ring-2 focus:ring-fire-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-fire-600 text-white py-3 rounded-lg hover:bg-fire-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Envoyer un code
              </button>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <p className="text-sm text-wood-600 mb-4">
                  Un code à 6 chiffres a été envoyé à <strong>{email}</strong>
                </p>
                <label className="block text-sm font-medium text-wood-900 mb-2">
                  Code de vérification *
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  className="w-full px-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600 focus:ring-2 focus:ring-fire-100 text-center text-2xl tracking-widest"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-fire-600 text-white py-3 rounded-lg hover:bg-fire-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Vérifier le code
              </button>

              <button
                type="button"
                onClick={handleBackToEmail}
                className="w-full border border-wood-300 text-wood-700 py-2 rounded-lg hover:bg-wood-50 transition font-medium"
              >
                ← Retour
              </button>

              <p className="text-center text-xs text-wood-500">
                Pas reçu de code? <button className="text-fire-600 hover:text-fire-700 font-semibold">Renvoyer</button>
              </p>
            </form>
          )}

          {/* STEP 3: REGISTER */}
          {step === 'register' && (
            <form onSubmit={handleCompleteRegistration} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-wood-900 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600 focus:ring-2 focus:ring-fire-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-wood-900 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600 focus:ring-2 focus:ring-fire-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-fire-600 text-white py-3 rounded-lg hover:bg-fire-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Créer mon compte
              </button>

              <button
                type="button"
                onClick={handleBackToEmail}
                className="w-full border border-wood-300 text-wood-700 py-2 rounded-lg hover:bg-wood-50 transition font-medium"
              >
                ← Retour
              </button>
            </form>
          )}
        </div>

        {/* Info box */}
        <div className="max-w-md mx-auto mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Test:</strong> Email de test: test@example.com | Code: 123456
          </p>
        </div>
      </div>
    </div>
  )
}
