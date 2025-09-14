import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import driverService from '../services/driverService'
import { toast } from '../services/toastBus'

export default function DriverAdmin() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try { const data = await driverService.list(); setDrivers(data) } catch(e){ toast.error(e.message||'Failed to load drivers') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() },[])

  // Creation moved to DriverCreateAdmin page

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Drivers</h1>
        <Link to="/admin/drivers/new" className="btn btn-primary text-xs">Add Driver</Link>
      </div>
      {loading && <div className="text-xs text-gray-400">Loading drivers…</div>}
      {!loading && drivers.length===0 && <div className="text-xs text-gray-400">No drivers found.</div>}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {drivers.map(d => {
          const full = d.userId?.fullname
          const name = typeof full === 'string' ? full : [full?.firstname, full?.lastname].filter(Boolean).join(' ') || 'Driver'
          return (
            <Link to={`/admin/drivers/${d._id || d.id}`} key={d._id || d.id} className="group relative rounded-xl border border-[var(--mono-border)] bg-[var(--mono-bg-2)] p-4 flex flex-col gap-3 hover:border-gray-500 transition-colors shadow-token">
              <div className="w-full h-32 rounded-md bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-[10px] text-gray-500 uppercase tracking-wide">Driver Image</div>
              <div className="flex-1 flex flex-col">
                <div className="text-sm font-medium text-white flex items-center gap-2 mb-1">{name} <span className="text-gray-500">#{d.licenseNumber}</span></div>
                <div className="text-[11px] text-gray-500 mb-2">{d.currentCarId ? `Car: ${d.currentCarId.model}` : 'No car assigned'}</div>
                <span className="mt-auto inline-block w-fit px-2 py-0.5 rounded bg-[var(--mono-bg-3)] text-[10px] tracking-wide text-gray-300">{d.status}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
