import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import carService from '../services/carService'
import { toast } from '../services/toastBus'

export default function CarDetailAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ model:'', licensePlate:'', capacity:'', pricePerKm:'', pricePerDay:'', status:'' })

  const load = async () => {
    setLoading(true)
    try { const data = await carService.get(id); setCar(data); setForm({
      model: data.model || '',
      licensePlate: data.licensePlate || '',
      capacity: data.capacity || '',
      pricePerKm: data.pricePerKm || '',
      pricePerDay: data.pricePerDay || '',
      status: data.status || ''
    }) } catch(e){ toast.error(e.message||'Failed to load car') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() },[id])

  const handleChange = (e) => { const { name, value } = e.target; setForm(f=>({...f,[name]:value})) }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try { await carService.update(id, { ...form, capacity:Number(form.capacity)||1 }); toast.success('Car updated'); load() } catch(e){ toast.error(e.message||'Update failed') } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this car?')) return
    try { await carService.remove(id); toast.success('Car deleted'); navigate('/admin/cars') } catch(e){ toast.error(e.message||'Delete failed') }
  }

  if (loading) return <div className="p-10 text-sm text-gray-400">Loading…</div>
  if (!car) return <div className="p-10 text-sm text-gray-400">Car not found</div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-start gap-6">
        <div className="w-56 h-40 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-400 text-xs uppercase tracking-wide">Car Image</div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-white mb-2">{car.model}</h1>
          <p className="text-xs text-gray-400 mb-4">License: {car.licensePlate} • Status: {car.status}</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} className="btn btn-secondary text-xs">Delete</button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="card p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {['model','licensePlate','capacity','pricePerKm','pricePerDay','status'].map(f => (
          <label key={f} className="block">
            <span className="block text-[10px] uppercase tracking-wide text-gray-400 mb-1">{f}</span>
            <input name={f} value={form[f]} onChange={handleChange} className="w-full rounded-md bg-white/90 border border-gray-300 px-3 py-2 text-gray-900" />
          </label>
        ))}
        <div className="md:col-span-2 flex justify-end">
          <button disabled={saving} className="btn btn-primary px-6 disabled:opacity-50">{saving? 'Saving…':'Save Changes'}</button>
        </div>
      </form>
    </div>
  )
}
