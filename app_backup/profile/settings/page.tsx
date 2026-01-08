'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: '',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.email) {
      toast.error('Пользователь не авторизован')
      return
    }
    
    setLoading(true)

    try {
      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: emailForm.password,
      })

      if (signInError) throw new Error('Неверный пароль')

      // Update email
      const { error: updateError } = await supabase.auth.updateUser({
        email: emailForm.newEmail,
      })

      if (updateError) throw updateError

      toast.success('Проверьте новую почту для подтверждения')
      setEmailForm({ newEmail: '', password: '' })
    } catch (error: any) {
      toast.error(error.message || 'Ошибка изменения email')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.email) {
      toast.error('Пользователь не авторизован')
      return
    }
    
    setLoading(true)

    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('Пароли не совпадают')
      }

      if (passwordForm.newPassword.length < 6) {
        throw new Error('Пароль должен быть не менее 6 символов')
      }

      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordForm.currentPassword,
      })

      if (signInError) throw new Error('Неверный текущий пароль')

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      })

      if (updateError) throw updateError

      toast.success('Пароль успешно изменен')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      toast.error(error.message || 'Ошибка изменения пароля')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-white to-wood-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-wood-900 mb-8">
            Настройки безопасности
          </h1>

          <div className="space-y-6">
            {/* Email Change */}
            <div className="card-premium p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-fire-100 rounded-lg">
                  <Mail className="text-fire-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-wood-900">Изменить email</h2>
                  <p className="text-wood-600">Текущий email: {user?.email}</p>
                </div>
              </div>

              <form onSubmit={handleEmailChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-wood-700 mb-2">
                    Новый email
                  </label>
                  <input
                    type="email"
                    value={emailForm.newEmail}
                    onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                    required
                    className="input-elegant"
                    placeholder="new@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-wood-700 mb-2">
                    Текущий пароль
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={emailForm.password}
                      onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                      required
                      className="input-elegant pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-wood-400"
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Сохранение...' : 'Изменить email'}
                </button>
              </form>
            </div>

            {/* Password Change */}
            <div className="card-premium p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-fire-100 rounded-lg">
                  <Lock className="text-fire-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-wood-900">Изменить пароль</h2>
                  <p className="text-wood-600">Используйте надежный пароль</p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-wood-700 mb-2">
                    Текущий пароль
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      required
                      className="input-elegant pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-wood-400"
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-wood-700 mb-2">
                    Новый пароль
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      required
                      minLength={6}
                      className="input-elegant pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-wood-400"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-wood-700 mb-2">
                    Подтвердите новый пароль
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      required
                      minLength={6}
                      className="input-elegant pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-wood-400"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {passwordForm.newPassword &&
                    passwordForm.confirmPassword &&
                    passwordForm.newPassword === passwordForm.confirmPassword && (
                      <div className="flex items-center gap-2 mt-2 text-green-600 text-sm">
                        <CheckCircle size={16} />
                        Пароли совпадают
                      </div>
                    )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Сохранение...' : 'Изменить пароль'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
