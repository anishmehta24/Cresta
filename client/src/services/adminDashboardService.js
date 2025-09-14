import apiClient from './apiClient'

const adminDashboardService = {
  overview: async () => {
    const res = await apiClient.get('/dashboard/overview')
    return res.data.overview || res.data
  }
}

export default adminDashboardService
