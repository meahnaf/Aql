import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../lib/api'
import { useLanguage } from '../contexts/LanguageContext'

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void
}

export default function Login({ setIsAuthenticated }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { language, t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const response = await authAPI.login({ email, password })
        localStorage.setItem('token', response.data.access_token)
        setIsAuthenticated(true)
        navigate('/dashboard')
      } else {
        await authAPI.register({ email, password, full_name: fullName })
        setIsLogin(true)
        setError('Registration successful! Please login.')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">{t('appName')}</h1>
          <p className="text-gray-600">
            {language === 'ar' 
              ? 'مساعد المعرفة الذكي للمؤسسات' 
              : 'Enterprise AI Knowledge Assistant'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fullName')}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className={`p-3 rounded-md ${error.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('loading') : isLogin ? t('login') : t('register')}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {isLogin 
                ? (language === 'ar' ? 'ليس لديك حساب؟ سجل الآن' : "Don't have an account? Register")
                : (language === 'ar' ? 'لديك حساب؟ سجل الدخول' : 'Already have an account? Login')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
