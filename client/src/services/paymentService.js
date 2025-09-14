import apiClient from './apiClient'

const paymentService = {
  async getUserPayments(userId) {
    const { data } = await apiClient.get(`/payments/user/${userId}`)
    return data.payments || []
  }
}

export default paymentService
