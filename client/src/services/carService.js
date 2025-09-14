import apiClient from './apiClient'

const carService = {
  list: async () => {
    const res = await apiClient.get('/cars')
    return res.data.cars || res.data || []
  },
  create: async (payload) => {
    const res = await apiClient.post('/cars', payload)
    return res.data.car || res.data
  },
  update: async (id, payload) => {
    const res = await apiClient.put(`/cars/${id}`, payload)
    return res.data.car || res.data
  },
  get: async (id) => {
    const res = await apiClient.get(`/cars/${id}`)
    return res.data.car || res.data
  },
  remove: async (id) => {
    const res = await apiClient.delete(`/cars/${id}`)
    return res.data
  }
}

export default carService
