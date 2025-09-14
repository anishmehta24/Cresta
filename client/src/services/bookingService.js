import apiClient from './apiClient'

// Helper to build location object from string only (placeholder)
const buildLocation = (address) => ({ address, coordinates: [0,0] })

const bookingService = {
  // Ride booking
  createRide: async ({ pickupAddress, dropoffAddress, startTime, carIds }) => {
    const payload = {
      startTime,
      pickupLocation: buildLocation(pickupAddress),
      dropoffLocation: buildLocation(dropoffAddress),
      cars: carIds.map(id => ({ carId: id }))
    }
    const { data } = await apiClient.post('/rides', payload)
    return data.ride
  },
  // Rental booking
  createRental: async ({ pickupAddress, startTime, endTime, carIds }) => {
    const payload = {
      startTime,
      endTime,
      pickupLocation: buildLocation(pickupAddress),
      cars: carIds.map(id => ({ carId: id }))
    }
    const { data } = await apiClient.post('/rentals', payload)
    return data.rental
  },
  // User rides / rentals
  getUserRides: async (userId) => {
    const { data } = await apiClient.get(`/rides/user/${userId}`)
    return data.rides
  },
  getUserRentals: async (userId) => {
    const { data } = await apiClient.get(`/rentals/user/${userId}`)
    return data.rentals
  },
  // Car listing with filters
  getCars: async (params={}) => {
    const { data } = await apiClient.get('/cars', { params })
    return data.cars || data
  },
  getCarById: async (id) => {
    const { data } = await apiClient.get(`/cars/${id}`)
    return data.car
  },
  // Dashboard stats (assumes backend /dashboard/stats or /dashboard)
  getDashboardStats: async () => {
    const { data } = await apiClient.get('/dashboard')
    return data
  },
  getUserStats: async (userId) => {
    const { data } = await apiClient.get(`/users/${userId}/stats`)
    return data
  },
  cancelRide: async (id) => {
    const { data } = await apiClient.post(`/rides/${id}/cancel`)
    return data.booking
  },
  cancelRental: async (id) => {
    const { data } = await apiClient.post(`/rentals/${id}/cancel`)
    return data.booking
  },
  // Basic profile fetch (if needed separate from auth context refresh)
  getUserProfile: async (userId) => {
    const { data } = await apiClient.get(`/users/${userId}`)
    return data.user || data
  }
}

export default bookingService
