import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState, useMemo } from 'react'
import adminDashboardService from '../services/adminDashboardService'
import { toast } from '../services/toastBus'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const data = await adminDashboardService.overview();
        if (mounted) setOverview(data)
      } catch(e){
        toast.error(e.message || 'Failed to load overview')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load();
    return ()=>{ mounted = false }
  },[])

  const stats = overview?.stats || {}
  const recentBookings = overview?.recentBookings || []

  const statItems = useMemo(()=>[
    { key:'totalUsers', label:'Users' },
    { key:'totalCars', label:'Cars' },
    { key:'totalDrivers', label:'Drivers' },
    { key:'totalBookings', label:'Bookings' },
    { key:'totalPayments', label:'Payments' },
    { key:'activeRides', label:'Active Rides' },
    { key:'activeRentals', label:'Active Rentals' },
    { key:'availableCars', label:'Avail. Cars' },
    { key:'availableDrivers', label:'Avail. Drivers' },
    { key:'totalRevenue', label:'Revenue (INR)' }
  ],[])

  const formatINR = (val)=> new Intl.NumberFormat('en-IN',{ style:'currency', currency:'INR', maximumFractionDigits:0 }).format(val||0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-3">Platform Overview</h1>
        <p className="text-gray-400 text-sm">Operational snapshot & quick actions for administration.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4 mb-12">
        {statItems.map(item => {
          const value = stats[item.key]
          const display = item.key === 'totalRevenue' ? formatINR(value) : (value ?? 0)
          return (
            <div key={item.key} className="relative overflow-hidden rounded-xl border border-[var(--mono-border)] bg-[var(--mono-bg-2)] p-4 shadow-token">
              <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">{item.label}</div>
              <div className="text-xl font-semibold text-white tabular-nums">
                {loading ? '…' : display}
              </div>
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(circle_at_30%_30%,#fff,transparent_60%)]" />
            </div>
          )
        })}
      </div>

      {/* Recent Bookings */}
      <div className="card p-6 mb-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
          <span className="text-[10px] uppercase tracking-wide text-gray-500">Last {recentBookings.length} records</span>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-gray-500 border-b border-[var(--mono-border)]">
                <th className="py-2 pr-4 font-medium">User</th>
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Car(s)</th>
                <th className="py-2 pr-4 font-medium">Amount</th>
                <th className="py-2 pr-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--mono-border)]">
              {loading && (
                <tr><td colSpan={6} className="py-6 text-center text-gray-500">Loading…</td></tr>
              )}
              {!loading && recentBookings.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-gray-500">No recent bookings</td></tr>
              )}
              {!loading && recentBookings.map(b => {
                const carModels = (b.cars || []).map(c => c.carId?.model || '—').filter(Boolean).join(', ')
                // Handle fullname shape: could be string OR { firstname, lastname }
                let displayName = 'User'
                const full = b.userId?.fullname
                if (full) {
                  if (typeof full === 'string') displayName = full
                  else if (typeof full === 'object') {
                    const first = full.firstname || full.first || ''
                    const last = full.lastname || full.last || ''
                    displayName = (first + ' ' + last).trim() || 'User'
                  }
                }
                return (
                  <tr key={b._id} className="hover:bg-[var(--mono-bg-3)]/40 transition-colors">
                    <td className="py-2 pr-4 text-white">{displayName}</td>
                    <td className="py-2 pr-4">{b.bookingType}</td>
                    <td className="py-2 pr-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-[var(--mono-bg-3)] text-[10px] tracking-wide">{b.status}</span>
                    </td>
                    <td className="py-2 pr-4 max-w-[140px] truncate">{carModels || '—'}</td>
                    <td className="py-2 pr-4">{formatINR(b.totalAmount || 0)}</td>
                    <td className="py-2 pr-4 text-gray-400">{new Date(b.createdAt).toLocaleDateString('en-IN', { month:'short', day:'numeric' })}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fleet & Drivers Section with images placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
        <div className="card p-6 flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-48 h-40 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-400 text-xs tracking-wide uppercase">
            Car Image
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white mb-2">Fleet Management</h2>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">Add, audit and maintain vehicles to ensure availability and quality. Keep pricing current and status accurate for dispatch reliability.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/admin/cars" className="btn btn-primary text-xs px-4 py-2">Manage Cars</Link>
              <Link to="/admin/cars/new" className="btn btn-muted text-xs px-4 py-2">Add New Car</Link>
            </div>
          </div>
        </div>
        <div className="card p-6 flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-48 h-40 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-400 text-xs tracking-wide uppercase">
            Driver Image
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white mb-2">Driver Operations</h2>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">Onboard, validate and monitor driver performance. Maintain compliance and availability to match demand surges.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/admin/drivers" className="btn btn-primary text-xs px-4 py-2">Manage Drivers</Link>
              <Link to="/admin/drivers/new" className="btn btn-muted text-xs px-4 py-2">Add Driver</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500">Logged in as: {user?.email} ({user?.role})</div>
    </div>
  )
}
