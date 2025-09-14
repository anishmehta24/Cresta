import apiClient from './apiClient'

const driverService = {
  list: async () => {
    const res = await apiClient.get('/drivers')
    return res.data.drivers || res.data || []
  },
  create: async (payload) => {
    const res = await apiClient.post('/drivers', payload)
    return res.data.driver || res.data
  },
  update: async (id, payload) => {
    const res = await apiClient.put(`/drivers/${id}`, payload)
    return res.data.driver || res.data
  },
  get: async (id) => {
    const res = await apiClient.get(`/drivers/${id}`)
    return res.data.driver || res.data
  },
  remove: async (id) => {
    const res = await apiClient.delete(`/drivers/${id}`)
    return res.data
  }
}

export default driverService
