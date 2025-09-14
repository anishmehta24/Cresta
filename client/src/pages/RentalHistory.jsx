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

const RentalHistory = () => {
  const navigate = useNavigate()
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

  const filteredRentals = rentals.filter(r => filter === 'all' ? true : r.status === filter)
  const tabs = [
    { key: 'all', label: 'All Rentals', count: rentals.length },
    { key: 'active', label: 'Active', count: rentals.filter(r => r.status === 'active').length },
    { key: 'upcoming', label: 'Upcoming', count: rentals.filter(r => r.status === 'upcoming').length },
    { key: 'completed', label: 'Completed', count: rentals.filter(r => r.status === 'completed').length },
    { key: 'cancelled', label: 'Cancelled', count: rentals.filter(r => r.status === 'cancelled').length },
  ]

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

  const cancelRental = async (id) => {
    if (!window.confirm('Cancel this rental?')) return
    try {
      await bookingService.cancelRental(id)
      setRentals(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r))
    } catch (e) { alert(e.message || 'Failed to cancel rental') }
  }

  const extendRental = (rentalId) => {
    console.log('Extending rental:', rentalId)
    alert('Redirecting to extension page...')
  }

  const rebookRental = (rental) => {
    try {
      const carIds = rental.cars.map(c => c.refId || c.id).filter(Boolean)
      navigate('/rent-car', {
        state: {
          rebook: true,
          pickupAddress: rental.pickupLocation,
          startDate: rental.startDate,
          endDate: rental.endDate !== '-' ? rental.endDate : rental.startDate,
          carIds
        }
      })
    } catch {
      navigate('/rent-car')
    }
  }

  const empty = filteredRentals.length === 0

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">My Rentals</h1>
          <p className="text-sm text-gray-500">Track and manage your rentals.</p>
        </div>
        <Link to="/rent-car" className="btn btn-primary text-sm font-semibold">New Rental</Link>
      </div>
      <Tabs tabs={tabs} initial={filter} onChange={setFilter} />
      <ErrorMessage message={error} />
      {loading && (
        <div className="mt-8 space-y-4">{Array.from({length:3}).map((_,i)=>(<Skeleton key={i} className="h-48 rounded-xl" />))}</div>
      )}
      {empty && !loading && (
        <div className="mt-12"><EmptyState title={filter==='all' ? 'No rentals yet' : 'Nothing here'} message="Your rentals will appear here once created." action={<Link to="/rent-car" className="btn btn-primary">Browse Cars</Link>} /></div>
      )}
      {!empty && (
        <div className="mt-8 space-y-6">
          {filteredRentals.map((rental) => (
            <div key={rental.id} className="bg-white rounded-xl shadow-token p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-base font-semibold text-gray-900 tracking-tight">#{rental.id}</span>
                      <StatusBadge status={rental.status} />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{formatINR(rental.totalAmount)}</div>
                      <div className="text-xs text-gray-500">{getDurationText(rental.startDate, rental.endDate)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Rental Period</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-600">Start:</span><span className="font-medium text-gray-900">{rental.startDate}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">End:</span><span className="font-medium text-gray-900">{rental.endDate}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Duration:</span><span className="font-medium text-gray-900">{getDurationText(rental.startDate, rental.endDate)}</span></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Locations</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-600">Pickup:</span><div className="font-medium text-gray-900">{rental.pickupLocation}</div></div>
                        <div><span className="text-gray-600">Return:</span><div className="font-medium text-gray-900">{rental.returnLocation}</div></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-600">Cars:</span><span className="font-medium text-gray-900">{getTotalCars(rental.cars)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Booked:</span><span className="font-medium text-gray-900">{rental.bookingDate}</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Rented Vehicles</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-3">
                        {rental.cars.map((car, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{car.name}</div>
                                <div className="text-sm text-gray-600 capitalize">{car.category} • Qty: {car.quantity}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">{car.pricePerDay ? `${formatINR(car.pricePerDay)}/day` : '—'}</div>
                              <div className="text-sm text-gray-600">{car.totalDays} days</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {rental.status === 'cancelled' && rental.cancelReason && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{rental.cancelReason}</div>
                  )}
                  <div className="flex flex-wrap gap-3">
                    {rental.status === 'upcoming' && (
                      <>
                        <button onClick={() => cancelRental(rental.id)} className="px-3 py-2 text-xs font-medium rounded-md border border-red-300 text-red-600 hover:bg-red-50">Cancel</button>
                        <button className="px-3 py-2 text-xs font-medium rounded-md border border-blue-300 text-blue-600 hover:bg-blue-50">Modify</button>
                      </>
                    )}
                    {rental.status === 'active' && (
                      <>
                        <button onClick={() => extendRental(rental.id)} className="px-3 py-2 text-xs font-medium rounded-md border border-green-300 text-green-600 hover:bg-green-50">Extend</button>
                        <button className="px-3 py-2 text-xs font-medium rounded-md border border-blue-300 text-blue-600 hover:bg-blue-50">Return Early</button>
                      </>
                    )}
                    {(rental.status === 'completed' || rental.status === 'cancelled') && (
                      <button onClick={() => rebookRental(rental)} className="px-3 py-2 text-xs font-medium rounded-md border border-blue-300 text-blue-600 hover:bg-blue-50">Book Again</button>
                    )}
                    {(rental.status === 'completed' || rental.status === 'active') && (
                      <button className="px-3 py-2 text-xs font-medium rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">Invoice</button>
                    )}
                    <button className="px-3 py-2 text-xs font-medium rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">Support</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!empty && (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="stat-card text-center"><div className="text-2xl font-semibold mb-1 text-blue-600">{rentals.filter(r => r.status === 'completed').length}</div><p className="text-xs tracking-wide uppercase text-gray-500">Completed</p></div>
          <div className="stat-card text-center"><div className="text-2xl font-semibold mb-1 text-green-600">{formatINR(rentals.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.totalAmount, 0))}</div><p className="text-xs tracking-wide uppercase text-gray-500">Total Spent</p></div>
          <div className="stat-card text-center"><div className="text-2xl font-semibold mb-1 text-purple-600">{rentals.reduce((sum, r) => sum + getTotalCars(r.cars), 0)}</div><p className="text-xs tracking-wide uppercase text-gray-500">Cars Rented</p></div>
          <div className="stat-card text-center"><div className="text-2xl font-semibold mb-1 text-orange-600">{rentals.filter(r => r.status === 'active' || r.status === 'upcoming').length}</div><p className="text-xs tracking-wide uppercase text-gray-500">Active/Upcoming</p></div>
        </div>
      )}
    </div>
  )
}

export default RentalHistory