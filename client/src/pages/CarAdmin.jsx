import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import carService from '../services/carService'
import { toast } from '../services/toastBus'

export default function CarAdmin() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try { const data = await carService.list(); setCars(data) } catch(e){ toast.error(e.message||'Failed to load cars') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() },[])

  // Creation moved to CarCreateAdmin page

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Cars</h1>
        <Link to="/admin/cars/new" className="btn btn-primary text-xs">Add Car</Link>
      </div>
      {loading && <div className="text-xs text-gray-400">Loading cars…</div>}
      {!loading && cars.length===0 && <div className="text-xs text-gray-400">No cars found.</div>}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cars.map(c => (
          <Link to={`/admin/cars/${c._id || c.id}`} key={c._id || c.id} className="group relative rounded-xl border border-[var(--mono-border)] bg-[var(--mono-bg-2)] p-4 flex flex-col gap-3 hover:border-gray-500 transition-colors shadow-token">
            <div className="w-full h-32 rounded-md bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-[10px] text-gray-500 uppercase tracking-wide">Car Image</div>
            <div className="flex-1 flex flex-col">
              <div className="text-sm font-medium text-white flex items-center gap-2 mb-1">{c.model} <span className="text-gray-500">#{c.licensePlate}</span></div>
              <div className="text-[11px] text-gray-500 mb-2">Cap {c.capacity} • /km {c.pricePerKm||'-'} • /day {c.pricePerDay||'-'}</div>
              <span className="mt-auto inline-block w-fit px-2 py-0.5 rounded bg-[var(--mono-bg-3)] text-[10px] tracking-wide text-gray-300">{c.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
