import { useEffect, useState } from 'react'
import driverService from '../services/driverService'
import { toast } from '../services/toastBus'

export default function DriverAdmin() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ userId:'', licenseNumber:'' })
  const [creating, setCreating] = useState(false)

  const load = async () => {
    setLoading(true)
    try { const data = await driverService.list(); setDrivers(data) } catch(e){ toast.error(e.message||'Failed to load drivers') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() },[])

  const handleChange = (e) => { const { name, value } = e.target; setForm(f=>({...f,[name]:value})) }

  const handleCreate = async (e) => {
    e.preventDefault(); setCreating(true)
    try {
      await driverService.create(form)
      toast.success('Driver created')
      setForm({ userId:'', licenseNumber:'' })
      load()
    } catch(e){ toast.error(e.message||'Create failed') } finally { setCreating(false) }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-white mb-6">Manage Drivers</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 card p-6">
          <h2 className="font-medium text-white mb-4">Add Driver</h2>
          <form onSubmit={handleCreate} className="space-y-4 text-sm">
            {['userId','licenseNumber'].map(f => (
              <label key={f} className="block">
                <span className="block text-[11px] uppercase tracking-wide text-gray-400 mb-1">{f}</span>
                <input name={f} value={form[f]} onChange={handleChange} className="w-full rounded-md bg-white/90 border border-gray-300 px-3 py-2 text-gray-900" placeholder={f} />
              </label>
            ))}
            <button disabled={creating} className="btn btn-primary w-full disabled:opacity-50">{creating? 'Creating…':'Create Driver'}</button>
          </form>
        </div>
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-medium text-white mb-4">Existing Drivers</h2>
          {loading && <div className="text-xs text-gray-400">Loading…</div>}
          {!loading && drivers.length===0 && <div className="text-xs text-gray-400">No drivers found.</div>}
          <div className="divide-y divide-gray-800 mt-2">
            {drivers.map(d => (
              <div key={d._id || d.id} className="py-4 flex items-center gap-4 text-sm">
                <div className="w-16 h-12 rounded-md bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-[9px] text-gray-400 uppercase tracking-wide">Img</div>
                <div className="flex-1">
                  <div className="font-medium text-white flex items-center gap-2">
                    {d.userId?.fullname?.firstname || 'User'} <span className="text-gray-500">#{d.licenseNumber}</span>
                  </div>
                  <div className="text-[11px] text-gray-500">Status: {d.status}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">{d.currentCarId ? 'ASSIGNED' : 'UNASSIGNED'}</span>
                  <a href={`/admin/drivers/${d._id || d.id}`} className="text-[11px] text-blue-400 hover:text-blue-300">View</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
