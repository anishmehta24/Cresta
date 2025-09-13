import axios from 'axios'
import { toast } from './toastBus'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname + window.location.search
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Avoid duplicate redirects if already on login
      if (!window.location.pathname.startsWith('/login')) {
        sessionStorage.setItem('postLoginRedirect', currentPath)
        toast.error('Please log in to continue', { duration: 3500 })
        setTimeout(() => {
          const url = new URL(window.location.origin + '/login')
          url.searchParams.set('next', currentPath)
          url.searchParams.set('reason', 'auth')
          window.location.href = url.toString()
        }, 600)
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
