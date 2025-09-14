import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import bookingService from '../services/bookingService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!user) return
      setLoading(true); setError(null)
      try {
        const data = await bookingService.getUserProfile(user._id || user.id)
        if (mounted) setMetrics(data)
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load profile metrics')
      } finally { if (mounted) setLoading(false) }
    }
    load()
    return () => { mounted = false }
  }, [user])

  const handleLogout = () => {
    logout()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-lg mb-6 border border-gray-700">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {user.fullname?.firstname?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {user.fullname?.firstname} {user.fullname?.lastname}
                  </h1>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Personal Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={user.fullname?.firstname || ''}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      } focus:outline-none`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={user.fullname?.lastname || ''}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md text-white ${
                        isEditing 
                          ? 'border-gray-600 bg-gray-700 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-600 bg-gray-700'
                      } focus:outline-none`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md text-white ${
                        isEditing 
                          ? 'border-gray-600 bg-gray-700 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-600 bg-gray-700'
                      } focus:outline-none`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={user.phone || ''}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md text-white ${
                        isEditing 
                          ? 'border-gray-600 bg-gray-700 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-600 bg-gray-700'
                      } focus:outline-none`}
                    />
                  </div>
                </div>
                {isEditing && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Account Summary</h2>
              </div>
              <div className="px-6 py-4 space-y-4">
                {loading && <LoadingSpinner size={20} />}
                <ErrorMessage message={error} />
                {!loading && !error && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Total Rides</span>
                      <span className="text-sm font-medium text-white">{metrics?.totalRides ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Total Rentals</span>
                      <span className="text-sm font-medium text-white">{metrics?.totalRentals ?? 0}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Member Since</span>
                  <span className="text-sm font-medium text-white">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md">
                  View Ride History
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md">
                  View Rental History
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md">
                  Payment Methods
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
