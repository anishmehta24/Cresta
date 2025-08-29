import apiClient from './apiClient'

const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await apiClient.post('/users/register', userData)
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Registration failed'
      throw new Error(message)
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/users/login', credentials)
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Login failed'
      throw new Error(message)
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token')
    return !!token
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token')
  }
}

export default authService
