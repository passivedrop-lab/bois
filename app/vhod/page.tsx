'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Loader, Mail, CheckCircle, Lock, KeyRound, Eye, EyeOff } from 'lucide-react'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loginMethod, setLoginMethod] = useState<'password' | 'code'>('password') // New choice

  // Form States
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')

  // Code Verification State
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [otpCode, setOtpCode] = useState('')

  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  // 1. Handle Registration (Sign Up with Password -> Expect Code)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`.trim(),
            phone: phone,
            city: city,
          },
          // IMPORTANT: To force code validation, we rely on Supabase sending a confirmation email.
          // If the project is set to default (Link), the user will receive a link.
          // If the user wants a CODE, they must change the Supabase Template to use {{ .Token }} instead of {{ .ConfirmationURL }}
          // We will show the Code Input screen regardless, hoping they get a code.
        },
      })

      if (error) throw error

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast.error('Этот email уже используется.')
      } else {
        toast.success('Аккаунт создан! Пожалуйста, проверьте email для получения кода.')
        setShowCodeInput(true) // Move to code entry
      }
    } catch (error: any) {
      console.error('Registration Error:', error)
      toast.error(error?.message || ('Ошибка при регистрации: ' + JSON.stringify(error)))
    } finally {
      setLoading(false)
    }
  }

  // 2. Handle Login (Password or Code)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (loginMethod === 'password') {
        // Login with Password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/profile')
        router.refresh()
      } else {
        // Login with Code (Magic Link/Code)
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            // If we want to support clicking a link too, we can leave this.
            // But if we want *Code* entry manual:
            shouldCreateUser: false,
          }
        })
        if (error) throw error
        setLoading(false)
        setShowCodeInput(true) // Show input to enter the code they just received
        toast.success('Код отправлен на email!')
        return // Don't stop loading yet? No, we need to let them enter code.
      }
    } catch (error: any) {
      console.error('Login Error:', error)
      toast.error(error?.message || ('Ошибка при входе: ' + JSON.stringify(error)))
      setLoading(false)
    }
  }

  // 3. Verify Code (For Registration Confirmation OR Login with Code)
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Determine type: if we came from Register, it's 'signup'. If Login, it's 'magiclink' or 'email'.
      // Note: 'signup' type verifies the email confirmation token. 'magiclink'/'email' logs in.
      const type = mode === 'register' ? 'signup' : 'email'

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: type as any,
      })

      if (error) throw error

      toast.success('Проверка успешна!')
      router.push('/profile')
      router.refresh()
    } catch (error: any) {
      console.error('Verification Error:', error)
      toast.error(error?.message || ('Ошибка проверки: ' + JSON.stringify(error)))
    } finally {
      setLoading(false)
    }
  }

  // --- RENDER ---

  // Screen: Enter Code
  if (showCodeInput) {
    return (
      <div className="min-h-screen bg-wood-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <KeyRound className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-wood-900 mb-4">Введите код</h2>
          <p className="text-wood-600 mb-6">
            Мы отправили код из 6 цифр на <strong>{email}</strong>.
          </p>

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="123456"
              className="w-full text-center text-2xl tracking-widest px-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-fire-600 text-white py-3 rounded-lg hover:bg-fire-700 transition font-semibold"
            >
              {loading ? <Loader className="animate-spin mx-auto" /> : 'Проверить'}
            </button>
          </form>

          <button
            onClick={() => setShowCodeInput(false)}
            className="mt-6 text-sm text-wood-500 hover:text-wood-700 underline"
          >
            Назад
          </button>
        </div>
      </div>
    )
  }

  // Screen: Main Form
  return (
    <div className="min-h-screen bg-gradient-to-b from-wood-50 to-white py-12 sm:py-16 md:py-20 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-wood-100">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-fire-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-fire-600" />
            </div>
            <h1 className="text-2xl font-bold text-wood-900 mb-2">
              {mode === 'login' ? 'Вход' : 'Создать аккаунт'}
            </h1>
            <p className="text-wood-600 text-sm">
              Tsarstvo Dereva - Личный кабинет
            </p>
          </div>

          {/* Mode Toggle (Login vs Register) */}
          <div className="flex bg-wood-100 p-1 rounded-lg mb-8">
            <button
              onClick={() => { setMode('login'); setShowCodeInput(false); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'login'
                ? 'bg-white text-wood-900 shadow-sm'
                : 'text-wood-600 hover:text-wood-900'
                }`}
            >
              Вход
            </button>
            <button
              onClick={() => { setMode('register'); setShowCodeInput(false); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'register'
                ? 'bg-white text-wood-900 shadow-sm'
                : 'text-wood-600 hover:text-wood-900'
                }`}
            >
              Регистрация
            </button>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Login Method Tabs */}
              <div className="flex gap-4 mb-4 text-sm border-b border-wood-100 pb-2">
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`pb-1 px-2 ${loginMethod === 'password' ? 'text-fire-600 border-b-2 border-fire-600 font-semibold' : 'text-wood-500'}`}
                >
                  Пароль
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('code')}
                  className={`pb-1 px-2 ${loginMethod === 'code' ? 'text-fire-600 border-b-2 border-fire-600 font-semibold' : 'text-wood-500'}`}
                >
                  Уникальный код
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-wood-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600 transition"
                />
              </div>

              {loginMethod === 'password' && (
                <div>
                  <label className="block text-sm font-medium text-wood-700 mb-1">Пароль</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600 transition pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-500 hover:text-wood-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-fire-600 text-white py-3 rounded-lg hover:bg-fire-700 transition font-semibold flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="animate-spin" /> : (loginMethod === 'password' ? 'Войти' : 'Получить код')}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-wood-700 mb-1">Имя</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-wood-700 mb-1">Фамилия</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-wood-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-wood-700 mb-1">Телефон</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+7 (999) 000-00-00"
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-wood-700 mb-1">Город</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="Москва"
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-wood-700 mb-1">Пароль</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-500 hover:text-wood-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-wood-500 mt-1">Минимум 6 символов</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-fire-600 text-white py-3 rounded-lg hover:bg-fire-700 transition font-semibold flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="animate-spin" /> : 'Создать аккаунт'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-wood-500">
            Продолжая, вы принимаете наши Условия использования и Политику конфиденциальности.
          </div>
        </div>
      </div>
    </div>
  )
}
