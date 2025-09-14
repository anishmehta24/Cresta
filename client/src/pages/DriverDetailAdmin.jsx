import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import driverService from '../services/driverService'
import { toast } from '../services/toastBus'

export default function DriverDetailAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [driver, setDriver] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ licenseNumber:'', status:'', currentCarId:'' })

  const load = async () => {
    setLoading(true)
    try { const data = await driverService.get(id); setDriver(data); setForm({
      licenseNumber: data.licenseNumber || '',
      status: data.status || '',
      currentCarId: data.currentCarId || ''
    }) } catch(e){ toast.error(e.message||'Failed to load driver') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() },[id])

  const handleChange = (e) => { const { name, value } = e.target; setForm(f=>({...f,[name]:value})) }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try { await driverService.update(id, form); toast.success('Driver updated'); load() } catch(e){ toast.error(e.message||'Update failed') } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this driver?')) return
    try { await driverService.remove(id); toast.success('Driver deleted'); navigate('/admin/drivers') } catch(e){ toast.error(e.message||'Delete failed') }
  }

  if (loading) return <div className="p-10 text-sm text-gray-400">Loading…</div>
  if (!driver) return <div className="p-10 text-sm text-gray-400">Driver not found</div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-start gap-6">
        <div className="w-56 h-40 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-400 text-xs uppercase tracking-wide">Driver Image</div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-white mb-2">{driver.userId?.fullname?.firstname || 'Driver'} {driver.userId?.fullname?.lastname}</h1>
          <p className="text-xs text-gray-400 mb-4">License: {driver.licenseNumber} • Status: {driver.status}</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} className="btn btn-secondary text-xs">Delete</button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="card p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {['licenseNumber','status','currentCarId'].map(f => (
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
