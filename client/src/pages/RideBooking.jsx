import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from '../services/toastBus'
import { addLocation, getRecentLocations } from '../services/recentLocations'
import bookingService from '../services/bookingService'
import authService from '../services/authService'
import FormInput from '../components/ui/FormInput'
import { Skeleton } from '../components/ui/Skeleton'

const RideBooking = () => {
  const location = useLocation()
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    passengers: '1',
    selectedCar: '',
    notes: ''
  })

  const [showCarSelection, setShowCarSelection] = useState(false)
  const [cars, setCars] = useState([])
  const [carsLoading, setCarsLoading] = useState(false)
  const [carsError, setCarsError] = useState(null)
  const [initializedFromState, setInitializedFromState] = useState(false)
  const [showRebookBanner, setShowRebookBanner] = useState(false)
  const [recent, setRecent] = useState([])

  // Prefill from navigation state (rebook flow)
  useEffect(() => {
    if (initializedFromState) return
    const st = location.state
    if (st && st.rebook) {
      setFormData(prev => ({
        ...prev,
        pickupLocation: st.pickupLocation || prev.pickupLocation,
        dropoffLocation: st.dropoffLocation || prev.dropoffLocation,
        pickupDate: st.pickupDate || prev.pickupDate,
        pickupTime: st.pickupTime || prev.pickupTime,
        selectedCar: st.selectedCar || prev.selectedCar
      }))
      if (st.pickupLocation && st.dropoffLocation) {
        setShowCarSelection(true)
      }
      toast.info('Details prefilled from previous ride', { duration: 3000 })
      setShowRebookBanner(true)
    }
    setInitializedFromState(true)
  }, [location.state, initializedFromState])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLocationSubmit = async (e) => {
    e.preventDefault()
    if (formData.pickupLocation && formData.dropoffLocation) {
      addLocation(formData.pickupLocation)
      addLocation(formData.dropoffLocation)
      setRecent(getRecentLocations())
      setShowCarSelection(true)
      // Fetch available cars when user proceeds
      setCarsLoading(true)
      setCarsError(null)
      try {
        const data = await bookingService.getCars({ status: 'AVAILABLE' })
        setCars(Array.isArray(data) ? data : (data.cars || []))
      } catch (err) {
        setCarsError(err.message || 'Failed to load cars')
      } finally {
        setCarsLoading(false)
      }
    }
  }

  // When car selection is auto-shown via prefill, ensure cars load
  useEffect(() => {
    const shouldLoad = showCarSelection && cars.length === 0 && !carsLoading && !carsError
    if (shouldLoad) {
      (async () => {
        setCarsLoading(true); setCarsError(null)
        try {
          const data = await bookingService.getCars({ status: 'AVAILABLE' })
          setCars(Array.isArray(data) ? data : (data.cars || []))
        } catch (err) { setCarsError(err.message || 'Failed to load cars') }
        finally { setCarsLoading(false) }
      })()
    }
  }, [showCarSelection, cars.length, carsLoading, carsError])

  // Load recent on mount
  useEffect(() => { setRecent(getRecentLocations()) }, [])

  const handleCarSelect = (carId) => {
    setFormData(prev => ({
      ...prev,
      selectedCar: carId
    }))
  }

  const handleBooking = async () => {
    try {
      const user = authService.getCurrentUser()
      const isoStart = new Date(`${formData.pickupDate}T${formData.pickupTime}:00`).toISOString()
      const ride = await bookingService.createRide({
        pickupAddress: formData.pickupLocation,
        dropoffAddress: formData.dropoffLocation,
        startTime: isoStart,
        carIds: [formData.selectedCar]
      })
      console.log('Ride created', ride)
      toast.success('Ride booked successfully')
    } catch (e) {
      toast.error(e.message || 'Booking failed')
    }
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">Book a Ride</h1>
          <p className="text-sm text-gray-500">Enter trip details to see available cars.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {showRebookBanner && (
              <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-300 bg-white shadow-token">
                <div className="w-2 h-2 mt-2 rounded-full bg-gray-900" />
                <div className="flex-1 text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Rebook Prefill:</span> We loaded your previous ride details. Adjust anything before confirming.
                </div>
                <button onClick={()=>setShowRebookBanner(false)} className="text-xs text-gray-500 hover:text-gray-800 font-medium">Dismiss</button>
              </div>
            )}
            <div className="card p-6">
              <form onSubmit={handleLocationSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Pickup Location" name="pickupLocation" value={formData.pickupLocation} onChange={handleInputChange} required placeholder="Enter pickup address" />
                  <FormInput label="Drop-off Location" name="dropoffLocation" value={formData.dropoffLocation} onChange={handleInputChange} required placeholder="Enter destination" />
                </div>
                {recent.length > 0 && (
                  <div className="-mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-[11px] text-gray-500 flex flex-wrap gap-2">
                      {recent.map(r => (
                        <button type="button" key={r} onClick={()=>setFormData(f=>({...f,pickupLocation:r}))} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">
                          {r}
                        </button>
                      ))}
                    </div>
                    <div className="text-[11px] text-gray-500 flex flex-wrap gap-2">
                      {recent.map(r => (
                        <button type="button" key={r+':d'} onClick={()=>setFormData(f=>({...f,dropoffLocation:r}))} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Pickup Date" type="date" name="pickupDate" value={formData.pickupDate} min={new Date().toISOString().split('T')[0]} onChange={handleInputChange} required />
                  <FormInput label="Pickup Time" type="time" name="pickupTime" value={formData.pickupTime} onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="block">
                    <span className="block text-xs font-medium tracking-wide text-gray-600 mb-1 uppercase">Passengers</span>
                    <select name="passengers" value={formData.passengers} onChange={handleInputChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900">
                      {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} Passenger{n>1?'s':''}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="block text-xs font-medium tracking-wide text-gray-600 mb-1 uppercase">Notes (Optional)</span>
                    <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 resize-none" placeholder="Any preferences or instructions" />
                  </label>
                </div>
                {!showCarSelection && (
                  <button type="submit" className="btn btn-primary w-full">Find Available Cars</button>
                )}
              </form>
            </div>
            {showCarSelection && (
              <div className="card p-6">
                <h3 className="text-base font-semibold tracking-tight text-gray-900 mb-6">Choose Your Ride</h3>
                {carsLoading && <div className="space-y-3">{Array.from({length:3}).map((_,i)=>(<Skeleton key={i} className="h-20 rounded-lg" />))}</div>}
                {carsError && <div className="text-xs text-red-600">{carsError}</div>}
                {!carsLoading && !carsError && cars.length === 0 && <div className="text-xs text-gray-500">No cars available for that time.</div>}
                <div className="space-y-3">
                  {cars.map(car => {
                    const selected = formData.selectedCar === (car._id || car.id)
                    return (
                      <button type="button" onClick={()=>handleCarSelect(car._id || car.id)} key={car._id || car.id} className={`w-full text-left border rounded-lg px-4 py-3 flex items-center justify-between transition ${selected? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{car.make ? `${car.make} ${car.model}` : car.name || 'Car'}</div>
                          <div className="text-xs text-gray-500 capitalize">{car.type || car.category || ''}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          {car.ratePerKm && <span className="text-[10px] text-gray-500">{car.ratePerKm} /km</span>}
                          {car.ratePerMin && <span className="text-[10px] text-gray-500">{car.ratePerMin} /min</span>}
                          <span className={`w-3 h-3 rounded-full border ${selected? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}></span>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {formData.selectedCar && (
                  <button onClick={handleBooking} className="btn btn-primary w-full mt-6">Confirm Booking</button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h3 className="text-sm font-medium tracking-wide uppercase text-gray-500 mb-4">Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup:</span>
                  <span className="font-medium text-gray-900">
                    {formData.pickupLocation || 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Drop-off:</span>
                  <span className="font-medium text-gray-900">
                    {formData.dropoffLocation || 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium text-gray-900">
                    {formData.pickupDate && formData.pickupTime 
                      ? `${formData.pickupDate} ${formData.pickupTime}`
                      : 'Not selected'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passengers:</span>
                  <span className="font-medium text-gray-900">{formData.passengers}</span>
                </div>
                {formData.selectedCar && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Car:</span>
                    <span className="font-medium text-gray-900">{
                      (() => {
                        const c = cars.find(x => (x._id || x.id) === formData.selectedCar)
                        if (!c) return formData.selectedCar
                        return c.make ? `${c.make} ${c.model}` : (c.model || c.name || formData.selectedCar)
                      })()
                    }</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Why Choose Our Rides?</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Professional drivers
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Clean, maintained vehicles
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    24/7 customer support
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Real-time tracking
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RideBooking