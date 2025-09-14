import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import bookingService from '../services/bookingService'
import authService from '../services/authService'
import ErrorMessage from '../components/common/ErrorMessage'
import Tabs from '../components/ui/Tabs'
import StatusBadge from '../components/ui/StatusBadge'
import { formatINR } from '../services/currency'
import EmptyState from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'

const RideHistory = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
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

  const filteredRides = rides.filter(r => filter === 'all' ? true : r.status === filter)
  const tabs = [
    { key: 'all', label: 'All Rides', count: rides.length },
    { key: 'upcoming', label: 'Upcoming', count: rides.filter(r => r.status === 'upcoming').length },
    { key: 'completed', label: 'Completed', count: rides.filter(r => r.status === 'completed').length },
    { key: 'cancelled', label: 'Cancelled', count: rides.filter(r => r.status === 'cancelled').length },
  ]

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

  const cancelRide = async (rideId) => {
    if (!window.confirm('Cancel this ride?')) return
    try {
      await bookingService.cancelRide(rideId)
      setRides(prev => prev.map(r => r.id === rideId ? { ...r, status: 'cancelled' } : r))
    } catch (e) {
      alert(e.message || 'Failed to cancel ride')
    }
  }

  const rebookRide = (ride) => {
    const raw = ride._raw
    if (!raw) return navigate('/book-ride')
    try {
      const start = raw.startTime ? new Date(raw.startTime) : null
      const pickupDate = start ? start.toISOString().split('T')[0] : ''
      const pickupTime = start ? start.toISOString().split('T')[1].slice(0,5) : ''
      const firstCarId = raw.cars && raw.cars[0] && (raw.cars[0].carId?._id || raw.cars[0].carId?.id)
      navigate('/book-ride', {
        state: {
          rebook: true,
            pickupLocation: ride.pickup,
            dropoffLocation: ride.dropoff,
            pickupDate,
            pickupTime,
            selectedCar: firstCarId || ''
        }
      })
    } catch {
      navigate('/book-ride')
    }
  }

  const empty = filteredRides.length === 0

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">My Rides</h1>
          <p className="text-sm text-gray-500">Track and manage all rides.</p>
        </div>
        <Link to="/book-ride" className="btn btn-primary text-sm font-semibold">Book Ride</Link>
      </div>
      <Tabs tabs={tabs} initial={filter} onChange={setFilter} />
      <ErrorMessage message={error} />
      {loading && (
        <div className="mt-8 space-y-4">{Array.from({length:3}).map((_,i)=>(<Skeleton key={i} className="h-40 rounded-xl" />))}</div>
      )}
      {empty && !loading && (
        <div className="mt-12"><EmptyState title={filter==='all' ? 'No rides yet' : 'Nothing here'} message="Your ride bookings will appear here once created." action={<Link to="/book-ride" className="btn btn-primary">Book First Ride</Link>} /></div>
      )}
      {!empty && (
        <div className="mt-8 space-y-6">
          {filteredRides.map((ride) => (
            <div key={ride.id} className="bg-white rounded-xl shadow-token p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-base font-semibold text-gray-900 tracking-tight">#{ride.id}</span>
                      <StatusBadge status={ride.status} />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{formatINR(ride.fare)}</div>
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
                  <div className="flex flex-wrap gap-3 mt-4">
                    {ride.status === 'upcoming' && (
                      <button
                        onClick={() => cancelRide(ride.id)}
                        className="px-3 py-2 text-xs font-medium rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Cancel Ride
                      </button>
                    )}
                    
                    {(ride.status === 'completed' || ride.status === 'cancelled') && (
                      <button onClick={() => rebookRide(ride)} className="px-3 py-2 text-xs font-medium rounded-md border border-blue-300 text-blue-600 hover:bg-blue-50">Book Again</button>
                    )}

                    {ride.status === 'completed' && (
                      <button className="px-3 py-2 text-xs font-medium rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">Receipt</button>
                    )}

                    {ride.status === 'upcoming' && (
                      <button className="px-3 py-2 text-xs font-medium rounded-md border border-green-300 text-green-600 hover:bg-green-50">Track</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!empty && (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="stat-card text-center"><div className="text-2xl font-semibold mb-1 text-blue-600">{rides.filter(r => r.status === 'completed').length}</div><p className="text-xs tracking-wide uppercase text-gray-500">Completed</p></div>
          <div className="stat-card text-center"><div className="text-2xl font-semibold mb-1 text-green-600">{formatINR(rides.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.fare, 0))}</div><p className="text-xs tracking-wide uppercase text-gray-500">Total Spent</p></div>
          <div className="stat-card text-center"><div className="text-2xl font-semibold mb-1 text-purple-600">{(rides.filter(r => r.status === 'completed' && r.rating).reduce((sum, r) => sum + (r.rating || 0), 0) / (rides.filter(r => r.status === 'completed' && r.rating).length || 1)).toFixed(1)}</div><p className="text-xs tracking-wide uppercase text-gray-500">Avg Rating</p></div>
          <div className="stat-card text-center"><div className="text-2xl font-semibold mb-1 text-orange-600">{rides.filter(r => r.status === 'upcoming').length}</div><p className="text-xs tracking-wide uppercase text-gray-500">Upcoming</p></div>
        </div>
      )}
    </div>
  )
}

export default RideHistory