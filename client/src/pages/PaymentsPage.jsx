import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import paymentService from '../services/paymentService.js'
import { formatINR } from '../services/currency.js'
import { toast } from '../services/toastBus.js'

const statusStyles = {
  PENDING: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
  PAID: 'bg-green-500/10 text-green-400 border border-green-500/30',
  FAILED: 'bg-red-500/10 text-red-400 border border-red-500/30'
}

export default function PaymentsPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    let mounted = true
    const load = async () => {
      if (!user) return
      setLoading(true)
      try {
        const data = await paymentService.getUserPayments(user._id || user.id)
        if (mounted) setPayments(data)
      } catch (e) {
        toast.error(e.message || 'Failed to load payments')
      } finally { if (mounted) setLoading(false) }
    }
    load()
    return ()=>{ mounted = false }
  }, [user])

  if (!user) {
    return <div className="max-w-4xl mx-auto py-20 px-4"><p className="text-center text-gray-400">Login required.</p></div>
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Payments</h1>
          <p className="text-gray-400 text-sm">History of processed booking payments</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-token overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="py-3 px-4 text-left font-medium">Booking Type</th>
              <th className="py-3 px-4 text-left font-medium">Amount</th>
              <th className="py-3 px-4 text-left font-medium">Method</th>
              <th className="py-3 px-4 text-left font-medium">Status</th>
              <th className="py-3 px-4 text-left font-medium">Created</th>
              <th className="py-3 px-4 text-left font-medium">Transaction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr><td colSpan={6} className="py-16 text-center text-gray-400">Loading payments...</td></tr>
            )}
            {!loading && payments.length === 0 && (
              <tr><td colSpan={6} className="py-16 text-center text-gray-400">No payments yet</td></tr>
            )}
            {!loading && payments.map(p => (
              <tr key={p._id} className="hover:bg-gray-50/60 transition-colors">
                <td className="py-3 px-4 text-gray-900 font-medium">{p.bookingId?.bookingType || 'N/A'}</td>
                <td className="py-3 px-4 text-gray-700">{formatINR(p.amount || p.bookingId?.totalAmount || 0)}</td>
                <td className="py-3 px-4 text-gray-700">{p.method}</td>
                <td className="py-3 px-4"><span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[p.status] || 'bg-gray-500/10 text-gray-500 border border-gray-500/30'}`}>{p.status}</span></td>
                <td className="py-3 px-4 text-gray-600">{new Date(p.createdAt).toLocaleString()}</td>
                <td className="py-3 px-4 text-gray-600 font-mono text-xs">{p.transactionId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
