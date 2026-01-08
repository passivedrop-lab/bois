'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (error) {
          console.error('Login error:', error)
          throw error
        }

        if (data?.user) {
          toast.success('Добро пожаловать!')
          const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/'
          router.push(redirectUrl)
          router.refresh()
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            },
            emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
          },
        })

        if (error) {
          console.error('Signup error:', error)
          throw error
        }

        if (data?.user) {
          // Check if email confirmation is required
          if (data.user.email_confirmed_at) {
            toast.success('Регистрация успешна! Добро пожаловать!')
            router.push('/')
            router.refresh()
          } else {
            toast.success('Регистрация успешна! Проверьте вашу почту для подтверждения.')
            setIsLogin(true)
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-white to-fire-50 py-20 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="card-premium p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-2xl mb-4">
                <span className="text-2xl font-bold text-white">ДП</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-2">
                {isLogin ? 'Добро пожаловать' : 'Создать аккаунт'}
              </h1>
              <p className="text-wood-600">
                {isLogin
                  ? 'Войдите в свой аккаунт'
                  : 'Зарегистрируйтесь для начала'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-wood-700 mb-2">
                    Имя
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-wood-400" size={20} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required={!isLogin}
                      className="input-elegant pl-12"
                      placeholder="Ваше имя"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-wood-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-wood-400" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="input-elegant pl-12"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-wood-700 mb-2">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-wood-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="input-elegant pl-12 pr-12"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-wood-400 hover:text-wood-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded" />
                    <span className="text-sm text-wood-600">Запомнить меня</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-fire-600 hover:text-fire-700 font-medium">
                    Забыли пароль?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setFormData({ name: '', email: '', password: '' })
                }}
                className="text-wood-600 hover:text-fire-600 transition font-medium"
              >
                {isLogin
                  ? 'Нет аккаунта? Зарегистрируйтесь'
                  : 'Уже есть аккаунт? Войдите'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
