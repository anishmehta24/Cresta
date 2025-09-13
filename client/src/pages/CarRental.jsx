import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import bookingService from '../services/bookingService'
import authService from '../services/authService'

const CarRental = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    transmission: 'all',
    fuelType: 'all'
  })

  const [rentalCart, setRentalCart] = useState([])
  const [cars, setCars] = useState([])
  const [carsLoading, setCarsLoading] = useState(false)
  const [carsError, setCarsError] = useState(null)
  const [pickupAddress, setPickupAddress] = useState('')
  const [rentalDates, setRentalDates] = useState({ start: '', end: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    const loadCars = async () => {
      setCarsLoading(true)
      setCarsError(null)
      try {
        const data = await bookingService.getCars({ status: 'AVAILABLE' })
        const list = Array.isArray(data) ? data : (data.cars || [])
        if (mounted) setCars(list)
      } catch (e) {
        if (mounted) setCarsError(e.message || 'Failed to load cars')
      } finally {
        if (mounted) setCarsLoading(false)
      }
    }
    loadCars()
    return () => { mounted = false }
  }, [])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const addToCart = (car) => {
    setRentalCart(prev => {
      const key = car._id || car.id
      const existingItem = prev.find(item => item.key === key)
      if (existingItem) {
        return prev.map(item =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { key, ref: car, quantity: 1 }]
    })
  }

  const removeFromCart = (key) => {
    setRentalCart(prev => prev.filter(item => item.key !== key))
  }

  const updateQuantity = (key, delta) => {
    setRentalCart(prev => prev.map(item => item.key === key ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))
  }

  const canSubmit = rentalCart.length > 0 && rentalDates.start && rentalDates.end && pickupAddress && !submitting

  const submitRental = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const isoStart = new Date(`${rentalDates.start}T00:00:00`).toISOString()
      const isoEnd = new Date(`${rentalDates.end}T23:59:59`).toISOString()
      const carIds = rentalCart.flatMap(item => Array(item.quantity).fill(item.key))
      await bookingService.createRental({
        pickupAddress,
        startTime: isoStart,
        endTime: isoEnd,
        carIds
      })
      alert('Rental created successfully')
      setRentalCart([])
      setPickupAddress('')
      setRentalDates({ start: '', end: '' })
    } catch (e) {
      alert(e.message || 'Failed to create rental')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredCars = cars.filter(car => {
    const category = (car.type || car.category || '').toLowerCase()
    if (filters.category !== 'all' && category !== filters.category) return false
    if (filters.priceRange !== 'all') {
      const [min, maxRaw] = filters.priceRange.split('-')
      const minVal = Number(min)
      const maxVal = maxRaw ? Number(maxRaw) : undefined
      const price = car.pricePerDay || 0
      if (maxVal && (price < minVal || price > maxVal)) return false
      if (!maxVal && price < minVal) return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Car Rental</h1>
              <p className="text-gray-600">Choose from our wide selection of vehicles</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                to="/rental-cart"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h2m0 0h10m-10 0L5.4 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                Rental Cart ({rentalCart.length})
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="compact">Compact</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Day
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Prices</option>
                  <option value="0-40">$0 - $40</option>
                  <option value="41-70">$41 - $70</option>
                  <option value="71-100">$71 - $100</option>
                  <option value="100">$100+</option>
                </select>
              </div>

              {/* Transmission Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission
                </label>
                <select
                  value={filters.transmission}
                  onChange={(e) => handleFilterChange('transmission', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              {/* Fuel Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({
                  category: 'all',
                  priceRange: 'all',
                  transmission: 'all',
                  fuelType: 'all'
                })}
                className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Car Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                {carsLoading ? 'Loading cars...' : carsError ? 'Error loading cars' : `Showing ${filteredCars.length} of ${cars.length} vehicles`}
              </p>
            </div>

            {/* Rental Parameters */}
            <div className="mb-6 bg-white rounded-xl shadow p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Rental Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Pickup Address</label>
                  <input value={pickupAddress} onChange={e=>setPickupAddress(e.target.value)} placeholder="Enter pickup location" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                  <input type="date" value={rentalDates.start} min={new Date().toISOString().split('T')[0]} onChange={e=>setRentalDates(d=>({...d,start:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                  <input type="date" value={rentalDates.end} min={rentalDates.start || new Date().toISOString().split('T')[0]} onChange={e=>setRentalDates(d=>({...d,end:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="flex gap-2">
                  <button disabled={!canSubmit} onClick={submitRental} className={`mt-5 flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${canSubmit ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>{submitting ? 'Submitting...' : 'Create Rental'}</button>
                </div>
              </div>
              {rentalCart.length > 0 && (
                <div className="mt-4 text-xs text-gray-600">
                  {rentalCart.length} distinct cars selected; total units {rentalCart.reduce((s,i)=>s+i.quantity,0)}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {carsLoading && <div className="col-span-full text-gray-500 text-sm">Loading cars...</div>}
              {carsError && <div className="col-span-full text-red-500 text-sm">{carsError}</div>}
              {!carsLoading && !carsError && filteredCars.map((car) => {
                const key = car._id || car.id
                const inCart = rentalCart.find(i => i.key === key)
                return (
                <div key={key} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                  {/* Car Image */}
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                        </svg>
                        <span className="text-sm">{car.model || car.name}</span>
                      </div>
                    </div>
                    {car.status && car.status !== 'AVAILABLE' && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Unavailable
                      </div>
                    )}
                  </div>

                  {/* Car Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{car.model || car.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs mr-2">{(car.type || car.category || 'general').toLowerCase()}</span>
                      <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs">capacity: {car.capacity}</span>
                    </div>

                    {/* Car Specs */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        {car.capacity} seats
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2" />
                        </svg>
                        Added: {inCart ? inCart.quantity : 0}
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        {car.pricePerDay ? (
                          <>
                            <span className="text-2xl font-bold text-gray-900">${car.pricePerDay}</span>
                            <span className="text-gray-600">/day</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">No daily rate</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {inCart && (
                          <div className="flex items-center gap-1">
                            <button onClick={()=>updateQuantity(key,-1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs">-</button>
                            <span className="text-sm font-medium w-6 text-center">{inCart.quantity}</span>
                            <button onClick={()=>updateQuantity(key,1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs">+</button>
                            <button onClick={()=>removeFromCart(key)} className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">x</button>
                          </div>
                        )}
                        {!inCart && (
                          <button
                            onClick={() => addToCart(car)}
                            disabled={car.status && car.status !== 'AVAILABLE'}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                              (!car.status || car.status === 'AVAILABLE')
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {(car.status && car.status !== 'AVAILABLE') ? 'Unavailable' : 'Add'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )})}
            </div>

            {!carsLoading && !carsError && filteredCars.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.529-.607-6.44-1.677A7.962 7.962 0 016 9.29C6 5.696 8.954 3 12.5 3s6.5 2.696 6.5 6.29a7.962 7.962 0 01-.56 2.97z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarRental