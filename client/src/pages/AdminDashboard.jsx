import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import adminDashboardService from '../services/adminDashboardService'
import { toast } from '../services/toastBus'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    let mounted = true
    const load = async () => {
      setLoading(true)
      try { const data = await adminDashboardService.overview(); if (mounted) setStats(data) }
      catch(e){ toast.error(e.message || 'Failed to load overview') }
      finally { if (mounted) setLoading(false) }
    }
    load(); return ()=>{ mounted = false }
  },[])

  const statItems = [
    { key:'totalRides', label:'Total Rides' },
    { key:'totalRentals', label:'Total Rentals' },
    { key:'activeBookings', label:'Active Bookings' },
    { key:'totalRevenue', label:'Total Revenue' },
    { key:'pendingPayments', label:'Pending Payments' },
    { key:'driversOnline', label:'Drivers Online' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-3">Platform Overview</h1>
        <p className="text-gray-400 text-sm">Operational snapshot & quick actions for administration.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-12">
        {statItems.map(item => (
          <div key={item.key} className="relative overflow-hidden rounded-xl border border-[var(--mono-border)] bg-[var(--mono-bg-2)] p-4 shadow-token">
            <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">{item.label}</div>
            <div className="text-xl font-semibold text-white tabular-nums">
              {loading ? '…' : (stats?.[item.key] ?? 0)}
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(circle_at_30%_30%,#fff,transparent_60%)]" />
          </div>
        ))}
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
              <Link to="/admin/cars" className="btn btn-muted text-xs px-4 py-2">Add New Car</Link>
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
              <Link to="/admin/drivers" className="btn btn-muted text-xs px-4 py-2">Add Driver</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500">Logged in as: {user?.email} ({user?.role})</div>
    </div>
  )
}
