import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import bookingService from '../services/bookingService'
import authService from '../services/authService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

const RentalHistory = () => {
  const [filter, setFilter] = useState('all') // all, active, completed, cancelled, upcoming
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true); setError(null)
      try {
        const user = authService.getCurrentUser()
        if (!user) { setError('Not authenticated'); return }
        const data = await bookingService.getUserRentals(user._id || user.id)
        if (!mounted) return
        const mapped = (data || []).map(b => ({
          id: b._id,
          bookingDate: new Date(b.createdAt).toISOString().split('T')[0],
          startDate: new Date(b.startTime).toISOString().split('T')[0],
          endDate: b.endTime ? new Date(b.endTime).toISOString().split('T')[0] : '-',
          cars: (b.cars || []).map(c => ({ name: c.carId?.model || 'Car', category: (c.carId?.type || '').toLowerCase(), quantity: 1, pricePerDay: c.carId?.pricePerDay || 0, totalDays: b.endTime ? Math.max(1, Math.ceil((new Date(b.endTime)- new Date(b.startTime))/86400000)) : 1 })),
          totalAmount: b.totalAmount || 0,
          status: (b.status || '').toLowerCase(),
          pickupLocation: b.pickupLocation?.address || 'N/A',
          returnLocation: b.pickupLocation?.address || 'N/A',
          cancelReason: b.status === 'CANCELLED' ? 'Cancelled' : null
        }))
        setRentals(mapped)
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load rentals')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return ()=>{ mounted = false }
  }, [])

  const filteredRentals = rentals.filter(rental => {
    if (filter === 'all') return true
    return rental.status === filter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTotalCars = (cars) => {
    return cars.reduce((sum, car) => sum + car.quantity, 0)
  }

  const getDurationText = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`
  }

  const cancelRental = (rentalId) => {
    if (window.confirm('Are you sure you want to cancel this rental?')) {
      console.log('Cancelling rental:', rentalId)
      alert('Rental cancelled successfully. You will receive a confirmation email.')
    }
  }

  const extendRental = (rentalId) => {
    console.log('Extending rental:', rentalId)
    alert('Redirecting to extension page...')
  }

  const rebookRental = (rental) => {
    console.log('Rebooking rental:', rental)
    alert('Redirecting to car rental page with your previous selection...')
  }

  if (filteredRentals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Rentals</h1>
            <p className="text-gray-600">Track and manage your car rental history</p>
          </div>
          
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No rentals found</h2>
            <p className="text-gray-600 mb-8">
              {filter === 'all' 
                ? "You haven't rented any cars yet" 
                : `No ${filter} rentals found`
              }
            </p>
            <Link
              to="/rent-car"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Browse Cars
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Rentals</h1>
              <p className="text-gray-600">Track and manage your car rental history</p>
            </div>
            <Link
              to="/rent-car"
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Rental
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Rentals', count: rentals.length },
                { key: 'active', label: 'Active', count: rentals.filter(r => r.status === 'active').length },
                { key: 'upcoming', label: 'Upcoming', count: rentals.filter(r => r.status === 'upcoming').length },
                { key: 'completed', label: 'Completed', count: rentals.filter(r => r.status === 'completed').length },
                { key: 'cancelled', label: 'Cancelled', count: rentals.filter(r => r.status === 'cancelled').length }
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

  {loading && <LoadingSpinner className="my-4" />}
  <ErrorMessage message={error} />

        {/* Rental List */}
        <div className="space-y-6">
          {filteredRentals.map((rental) => (
            <div key={rental.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-gray-900">#{rental.id}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(rental.status)}`}>
                        {rental.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">${rental.totalAmount.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">
                        {getDurationText(rental.startDate, rental.endDate)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {/* Rental Period */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Rental Period</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Start Date:</span>
                          <span className="font-medium text-gray-900">{rental.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">End Date:</span>
                          <span className="font-medium text-gray-900">{rental.endDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium text-gray-900">
                            {getDurationText(rental.startDate, rental.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Locations */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Locations</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Pickup:</span>
                          <div className="font-medium text-gray-900">{rental.pickupLocation}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Return:</span>
                          <div className="font-medium text-gray-900">{rental.returnLocation}</div>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Cars:</span>
                          <span className="font-medium text-gray-900">{getTotalCars(rental.cars)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Booking Date:</span>
                          <span className="font-medium text-gray-900">{rental.bookingDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cars List */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Rented Vehicles</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-3">
                        {rental.cars.map((car, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                                </svg>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{car.name}</div>
                                <div className="text-sm text-gray-600 capitalize">
                                  {car.category} • Qty: {car.quantity}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">
                                ${car.pricePerDay}/day
                              </div>
                              <div className="text-sm text-gray-600">
                                {car.totalDays} days
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cancel Reason */}
                  {rental.status === 'cancelled' && rental.cancelReason && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-sm">
                        <span className="font-medium text-red-800">Cancellation Reason: </span>
                        <span className="text-red-700">{rental.cancelReason}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {rental.status === 'upcoming' && (
                      <>
                        <button
                          onClick={() => cancelRental(rental.id)}
                          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        >
                          Cancel Rental
                        </button>
                        <button className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                          Modify Booking
                        </button>
                      </>
                    )}
                    
                    {rental.status === 'active' && (
                      <>
                        <button
                          onClick={() => extendRental(rental.id)}
                          className="px-4 py-2 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors duration-200"
                        >
                          Extend Rental
                        </button>
                        <button className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                          Return Early
                        </button>
                      </>
                    )}

                    {(rental.status === 'completed' || rental.status === 'cancelled') && (
                      <button
                        onClick={() => rebookRental(rental)}
                        className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        Book Again
                      </button>
                    )}

                    {(rental.status === 'completed' || rental.status === 'active') && (
                      <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        Download Invoice
                      </button>
                    )}

                    <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center"><div className="text-3xl font-bold text-blue-600 mb-2">{rentals.filter(r => r.status === 'completed').length}</div><div className="text-gray-600">Completed Rentals</div></div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center"><div className="text-3xl font-bold text-green-600 mb-2">${rentals.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.totalAmount, 0).toFixed(2)}</div><div className="text-gray-600">Total Spent</div></div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center"><div className="text-3xl font-bold text-purple-600 mb-2">{rentals.reduce((sum, r) => sum + getTotalCars(r.cars), 0)}</div><div className="text-gray-600">Cars Rented</div></div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center"><div className="text-3xl font-bold text-orange-600 mb-2">{rentals.filter(r => r.status === 'active' || r.status === 'upcoming').length}</div><div className="text-gray-600">Active/Upcoming</div></div>
        </div>
      </div>
    </div>
  )
}

export default RentalHistory