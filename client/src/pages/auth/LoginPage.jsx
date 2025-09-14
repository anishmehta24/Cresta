import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from '../../services/toastBus'
import { useAuth } from '../../context/AuthContext'
import FormInput from '../../components/ui/FormInput'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const nextPath = searchParams.get('next') || sessionStorage.getItem('postLoginRedirect') || '/'
  const reason = searchParams.get('reason')

  useEffect(() => {
    if (reason === 'auth') {
      toast.info('Please sign in to continue')
    }
  }, [reason])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login({
        email: formData.email,
        password: formData.password
      })

      if (nextPath && nextPath !== '/') {
        sessionStorage.removeItem('postLoginRedirect')
        navigate(nextPath)
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-xl">C</div>
            <span className="text-2xl font-semibold tracking-tight text-gray-900">Cresta</span>
          </Link>
          <h1 className="mt-6 text-xl font-semibold tracking-tight text-gray-900">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-500">Or <Link to="/register" className="underline underline-offset-4 hover:text-gray-900">create a new account</Link></p>
        </div>
        <div className="card p-6">
          {error && <div className="mb-4 text-xs font-medium text-red-600 text-center bg-red-50 border border-red-200 rounded px-2 py-1">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="you@example.com" />
            <FormInput label="Password" name="password" type="password" value={formData.password} onChange={handleInputChange} required placeholder="••••••••" />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 select-none text-xs text-gray-600">
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                Remember me
              </label>
              <a href="#" className="text-xs font-medium text-gray-600 hover:text-gray-900">Forgot password?</a>
            </div>
            <button type="submit" disabled={isLoading} className="btn w-full disabled:opacity-50">
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
