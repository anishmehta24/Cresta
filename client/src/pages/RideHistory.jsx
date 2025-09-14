import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import bookingService from '../services/bookingService'
import authService from '../services/authService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

const RideHistory = () => {
  const [filter, setFilter] = useState('all') // all, completed, cancelled, upcoming
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true); setError(null)
      try {
        const user = authService.getCurrentUser()
        if (!user) {
          setError('Not authenticated'); return
        }
        const data = await bookingService.getUserRides(user._id || user.id)
        if (!mounted) return
        // Normalize mapping
        const mapped = (data || []).map(b => ({
          _raw: b,
          id: b._id,
          date: new Date(b.startTime).toISOString().split('T')[0],
            time: new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          pickup: b.pickupLocation?.address || 'N/A',
          dropoff: b.dropoffLocation?.address || 'N/A',
          driver: b.cars?.[0]?.driverId ? 'Assigned' : 'Unassigned',
          carType: b.cars?.length ? `${b.cars.length} Car(s)` : 'Pending',
          duration: b.endTime ? `${Math.max(1, Math.round((new Date(b.endTime)-new Date(b.startTime))/60000))} mins` : '—',
          distance: '—',
          fare: b.totalAmount || 0,
          status: (b.status || '').toLowerCase(),
          rating: null
        }))
        setRides(mapped)
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load rides')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const filteredRides = rides.filter(ride => {
    if (filter === 'all') return true
    return ride.status === filter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderRating = (rating) => {
    if (!rating) return null
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  const cancelRide = (rideId) => {
    if (window.confirm('Are you sure you want to cancel this ride?')) {
      console.log('Cancelling ride:', rideId)
      alert('Ride cancelled successfully. You will receive a confirmation email.')
    }
  }

  const rebookRide = (ride) => {
    console.log('Rebooking ride:', ride)
    alert('Redirecting to booking page with your previous details...')
  }

  if (filteredRides.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Rides</h1>
            <p className="text-gray-600">Track and manage your ride history</p>
          </div>
          
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No rides found</h2>
            <p className="text-gray-600 mb-8">
              {filter === 'all' 
                ? "You haven't booked any rides yet" 
                : `No ${filter} rides found`
              }
            </p>
            <Link
              to="/book-ride"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Book Your First Ride
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Rides</h1>
              <p className="text-gray-600">Track and manage your ride history</p>
            </div>
            <Link
              to="/book-ride"
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Book New Ride
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Rides', count: rides.length },
                { key: 'upcoming', label: 'Upcoming', count: rides.filter(r => r.status === 'upcoming').length },
                { key: 'completed', label: 'Completed', count: rides.filter(r => r.status === 'completed').length },
                { key: 'cancelled', label: 'Cancelled', count: rides.filter(r => r.status === 'cancelled').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {loading && <div className="text-sm text-gray-500">Loading rides...</div>}
        {error && <div className="text-sm text-red-500">{error}</div>}

        {/* Ride List */}
        <div className="space-y-6">
          {filteredRides.map((ride) => (
            <div key={ride.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-gray-900">#{ride.id}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(ride.status)}`}>
                        {ride.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">${ride.fare.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">{ride.date} at {ride.time}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    {/* Route */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Route</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                          <div>
                            <div className="text-sm text-gray-600">Pickup</div>
                            <div className="font-medium text-gray-900">{ride.pickup}</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                          <div>
                            <div className="text-sm text-gray-600">Drop-off</div>
                            <div className="font-medium text-gray-900">{ride.dropoff}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Trip Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-600">Driver:</span><span className="font-medium text-gray-900">{ride.driver}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Cars:</span><span className="font-medium text-gray-900">{ride.carType}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Duration:</span><span className="font-medium text-gray-900">{ride.duration}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Distance:</span><span className="font-medium text-gray-900">{ride.distance}</span></div>
                        {ride.rating && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Rating:</span>
                            {renderRating(ride.rating)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cancel Reason */}
                  {ride.status === 'cancelled' && ride.cancelReason && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-sm">
                        <span className="font-medium text-red-800">Cancellation Reason: </span>
                        <span className="text-red-700">{ride.cancelReason}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {ride.status === 'upcoming' && (
                      <button
                        onClick={() => cancelRide(ride.id)}
                        className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      >
                        Cancel Ride
                      </button>
                    )}
                    
                    {(ride.status === 'completed' || ride.status === 'cancelled') && (
                      <button
                        onClick={() => rebookRide(ride)}
                        className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        Book Again
                      </button>
                    )}

                    {ride.status === 'completed' && (
                      <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        Download Receipt
                      </button>
                    )}

                    {ride.status === 'upcoming' && (
                      <button className="px-4 py-2 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors duration-200">
                        Track Ride
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center"><div className="text-3xl font-bold text-blue-600 mb-2">{rides.filter(r => r.status === 'completed').length}</div><div className="text-gray-600">Completed Rides</div></div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center"><div className="text-3xl font-bold text-green-600 mb-2">${rides.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.fare, 0).toFixed(2)}</div><div className="text-gray-600">Total Spent</div></div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center"><div className="text-3xl font-bold text-purple-600 mb-2">{(rides.filter(r => r.status === 'completed' && r.rating).reduce((sum, r) => sum + (r.rating || 0), 0) / (rides.filter(r => r.status === 'completed' && r.rating).length || 1)).toFixed(1)}</div><div className="text-gray-600">Average Rating</div></div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center"><div className="text-3xl font-bold text-orange-600 mb-2">{rides.filter(r => r.status === 'upcoming').length}</div><div className="text-gray-600">Upcoming Rides</div></div>
        </div>
      </div>
    </div>
  )
}

export default RideHistory