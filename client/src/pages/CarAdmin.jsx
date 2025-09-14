import { useEffect, useState } from 'react'
import carService from '../services/carService'
import { toast } from '../services/toastBus'

export default function CarAdmin() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ model:'', licensePlate:'', capacity:'', pricePerKm:'', pricePerDay:'' })
  const [creating, setCreating] = useState(false)

  const load = async () => {
    setLoading(true)
    try { const data = await carService.list(); setCars(data) } catch(e){ toast.error(e.message||'Failed to load cars') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() },[])

  const handleChange = (e) => {
    const { name, value } = e.target; setForm(f=>({...f,[name]:value}))
  }

  const handleCreate = async (e) => {
    e.preventDefault(); setCreating(true)
    try {
      const payload = { ...form, capacity:Number(form.capacity)||1 }
      await carService.create(payload)
      toast.success('Car created')
      setForm({ model:'', licensePlate:'', capacity:'', pricePerKm:'', pricePerDay:'' })
      load()
    } catch(e){ toast.error(e.message||'Create failed') } finally { setCreating(false) }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-white mb-6">Manage Cars</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 card p-6">
          <h2 className="font-medium text-white mb-4">Add Car</h2>
          <form onSubmit={handleCreate} className="space-y-4 text-sm">
            {['model','licensePlate','capacity','pricePerKm','pricePerDay'].map(f=> (
              <label key={f} className="block">
                <span className="block text-[11px] uppercase tracking-wide text-gray-400 mb-1">{f}</span>
                <input name={f} value={form[f]} onChange={handleChange} className="w-full rounded-md bg-white/90 border border-gray-300 px-3 py-2 text-gray-900" placeholder={f} />
              </label>
            ))}
            <button disabled={creating} className="btn btn-primary w-full disabled:opacity-50">{creating? 'Creating…':'Create Car'}</button>
          </form>
        </div>
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-medium text-white mb-4">Existing Cars</h2>
          {loading && <div className="text-xs text-gray-400">Loading…</div>}
          {!loading && cars.length===0 && <div className="text-xs text-gray-400">No cars found.</div>}
          <div className="divide-y divide-gray-800 mt-2">
            {cars.map(c => (
              <div key={c._id || c.id} className="py-4 flex items-center gap-4 text-sm">
                <div className="w-16 h-12 rounded-md bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-[9px] text-gray-400 uppercase tracking-wide">Img</div>
                <div className="flex-1">
                  <div className="font-medium text-white flex items-center gap-2">
                    {c.model} <span className="text-gray-500">#{c.licensePlate}</span>
                  </div>
                  <div className="text-[11px] text-gray-500">Cap: {c.capacity} | /km {c.pricePerKm || '-'} | /day {c.pricePerDay || '-'}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">{c.status}</span>
                  <a href={`/admin/cars/${c._id || c.id}`} className="text-[11px] text-blue-400 hover:text-blue-300">View</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
